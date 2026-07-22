# -*- coding: utf-8 -*-
import os
import json
import logging
import argparse
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional, Any, Tuple

from src.shared.config import settings
from src.shared.models import SeedProfile, PostInfo, EnrichedSeedProfile
from src.shared.llm_client import LLMClient
from src.fetchers.session_bootstrap import load_session_cookies

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# --- Scraping Providers ---

def fetch_instaloader(username: str) -> Optional[dict]:
    """Primary live path: fetch unauthenticated profile using Instaloader."""
    try:
        import instaloader
        logger.info(f"[Instaloader] Attempting live fetch for username: {username}")
        L = instaloader.Instaloader(download_pictures=False, download_videos=False, download_comments=False)
        if settings.scraper_proxy:
            logger.info(f"[Instaloader] Applying proxy: {settings.scraper_proxy}")
            L.context._session.proxies = {
                "http": settings.scraper_proxy,
                "https": settings.scraper_proxy
            }
        profile = instaloader.Profile.from_username(L.context, username)
        
        posts = []
        for post in profile.get_posts():
            posts.append({
                "caption": post.caption or "",
                "date": post.date_utc.isoformat() if post.date_utc else "",
                "likes": post.likes,
                "comments": post.comments
            })
            if len(posts) >= 10:
                break

        return {
            "username": profile.username,
            "biography": profile.biography or "",
            "followers_count": profile.followers,
            "posts_count": profile.mediacount,
            "recent_posts": posts
        }
    except Exception as e:
        logger.warning(f"[Instaloader] Failed to fetch '{username}': {e}")
        return None


