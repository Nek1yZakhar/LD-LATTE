# -*- coding: utf-8 -*-
import json
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
        print(f"Applying proxy: {settings.scraper_proxy}")
        context_kwargs["proxy"] = {"server": settings.scraper_proxy}

    context = browser.new_context(**context_kwargs)
    if cookies:
        print(f"Applying {len(cookies)} cookies...")
        context.add_cookies(cookies)

    page = context.new_page()

    for username in usernames:
        try:
            print(f"Fetching live bio for: {username}...")
            page.goto(f"https://www.instagram.com/{username}/", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Extract main header text or meta text
            header_el = page.locator("header").first
            header_text = header_el.inner_text() if header_el.count() > 0 else ""

            meta_desc = ""
            try:
                meta_el = page.locator("meta[property='og:description']").first
                if meta_el.count() > 0:
                    meta_desc = meta_el.get_attribute("content") or ""
            except Exception:
                pass

            title_text = page.title()

            results[username] = {
                "header_text": header_text,
                "meta_desc": meta_desc,
                "title_text": title_text
            }
            print(f"Successfully fetched {username}")
        except Exception as e:
            print(f"Error fetching {username}: {e}")

    browser.close()

with open("scratch/scraped_headers_all.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished fetching all live bios!")
