# -*- coding: utf-8 -*-
import json
import re
from playwright.sync_api import sync_playwright

cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    context.add_cookies(cookies)
    page = context.new_page()
    page.goto("https://www.instagram.com/merklary_l/", timeout=30000, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)

    html = page.content()
    
    # Search for json user data in script tags
    matches = re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', html, re.DOTALL)
    print(f"Found {len(matches)} script tags.")

    parsed_user = None
    for i, m in enumerate(matches):
        if "merklary_l" in m:
            pos = m.find("merklary_l")
            print(f"SCRIPT #{i} LENGTH: {len(m)}, POS: {pos}")
            print("CONTEXT:\n", m[max(0, pos-200):pos+600])
            break

    if parsed_user:
        print("SUCCESSFULLY PARSED USER DATA:")
        print("USERNAME:", parsed_user.get("username"))
        print("BIO:", parsed_user.get("biography"))
        print("FOLLOWERS:", parsed_user.get("edge_followed_by", {}).get("count"))
        print("POSTS:", parsed_user.get("edge_owner_to_timeline_media", {}).get("count"))
    else:
        print("Could not parse user dict from script tags. Checking regex fallback...")
        bio_m = re.search(r'"biography":"(.*?)"', html)
        followers_m = re.search(r'"edge_followed_by":\{"count":(\d+)\}', html)
        print("REGEX BIO:", bio_m.group(1) if bio_m else None)
        print("REGEX FOLLOWERS:", followers_m.group(1) if followers_m else None)

    browser.close()