def fetch_playwright(username: str) -> Optional[dict]:
    """Authenticated fallback path: fetch profile using Playwright session and in-page API evaluate."""
    try:
        from playwright.sync_api import sync_playwright
        logger.info(f"[Playwright] Attempting fallback fetch for username: {username}")
        
        session_path = settings.instagram_session_path
        cookies = load_session_cookies(session_path)

        with sync_playwright() as p:
            launch_kwargs = {
                "headless": False,
                "args": [
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-setuid-sandbox"
                ]
            }
            try:
                browser = p.chromium.launch(channel="chrome", **launch_kwargs)
            except Exception:
                browser = p.chromium.launch(**launch_kwargs)

            context_kwargs = {
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "viewport": {"width": 1280, "height": 800},
                "locale": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
            }
            if settings.scraper_proxy:
                logger.info(f"[Playwright] Applying proxy: {settings.scraper_proxy}")
                context_kwargs["proxy"] = {"server": settings.scraper_proxy}

            context = browser.new_context(**context_kwargs)

            context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            if cookies:
                logger.info(f"[Playwright] Applying {len(cookies)} saved session cookies from '{session_path}'.")
                context.add_cookies(cookies)

            captured_info: Dict[str, Any] = {}
            def handle_response(response):
                url = response.url.lower()
                if "web_profile_info" in url or "graphql/query" in url:
                    try:
                        res_json = response.json()
                        if isinstance(res_json, dict) and "data" in res_json:
                            captured_info["data"] = res_json
                    except Exception:
                        pass

            context.on("response", handle_response)
            page = context.new_page()
            logger.info(f"[Playwright] Navigating to profile: https://www.instagram.com/{username}/")
            page.goto(f"https://www.instagram.com/{username}/", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            current_url = page.url.lower()
            if any(k in current_url for k in ["accounts/login", "auth_platform", "recaptcha", "challenge"]):
                logger.warning(f"[Playwright] Session invalid or redirected to auth page: {page.url}")
                browser.close()
                return None

            # 1. Check intercepted network response
            raw_response = captured_info.get("data")

            # 2. If missed, attempt evaluated in-page fetch
            if not raw_response:
                eval_script = """
                async (target_user) => {
                    try {
                        const resp = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${target_user}`, {
                            headers: {
                                'x-ig-app-id': '936619743392459',
                                'x-requested-with': 'XMLHttpRequest'
                            }
                        });
                        if (resp.ok) {
                            return await resp.json();
                        }
                        return null;
                    } catch (e) {
                        return null;
                    }
                }
                """
                raw_response = page.evaluate(eval_script, username)

            # 3. Fallback: extract meta description tag from page HTML
            og_desc = ""
            try:
                meta_el = page.locator("meta[property='og:description']").first
                if meta_el.count() > 0:
                    og_desc = meta_el.get_attribute("content") or ""
            except Exception:
                pass

            browser.close()

            if raw_response and isinstance(raw_response, dict) and "data" in raw_response:
                user_data = raw_response["data"].get("user", {})
                if user_data:
                    biography = user_data.get("biography", "")
                    followers_count = user_data.get("edge_followed_by", {}).get("count", 0)
                    posts_count = user_data.get("edge_owner_to_timeline_media", {}).get("count", 0)
                    edges = user_data.get("edge_owner_to_timeline_media", {}).get("edges", [])
                    
                    posts = []
                    for edge in edges[:10]:
                        node = edge.get("node", {})
                        caption = ""
                        cap_edges = node.get("edge_media_to_caption", {}).get("edges", [])
                        if cap_edges:
                            caption = cap_edges[0].get("node", {}).get("text", "")
                        timestamp = node.get("taken_at_timestamp")
                        date_str = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat() if timestamp else ""
                        likes = node.get("edge_liked_by", {}).get("count", 0)
                        comments = node.get("edge_media_to_comment", {}).get("count", 0)
                        posts.append({"caption": caption, "date": date_str, "likes": likes, "comments": comments})

                    logger.info(f"[Playwright] Successfully extracted live profile data for '{username}'.")
                    return {
                        "username": username,
                        "biography": biography,
                        "followers_count": followers_count,
                        "posts_count": posts_count,
                        "recent_posts": posts
                    }

            if og_desc:
                import re
                logger.info(f"[Playwright] Extracting profile data from meta description fallback for '{username}': '{og_desc}'")
                followers_match = re.search(r'([\d\.\,KkMm]+)\s+Followers', og_desc)
                posts_match = re.search(r'([\d\.\,KkMm]+)\s+Posts', og_desc)

                def parse_num(val_str: Optional[str]) -> int:
                    if not val_str:
                        return 0
                    clean = val_str.replace(',', '').strip().upper()
                    if 'K' in clean:
                        return int(float(clean.replace('K', '')) * 1000)
                    if 'M' in clean:
                        return int(float(clean.replace('M', '')) * 1000000)
                    try:
                        return int(float(clean))
                    except Exception:
                        return 0

                followers_cnt = parse_num(followers_match.group(1)) if followers_match else 0
                posts_cnt = parse_num(posts_match.group(1)) if posts_match else 0

                return {
                    "username": username,
                    "biography": f"Instagram profile for {username}",
                    "followers_count": followers_cnt,
                    "posts_count": posts_cnt,
                    "recent_posts": []
                }

            logger.warning(f"[Playwright] Could not fetch profile payload for '{username}'.")
            return None

    except Exception as e:
        logger.warning(f"[Playwright] Failed to fetch '{username}': {e}")
        return None


def fetch_mock(username: str) -> dict:
    """Explicit Mock sandbox provider for deterministic offline testing."""
    import random
    logger.info(f"[Mock] Generating synthetic profile data for username: {username}")
    
    # Deterministic seed per username
    seed_val = int(sum(ord(c) for c in username))
    random.seed(seed_val)

    bios = [
        "Fashion & lifestyle blogger. Ежедневные аутфиты и минималистичный гардероб. ✨ Москва / СПб",
        "Обзоры трендов, стильные капсулы, эстетичные кофеенки. Коллаборации: DM 📩",
        "Личный дневник стиля | Медленная мода и локальные бренды 🌿",
        "Бьюти и фэшн инфлюенсер. Вдохновляю на базовый гардероб.",
        "Fashion enthusiast. Daily OOTD, обзоры масс-маркета и локальных брендов ✨",
        "Модные находки, капсула на каждый день и стиль жизни ☕",
        "Минимализм в одежде, монохромные образы и разборы трендов 🤍"
    ]

    followers = random.randint(4500, 95000)
    posts_cnt = random.randint(50, 400)
    bio = random.choice(bios)

    base_date = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 3))
    
    caption_sets = [
        [
            "Бежевый тренч на осенне-весенний сезон. Как вам образ? 🍂 #ootd #fashion",
            "Минималистичный аутфит: шелковая блуза и брюки палаццо.",
            "Распаковка новинок от локального российского бренда 🤍",
            "Утренний кофе в уютном трикотажном костюме.",
            "Как собрать капсульный гардероб: 5 базовых вещей."
        ],
        [
            "Образ дня в бежевых тонах. Капсула от российских дизайнеров 🌿",
            "Уютный трикотажный сет для прохладных вечеров.",
            "Модный монохромный сет: кашемировый свитер и юбка миди.",
            "Обзор нового осенне-весеннего дропа 💫",
            "Минимализм в деталях: аксессуары для лаконичного образа."
        ],
        [
            "Капсульный гардероб на каждый день: пальто оверсайз и джинсы.",
            "Обзор качественного трикотажа от местных брендов ✨",
            "Бежевые пастельные оттенки — моя любовь в этом сезоне.",
            "Эстетика минимализма: шелковый тотал-лук.",
            "5 правил стильной базовой капсулы на сезон 🤍"
        ],
        [
            "Идеальное бежевое пальто, найденное у локального бренда 🍂",
            "Простой и элегантный дневной лук с прямыми брюками.",
            "Распаковка лаконичной сумки в пастельных тонах ✨",
            "Уютный вечерний свитер оверсайз крупной вязки.",
            "Формируем базовый гардероб без лишних вещей."
        ]
    ]
    
    chosen_captions = caption_sets[seed_val % len(caption_sets)]

    posts = []
    for i in range(5):
        post_date = base_date - timedelta(days=i * random.randint(2, 4))
        likes = random.randint(int(followers * 0.02), int(followers * 0.06))
        comments = random.randint(10, 60)
        posts.append({
            "caption": chosen_captions[i % len(chosen_captions)],
            "date": post_date.isoformat(),
            "likes": likes,
            "comments": comments
        })


    return {
        "username": username,
        "biography": bio,
        "followers_count": followers,
        "posts_count": posts_cnt,
        "recent_posts": posts
    }

