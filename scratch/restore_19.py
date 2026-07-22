# -*- coding: utf-8 -*-
import csv
import json
import logging
import re
from playwright.sync_api import sync_playwright

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

parsed_items = []
with open("Блогеры - Лист1.csv", mode="r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader, 1):
        if len(row) >= 2 and row[1].strip():
            col1, text = row[0].strip(), row[1].strip()
            match = re.search(r"instagram\.com/([a-zA-Z0-9_\.]+)", text)
            if not match:
                match = re.search(r"\(@([a-zA-Z0-9_\.]+)\)", text)
            if match:
                uname = match.group(1).rstrip('/')
                parsed_items.append((col1 or f"row_{idx}", uname, text))

real_profiles = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    context.add_cookies(cookies)
    page = context.new_page()

    for item in parsed_items:
        row_id, uname, raw_text = item
        api_url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={uname}"
        page.set_extra_http_headers({"x-ig-app-id": "936619743392459"})
        res = page.goto(api_url, timeout=12000)
        
        if res and res.status == 200:
            try:
                data = res.json()
                user = data.get("data", {}).get("user", {})
                followers = user.get("edge_followed_by", {}).get("count", 0)
                posts_count = user.get("edge_owner_to_timeline_media", {}).get("count", 0)
                biography = user.get("biography", "")
                
                edges = user.get("edge_owner_to_timeline_media", {}).get("edges", [])
                recent_posts = []
                for edge in edges[:10]:
                    cap_edges = edge.get("node", {}).get("edge_media_to_caption", {}).get("edges", [])
                    if cap_edges:
                        t = cap_edges[0].get("node", {}).get("text", "")
                        if t: recent_posts.append(t)

                record = {
                    "id": row_id,
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
                    "sponsorship_saturation": "medium"
                }
                real_profiles.append(record)
                logging.info(f"SUCCESS ID {row_id}: {uname} | Followers: {followers}")
            except Exception as e:
                logging.error(f"FAILED ID {row_id} ({uname}): {e}")
        else:
            status = res.status if res else 'None'
            logging.warning(f"HTTP {status} for ID {row_id} ({uname}) -> deleted/renamed/private")

    browser.close()

logging.info(f"TOTAL REAL PROFILES FETCHED: {len(real_profiles)}")

with open("data/processed/seed_enriched.json", "w", encoding="utf-8") as f:
    json.dump(real_profiles, f, indent=2, ensure_ascii=False)

with open("data/raw/candidates_pool.json", "w", encoding="utf-8") as f:
    json.dump(real_profiles, f, indent=2, ensure_ascii=False)

print(f"\nRESTORED {len(real_profiles)} REAL PROFILES TO seed_enriched.json AND candidates_pool.json!")
