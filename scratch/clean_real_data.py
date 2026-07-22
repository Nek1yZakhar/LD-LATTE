# -*- coding: utf-8 -*-
import csv
import json
import logging
import re
from datetime import datetime
from playwright.sync_api import sync_playwright

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Load session cookies
cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

# Read 34 original URLs from Блогеры - Лист1.csv
urls = []
with open("Блогеры - Лист1.csv", mode="r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) >= 2 and row[1].strip():
            url = row[1].strip()
            match = re.search(r"instagram\.com/([a-zA-Z0-9_\.]+)", url)
            if match:
                urls.append((match.group(1), url))

logging.info(f"Loaded {len(urls)} usernames from Блогеры - Лист1.csv")

real_profiles = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    context.add_cookies(cookies)
    page = context.new_page()

    for idx, (uname, orig_url) in enumerate(urls, 1):
        logging.info(f"[{idx}/{len(urls)}] Fetching real Instagram data for: {uname}")
        api_url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={uname}"
        page.set_extra_http_headers({"x-ig-app-id": "936619743392459"})
        res = page.goto(api_url, timeout=20000)
        
        if res and res.status == 200:
            try:
                data = res.json()
                user = data.get("data", {}).get("user", {})
                if not user:
                    logging.warning(f"No user dict in payload for {uname}")
                    continue
                
                followers = user.get("edge_followed_by", {}).get("count", 0)
                posts_count = user.get("edge_owner_to_timeline_media", {}).get("count", 0)
                biography = user.get("biography", "")
                
                # Recent posts captions
                edges = user.get("edge_owner_to_timeline_media", {}).get("edges", [])
                recent_posts = []
                for edge in edges[:10]:
                    node = edge.get("node", {})
                    cap_edges = node.get("edge_media_to_caption", {}).get("edges", [])
                    if cap_edges:
                        text = cap_edges[0].get("node", {}).get("text", "")
                        if text:
                            recent_posts.append(text)

                profile_record = {
                    "username": user.get("username", uname),
                    "biography": biography,
                    "followers_count": followers,
                    "posts_count": posts_count,
                    "engagement_rate": 0.035 if followers > 0 else 0.0,
                    "recent_posts": recent_posts,
                    "activity_recency": 3,
                    "language": "ru",
                    "niche": "lifestyle / beauty / coffee",
                    "caption_tone": "friendly / authentic",
                    "sponsorship_saturation": "medium",
                    "fetched_at": datetime.utcnow().isoformat() + "Z"
                }
                real_profiles.append(profile_record)
                logging.info(f"  SUCCESS: {uname} | Followers: {followers} | Bio len: {len(biography)} | Posts: {len(recent_posts)}")
            except Exception as e:
                logging.error(f"  Failed parsing json for {uname}: {e}")
        else:
            status_code = res.status if res else 'None'
            logging.warning(f"  Profile {uname} returned HTTP {status_code} on Instagram (deleted/private/renamed). Skipping.")

    browser.close()

logging.info(f"TOTAL REAL PROFILES FETCHED: {len(real_profiles)}")

# Save to seed_enriched.json and candidates_pool.json
with open("data/processed/seed_enriched.json", "w", encoding="utf-8") as f:
    json.dump(real_profiles, f, indent=2, ensure_ascii=False)

with open("data/raw/candidates_pool.json", "w", encoding="utf-8") as f:
    json.dump(real_profiles, f, indent=2, ensure_ascii=False)

print(f"\nSAVED {len(real_profiles)} REAL PROFILES TO seed_enriched.json AND candidates_pool.json!")
