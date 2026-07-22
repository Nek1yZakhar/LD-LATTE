# -*- coding: utf-8 -*-
import os
import sys
import json
import time

sys.path.insert(0, ".")

from playwright.sync_api import sync_playwright
from src.shared.config import settings

def launch_gui():
    session_path = settings.instagram_session_path
    user = settings.instagram_username
    password = settings.instagram_password

    print(f"\n==================================================")
    print(f"Launching visible browser window on your screen...")
    print(f"Logging in as: {user}")
    print(f"==================================================\n")

    os.makedirs(os.path.dirname(os.path.abspath(session_path)), exist_ok=True)

    with sync_playwright() as p:
        # Launch visible browser window on desktop
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        page = context.new_page()

        page.goto("https://www.instagram.com/accounts/login/", timeout=60000)
        page.wait_for_timeout(3000)

        # Accept cookie banner if present
        for btn_text in ["Allow all cookies", "Decline optional cookies", "Only allow essential cookies", "Allow essential and optional cookies"]:
            try:
                page.click(f"button:has-text('{btn_text}')", timeout=2000)
                break
            except Exception:
                pass

        user_input = page.locator("input[name='email'], input[name='username']").first
        pass_input = page.locator("input[name='pass'], input[name='password']").first

        if user_input.is_visible():
            user_input.fill(user)
            pass_input.fill(password)
            pass_input.press("Enter")

        print("\n>>> Please complete any reCAPTCHA / security challenge in the opened browser window! <<<")
        print("Waiting 60 seconds for login completion...\n")

        for idx in range(60):
            time.sleep(1)
            # Check if logged in (url contains instagram.com without /accounts/login/ or /recaptcha/)
            if "instagram.com" in page.url and "login" not in page.url and "recaptcha" not in page.url and "auth_platform" not in page.url:
                print(f"\nSUCCESSFULLY LOGGED IN! Current URL: {page.url}")
                break

        cookies = context.cookies()
        with open(session_path, "w", encoding="utf-8") as f:
            json.dump(cookies, f, indent=2)

        print(f"\nSaved session cookies to: {session_path}")
        browser.close()

if __name__ == "__main__":
    launch_gui()
