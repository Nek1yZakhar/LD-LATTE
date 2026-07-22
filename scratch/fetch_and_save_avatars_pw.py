# -*- coding: utf-8 -*-
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from src.fetchers.session_bootstrap import load_session_cookies
from src.shared.config import settings

out_dir = Path("app/public/avatars")
out_dir.mkdir(parents=True, exist_ok=True)

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
            print(f"Downloading profile picture for @{username} via Playwright...")
            page.goto(f"https://www.instagram.com/{username}/", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)

            avatar_url = ""
            # Find header image
            img_el = page.locator("header img").first
            if img_el.count() > 0:
                src = img_el.get_attribute("src") or ""
                if src.startswith("http"):
                    avatar_url = src

            if avatar_url:
                resp = page.request.get(avatar_url)
                if resp.status == 200:
                    buf = resp.body()
                    dest = out_dir / f"{username}.jpg"
                    with open(dest, "wb") as f:
                        f.write(buf)
                    print(f"Successfully saved @{username} avatar ({len(buf)} bytes)")
            else:
                print(f"No avatar URL found for @{username}")
        except Exception as e:
            print(f"Error downloading avatar for @{username}: {e}")

    browser.close()

print("Finished Playwright avatar downloading!")
