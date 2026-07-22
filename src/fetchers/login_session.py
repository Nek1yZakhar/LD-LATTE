# -*- coding: utf-8 -*-
"""
Instagram Session Authentication Helper.
Logs into Instagram using Playwright, prompts for 2FA/email code if required,
and saves the session cookies to data/instagram_session.json.
"""

import os
import json
import logging
from playwright.sync_api import sync_playwright
from src.shared.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def create_instagram_session(verification_code: str = None):
    session_path = settings.instagram_session_path
    user = settings.instagram_username
    password = settings.instagram_password

    if not user or not password:
        logger.error("INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD must be configured in .env")
        return False

    logger.info(f"Initiating Instagram session authentication for: {user}")

    os.makedirs(os.path.dirname(os.path.abspath(session_path)), exist_ok=True)

    with sync_playwright() as p:
        # Launch browser headless
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()


        try:
            page.goto("https://www.instagram.com/accounts/login/", timeout=30000)
            page.wait_for_timeout(3000)

            # Accept cookies if prompted
            try:
                page.click("button:has-text('Allow all cookies')", timeout=3000)
            except Exception:
                pass

            # Fill credentials (support name='email' or name='username', name='pass' or name='password')
            user_input = page.locator("input[name='email'], input[name='username']").first
            pass_input = page.locator("input[name='pass'], input[name='password']").first

            if user_input.is_visible():
                logger.info(f"Filling login credentials for user: {user}")
                user_input.fill(user)
                pass_input.fill(password)
                pass_input.press("Enter")
                page.wait_for_timeout(7000)
                logger.info(f"Submitted login form. Current URL: {page.url}")



            # Check if security code / 2FA is requested
            if verification_code:
                code_input = page.locator("input[name='verificationCode'], input[name='security_code'], input[type='text']")
                if code_input.is_visible():
                    logger.info(f"Submitting verification code: {verification_code}")
                    code_input.fill(verification_code)
                    page.click("button[type='submit'], button:has-text('Confirm'), button:has-text('Submit')")
                    page.wait_for_timeout(5000)

            # Save cookies
            cookies = context.cookies()
            with open(session_path, "w", encoding="utf-8") as f:
                json.dump(cookies, f, indent=2)

            logger.info(f"Successfully saved Instagram session cookies to: {session_path}")
            browser.close()
            return True

        except Exception as e:
            logger.error(f"Error during Instagram session authentication: {e}")
            browser.close()
            return False

if __name__ == "__main__":
    import sys
    code = sys.argv[1] if len(sys.argv) > 1 else None
    create_instagram_session(verification_code=code)