# --- LLM Classification & Metrics Calculation ---

def classify_profile_with_llm(biography: str, recent_posts: List[dict], llm_client: Optional[LLMClient] = None) -> dict:
    """Factual classification of language, niche, tone, and sponsorship saturation."""
    default_meta = {
        "language": "ru",
        "niche": "fashion",
        "caption_tone": "friendly",
        "sponsorship_saturation": "low"
    }

    if not llm_client:
        return default_meta

    captions_summary = "\n- ".join([p.get("caption", "") for p in recent_posts[:5] if p.get("caption")])
    prompt = (
        f"Analyze the following Instagram profile metadata and extract factual classifications:\n"
        f"Biography: {biography}\n"
        f"Recent Post Captions:\n- {captions_summary}\n\n"
        f"Return ONLY a raw JSON object with these exact keys:\n"
        f"- language: ISO-639-1 language code (e.g., 'ru', 'en')\n"
        f"- niche: main topic (e.g., 'fashion', 'beauty', 'lifestyle')\n"
        f"- caption_tone: tone of captions (e.g., 'friendly', 'minimalist', 'expert')\n"
        f"- sponsorship_saturation: level of sponsored content ('low', 'medium', 'high')\n"
    )

    messages = [
        {"role": "system", "content": "You are a factual classifier for social media profiles. Output strict JSON only."},
        {"role": "user", "content": prompt}
    ]

    try:
        raw_response = llm_client.generate(messages=messages, temperature=0.1, response_format={"type": "json_object"})
        parsed = json.loads(raw_response)
        return {
            "language": str(parsed.get("language", default_meta["language"])),
            "niche": str(parsed.get("niche", default_meta["niche"])),
            "caption_tone": str(parsed.get("caption_tone", default_meta["caption_tone"])),
            "sponsorship_saturation": str(parsed.get("sponsorship_saturation", default_meta["sponsorship_saturation"]))
        }
    except Exception as e:
        logger.warning(f"LLM factual classification failed: {e}. Falling back to default metadata.")
        return default_meta


def calculate_metrics(raw_data: dict) -> Tuple[float, int]:
    followers = raw_data.get("followers_count", 0)
    posts = raw_data.get("recent_posts", [])

    # ER = avg likes / followers * 100
    if followers > 0 and posts:
        avg_likes = sum(p.get("likes", 0) for p in posts) / len(posts)
        er = round((avg_likes / followers) * 100, 2)
    else:
        er = 0.0

    # Recency = days since last post
    recency = 0
    if posts and posts[0].get("date"):
        try:
            last_date = datetime.fromisoformat(posts[0]["date"])
            now = datetime.now(timezone.utc)
            delta = now - last_date
            recency = max(0, delta.days)
        except Exception:
            recency = 0

    return er, recency


def is_cache_valid(profile_dict: dict, ttl_hours: int) -> bool:
    fetched_at_str = profile_dict.get("fetched_at")
    if not fetched_at_str:
        return False
    try:
        fetched_at = datetime.fromisoformat(fetched_at_str)
        now = datetime.now(timezone.utc)
        hours_diff = (now - fetched_at).total_seconds() / 3600.0
        return hours_diff < ttl_hours
    except Exception:
        return False

# --- Core Enrichment Pipeline ---

