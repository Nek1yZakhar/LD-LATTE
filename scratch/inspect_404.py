# -*- coding: utf-8 -*-
import csv
import json
import re
from playwright.sync_api import sync_playwright

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

print(f"Total entries parsed from CSV: {len(parsed_items)}")

failed_items = []

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
        res = page.goto(api_url, timeout=10000)
        
        if not (res and res.status == 200):
            status = res.status if res else 'None'
            failed_items.append((row_id, uname, raw_text, status))

    browser.close()

print(f"\n==========================================")
print(f"FAILED / 404 PROFILES MANUAL CHECK LIST ({len(failed_items)} PROFILES):")
print(f"==========================================")
for row_id, uname, raw_text, status in failed_items:
    print(f"ID {row_id:<3} | Username: {uname:<20} | Status: {status} | Raw URL: {raw_text}")
