# -*- coding: utf-8 -*-
import json
import logging
from playwright.sync_api import sync_playwright

logging.basicConfig(level=logging.INFO)

cookies = json.load(open("data/instagram_session.json", encoding="utf-8"))

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--disable-blink-features=AutomationControlled", "--no-sandbox"]
    )
    context = browser.new_context(
        proxy={"server": "socks5://127.0.0.1:2080"},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800}
    )
    context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    context.add_cookies(cookies)

    page = context.new_page()
    url = "https://www.instagram.com/merklary_l/"
    print(f"Navigating to {url}...")
    page.goto(url, timeout=30000, wait_until="domcontentloaded")
    page.wait_for_timeout(5000)

    print("CURRENT URL:", page.url)
    print("PAGE TITLE:", page.title())
    
    # Check meta tags
    meta_desc = page.locator("meta[property='og:description']").count()
    if meta_desc > 0:
        print("OG DESC:", page.locator("meta[property='og:description']").first.get_attribute("content"))

    # Check for profile header text / bio in page HTML
    h1_text = page.locator("h1").all_text_contents()
    print("H1 TEXTS:", h1_text)

    # Check for json script tags (like window.__additionalData or sharedData)
    html = page.content()
    print("PAGE HTML LENGTH:", len(html))
    
    browser.close()