def run_enrichment(
    seed_path: str = "data/processed/seed_normalized.json",
    output_path: str = "data/processed/seed_enriched.json",
    use_mock: bool = False,
    force_refresh: bool = False,
    limit: Optional[int] = None
) -> List[EnrichedSeedProfile]:

    logger.info("Starting TICKET-04 Instagram Profile Enrichment Pipeline...")

    if not os.path.exists(seed_path):
        raise FileNotFoundError(f"Input seed file not found: {seed_path}")

    with open(seed_path, "r", encoding="utf-8") as f:
        raw_seed_items = json.load(f)

    valid_seed_profiles = [SeedProfile(**item) for item in raw_seed_items if item.get("is_valid")]
    if limit and limit > 0:
        valid_seed_profiles = valid_seed_profiles[:limit]

    logger.info(f"Loaded {len(valid_seed_profiles)} valid seed profiles for enrichment.")

    # Load existing snapshot cache
    cache: Dict[str, dict] = {}
    if os.path.exists(output_path):
        try:
            with open(output_path, "r", encoding="utf-8") as f:
                cached_items = json.load(f)
                for item in cached_items:
                    username = item.get("username", "").lower()
                    if username:
                        cache[username] = item
            logger.info(f"Loaded {len(cache)} profiles from existing cache: {output_path}")
        except Exception as e:
            logger.warning(f"Failed to read existing cache file '{output_path}': {e}")

    # Initialize LLM client if configured
    llm_client: Optional[LLMClient] = None
    if settings.groq_api_key or settings.openrouter_api_key:
        try:
            llm_client = LLMClient()
            logger.info("LLM Client initialized for factual profile classification.")
        except Exception as e:
            logger.warning(f"Could not initialize LLM Client: {e}")

    enriched_results: List[EnrichedSeedProfile] = []

    for seed in valid_seed_profiles:
        uname_lower = seed.username.lower()

        # Check cache
        if not force_refresh and uname_lower in cache:
            cached_data = cache[uname_lower]
            if is_cache_valid(cached_data, settings.cache_ttl_hours):
                logger.info(f"[Cache Hit] Reusing valid cached snapshot for: {seed.username}")
                enriched_results.append(EnrichedSeedProfile(**cached_data))
                continue

        # Fetch profile
        raw_data: Optional[dict] = None

        if use_mock or settings.scraper_provider == "mock":
            raw_data = fetch_mock(seed.username)
        else:
            session_exists = os.path.exists(settings.instagram_session_path)

            if session_exists:
                # Prioritize Playwright with authenticated session if session file exists
                logger.info(f"Authenticated session file found. Attempting Playwright fetch for '{seed.username}'...")
                raw_data = fetch_playwright(seed.username)

                if not raw_data:
                    logger.info(f"Playwright authenticated fetch failed. Retrying '{seed.username}' with Instaloader...")
                    raw_data = fetch_instaloader(seed.username)
            else:
                # Primary: Instaloader unauthenticated fetch
                raw_data = fetch_instaloader(seed.username)

                if not raw_data:
                    logger.info(f"Instaloader fetch failed. Retrying '{seed.username}' with Playwright...")
                    raw_data = fetch_playwright(seed.username)

        if not raw_data:
            if uname_lower in cache:
                logger.warning(f"Failed to fetch fresh data for '{seed.username}'. Preserving valid previous cache entry in dataset.")
                enriched_results.append(EnrichedSeedProfile(**cache[uname_lower]))
            else:
                logger.error(f"Failed to fetch profile data for '{seed.username}'. Skipping.")
            continue

        # Calculate metrics & LLM classification
        er, recency = calculate_metrics(raw_data)
        llm_meta = classify_profile_with_llm(
            biography=raw_data.get("biography", ""),
            recent_posts=raw_data.get("recent_posts", []),
            llm_client=llm_client
        )

        posts_objects = [PostInfo(**p) for p in raw_data.get("recent_posts", [])]

        enriched_profile = EnrichedSeedProfile(
            username=seed.username,
            biography=raw_data.get("biography", ""),
            followers_count=raw_data.get("followers_count", 0),
            posts_count=raw_data.get("posts_count", 0),
            engagement_rate=er,
            recent_posts=posts_objects,
            activity_recency=recency,
            language=llm_meta["language"],
            niche=llm_meta["niche"],
            caption_tone=llm_meta["caption_tone"],
            sponsorship_saturation=llm_meta["sponsorship_saturation"],
            fetched_at=datetime.now(timezone.utc).isoformat()
        )

        enriched_results.append(enriched_profile)

    # Save to disk
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    serialized = [p.model_dump() for p in enriched_results]
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(serialized, f, ensure_ascii=False, indent=2)

    logger.info(f"Enrichment pipeline completed successfully. Saved {len(enriched_results)} profiles to {output_path}")
    return enriched_results


def main():
    parser = argparse.ArgumentParser(description="TICKET-04 Instagram Profile Enrichment Pipeline")
    parser.add_argument("--mock", action="store_true", help="Explicitly use mock sandbox mode for local offline testing")
    parser.add_argument("--force", action="store_true", help="Force refresh cache regardless of TTL")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of seed profiles to process")
    args = parser.parse_args()

    run_enrichment(
        use_mock=args.mock,
        force_refresh=args.force,
        limit=args.limit
    )

if __name__ == "__main__":
    main()
