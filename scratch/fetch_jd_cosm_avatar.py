# -*- coding: utf-8 -*-
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from src.fetchers.session_bootstrap import load_session_cookies
from src.shared.config import settings

out_file = Path("app/public/avatars/jd_cosm.jpg")
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

    try:
        print("Fetching @jd_cosm profile page...")
        page.goto("https://www.instagram.com/jd_cosm/", timeout=25000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        # Find img tags in header or main
        imgs = page.locator("img").all()
        avatar_url = ""
        for img in imgs:
            src = img.get_attribute("src") or ""
            alt = img.get_attribute("alt") or ""
            if "profile picture" in alt.lower() or "аватар" in alt.lower() or "jd_cosm" in alt.lower() or "scontent" in src:
                if src.startswith("http"):
                    avatar_url = src
                    break

        if not avatar_url:
            meta = page.locator("meta[property='og:image']").first
            if meta.count() > 0:
                avatar_url = meta.get_attribute("content") or ""

        print(f"@jd_cosm avatar URL: {avatar_url}")
        if avatar_url:
            resp = page.request.get(avatar_url)
            if resp.status == 200:
                out_file.write_bytes(resp.body())
                print(f"Successfully saved @jd_cosm avatar to {out_file} ({len(resp.body())} bytes)")
    except Exception as e:
        print(f"Error fetching @jd_cosm avatar: {e}")

    browser.close()
