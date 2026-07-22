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
        context_kwargs["proxy"] = {"server": settings.scraper_proxy}

    context = browser.new_context(**context_kwargs)
    if cookies:
        context.add_cookies(cookies)

    page = context.new_page()

    for username in usernames:
        try:
            print(f"Collecting post links for @{username}...")
            page.goto(f"https://www.instagram.com/{username}/", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(2500)

            # Get post hrefs
            hrefs = []
            links = page.locator("a[href*='/p/'], a[href*='/reel/']").all()
            for l in links:
                h = l.get_attribute("href")
                if h and h not in hrefs:
                    hrefs.append(h)

            print(f"@{username} has {len(hrefs)} posts found.")
            post_details = []

            for h in hrefs[:3]:  # Check top 3 posts
                full_url = f"https://www.instagram.com{h}" if h.startswith('/') else h
                try:
                    page.goto(full_url, timeout=15000, wait_until="domcontentloaded")
                    page.wait_for_timeout(1500)
                    
                    # Extract page text
                    body_text = page.locator("body").inner_text()
                    
                    # Look for likes
                    likes = 0
                    m_like = re.search(r'([\d\.,\sKk]+)\s+likes', body_text, re.IGNORECASE)
                    if not m_like:
                        m_like = re.search(r'liked by [^\n]+ and ([\d\.,\sKk]+) others', body_text, re.IGNORECASE)
                    if m_like:
                        raw_l = m_like.group(1).replace(' ', '').replace(',', '')
                        if 'K' in raw_l or 'k' in raw_l:
                            likes = int(float(raw_l.upper().replace('K', '')) * 1000)
                        else:
                            likes = int(raw_l)

                    post_details.append({"url": full_url, "likes": likes, "raw_snippet": body_text[:200]})
                except Exception as ex:
                    print(f"Error fetching post {full_url}: {ex}")

            results[username] = post_details
        except Exception as e:
            print(f"Error for @{username}: {e}")

    browser.close()

with open("scratch/scraped_post_likes.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished collecting post likes!")
