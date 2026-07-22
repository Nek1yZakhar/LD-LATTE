# -*- coding: utf-8 -*-
import json
from playwright.sync_api import sync_playwright

cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

usernames = ["merklary_l", "curly.bloger", "krrazalia", "nev_pollyy"]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    context.add_cookies(cookies)

    for username in usernames:
        print(f"\n--- Fetching API for {username} ---")
        page = context.new_page()
        # Set Instagram App ID header
        page.set_extra_http_headers({"x-ig-app-id": "936619743392459"})
        url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
        res = page.goto(url, timeout=30000)
        print("HTTP STATUS:", res.status)
        try:
            data = res.json()
            user = data.get("data", {}).get("user", {})
            print("REAL USERNAME:", user.get("username"))
            print("REAL FULL NAME:", user.get("full_name"))
            print("REAL BIO:", user.get("biography"))
            print("REAL FOLLOWERS:", user.get("edge_followed_by", {}).get("count"))
            print("REAL POSTS COUNT:", user.get("edge_owner_to_timeline_media", {}).get("count"))
            posts = user.get("edge_owner_to_timeline_media", {}).get("edges", [])
            print("REAL POSTS FETCHED:", len(posts))
            if posts:
                caption = posts[0].get("node", {}).get("edge_media_to_caption", {}).get("edges", [])
                if caption:
                    print("FIRST POST CAPTION:", caption[0].get("node", {}).get("text")[:100])
        except Exception as e:
            print("ERROR:", e)
            print("RESPONSE TEXT SNIPPET:", res.text()[:300])
        page.close()

    browser.close()
