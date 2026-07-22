# -*- coding: utf-8 -*-
import json
import os
import requests
from pathlib import Path
from src.shared.config import settings

out_dir = Path("app/public/avatars")
out_dir.mkdir(parents=True, exist_ok=True)

avatar_file = Path("scratch/scraped_avatars.json")
if avatar_file.exists():
    with open(avatar_file, "r", encoding="utf-8") as f:
        avatars = json.load(f)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    proxies = {}
    if settings.scraper_proxy:
        proxies = {
            "http": settings.scraper_proxy,
            "https": settings.scraper_proxy
        }

    for username, url in avatars.items():
        if not url:
            continue
        try:
            r = requests.get(url, headers=headers, proxies=proxies, timeout=15)
            if r.status_code == 200 and len(r.content) > 500:
                dest = out_dir / f"{username}.jpg"
                with open(dest, 'wb') as f:
                    f.write(r.content)
                print(f"Successfully saved avatar for @{username} ({len(r.content)} bytes)")
            else:
                print(f"Failed HTTP {r.status_code} for @{username}")
        except Exception as e:
            print(f"Failed to download avatar for @{username}: {e}")

print("Finished avatar proxy download pass!")
