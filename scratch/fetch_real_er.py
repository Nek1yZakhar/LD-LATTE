# -*- coding: utf-8 -*-
import json
import re
import time
from playwright.sync_api import sync_playwright
from src.fetchers.session_bootstrap import load_session_cookies
from src.shared.config import settings

usernames = [
    'jd_cosm',
    'dddinaaaaaa',
    'llaurraiiam',
    'bazhenova_alenaa',
    'mishandkatya',
    'v.m.beauty_blog',
    'kristi_naxodka',
    'daria_grogulenko',
    'krrazalia',
    'janestetsiura',
    'armlilitka',
    'aida.mixx',
    'kotova.live',
    'anetboss_',
    '_kate_bruni',
    'juliar_r',
    'zari.ishikhovaa'
]

results = {}

cookies = load_session_cookies(settings.instagram_session_path)

with sync_playwright() as p:
    launch_kwargs = {
        "headless": False,
        "args": ["--disable-blink-features=AutomationControlled", "--no-sandbox"]
    }
    try:
        browser = p.chromium.launch(channel="chrome", **launch_kwargs)
    except Exception:
        browser = p.chromium.launch(**launch_kwargs)

    context_kwargs = {
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "viewport": {"width": 1280, "height": 800}
    }
    if settings.scraper_proxy:
        context_kwargs["proxy"] = {"server": settings.scraper_proxy}

    context = browser.new_context(**context_kwargs)
    if cookies:
        context.add_cookies(cookies)

    page = context.new_page()

    for username in usernames:
        try:
            print(f"Parsing post metrics for @{username}...")
            page.goto(f"https://www.instagram.com/{username}/", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            # Extract followers count from page text or meta
            followers_count = 0
            try:
                meta_el = page.locator("meta[property='og:description']").first
                if meta_el.count() > 0:
                    meta_content = meta_el.get_attribute("content") or ""
                    # e.g. "138K Followers, 491 Following, 2,244 Posts"
                    m = re.search(r'([\d\.,\sKkMm]+)\s+Followers', meta_content)
                    if m:
                        raw_f = m.group(1).replace(' ', '').replace(',', '')
                        if 'K' in raw_f or 'k' in raw_f:
                            followers_count = int(float(raw_f.upper().replace('K', '')) * 1000)
                        elif 'M' in raw_f or 'm' in raw_f:
                            followers_count = int(float(raw_f.upper().replace('M', '')) * 1000000)
                        else:
                            followers_count = int(raw_f)
            except Exception as ex:
                print(f"Meta parse error for {username}: {ex}")

            # Hover over post links to extract likes/comments counts
            post_links = page.locator("a[href*='/p/'], a[href*='/reel/']").all()
            metrics = []

            for link in post_links[:9]:  # Check first 9 posts
                try:
                    aria = link.get_attribute("aria-label") or ""
                    inner = link.inner_text()
                    # Try hovering to trigger overlay
                    link.hover(timeout=1500)
                    page.wait_for_timeout(300)
                    aria_after = link.get_attribute("aria-label") or ""
                    
                    combined_text = f"{aria} {inner} {aria_after}"
                    metrics.append(combined_text)
                except Exception:
                    pass

            results[username] = {
                "followers_count": followers_count,
                "post_samples": metrics
            }
            print(f"Finished @{username}: {len(metrics)} posts sampled, followers={followers_count}")
        except Exception as e:
            print(f"Error for @{username}: {e}")

    browser.close()

with open("scratch/scraped_er_raw.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished parsing ER raw metrics!")
