# -*- coding: utf-8 -*-
import json
import re
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
    'zari.ishikhovaa',
    'shalafaeva.al'
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
            print(f"Parsing profile picture for @{username}...")
            page.goto(f"https://www.instagram.com/{username}/", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)

            avatar_url = ""
            
            # Method 1: Header img
            try:
                img_el = page.locator("header img[alt*='profile picture'], header img[alt*='аватар'], header img").first
                if img_el.count() > 0:
                    src = img_el.get_attribute("src") or ""
                    if src.startswith("http"):
                        avatar_url = src
            except Exception:
                pass

            # Method 2: meta og:image
            if not avatar_url:
                try:
                    meta_el = page.locator("meta[property='og:image']").first
                    if meta_el.count() > 0:
                        src = meta_el.get_attribute("content") or ""
                        if src.startswith("http"):
                            avatar_url = src
                except Exception:
                    pass

            results[username] = avatar_url
            print(f"@{username} avatar: {avatar_url[:60] if avatar_url else 'Not found'}")
        except Exception as e:
            print(f"Error for @{username}: {e}")

    browser.close()

with open("scratch/scraped_avatars.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished fetching avatars!")
