# -*- coding: utf-8 -*-
import csv
import json
import re
from playwright.sync_api import sync_playwright

# Load session cookies
cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

# Read 34 original URLs from Блогеры - Лист1.csv
urls = []
with open("Блогеры - Лист1.csv", mode="r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) >= 2 and row[1].strip():
            url = row[1].strip()
            # extract username
            match = re.search(r"instagram\.com/([a-zA-Z0-9_\.]+)", url)
            if match:
                urls.append((match.group(1), url))

print(f"Loaded {len(urls)} usernames from Блогеры - Лист1.csv")

success = []
failed = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    context.add_cookies(cookies)
    page = context.new_page()

    for idx, (uname, orig_url) in enumerate(urls, 1):
        print(f"\n[{idx}/{len(urls)}] Testing {uname}...")
        api_url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={uname}"
        page.set_extra_http_headers({"x-ig-app-id": "936619743392459"})
        res = page.goto(api_url, timeout=15000)
        if res and res.status == 200:
            try:
                data = res.json()
                user = data.get("data", {}).get("user", {})
                followers = user.get("edge_followed_by", {}).get("count")
                bio = user.get("biography", "")
                print(f"  SUCCESS: {uname} | Followers: {followers}")
                success.append((uname, followers, bio))
            except Exception as e:
                print(f"  JSON error for {uname}: {e}")
                failed.append(uname)
        else:
            print(f"  Status {res.status if res else 'None'} for {uname}")
            failed.append(uname)

    browser.close()

print(f"\nSUMMARY: {len(success)} SUCCESSFUL, {len(failed)} FAILED")
