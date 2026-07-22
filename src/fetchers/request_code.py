# -*- coding: utf-8 -*-
import os
import json
import logging
from playwright.sync_api import sync_playwright
from src.shared.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def trigger_code_request():
    user = settings.instagram_username
    password = settings.instagram_password

    logger.info(f"Triggering Instagram login attempt for: {user}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            page.goto("https://www.instagram.com/accounts/login/", timeout=30000)
            page.wait_for_timeout(3000)

            if page.locator("input[name='username']").is_visible():
                page.fill("input[name='username']", user)
                page.fill("input[name='password']", password)
                page.click("button[type='submit']")
                logger.info("Submitted login credentials. Waiting on verification challenge screen...")
                page.wait_for_timeout(10000)

            # Check if 2FA code input screen is reached
            code_input = page.locator("input[name='verificationCode'], input[name='security_code'], input[type='text']")
            if code_input.is_visible():
                logger.info(">>> SUCCESS: Reached Verification Code Challenge screen! Security code has been dispatched by Instagram to email/SMS.")
            else:
                logger.info("Current page URL after login attempt: " + page.url)

            browser.close()
            return True
        except Exception as e:
            logger.error(f"Error during code trigger attempt: {e}")
            browser.close()
            return False

if __name__ == "__main__":
    trigger_code_request()
