# -*- coding: utf-8 -*-
"""
Instagram Session Bootstrap Utility.
Provides interactive Playwright session export for manual 2FA/reCAPTCHA completion
and helper functions to load/validate stored session cookies.
"""

import os
import json
import time
import logging
import argparse
from typing import List, Dict, Optional, Any

from src.shared.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def is_session_valid(cookies: List[dict]) -> bool:
    """Check if cookie array contains a valid, non-expired sessionid cookie."""
    if not isinstance(cookies, list):
        return False

    current_time = time.time()
    for cookie in cookies:
        if isinstance(cookie, dict) and cookie.get("name") == "sessionid":
            val = cookie.get("value")
            if not val:
                return False
            # If cookie has explicit expiration in the past, consider invalid
            expires = cookie.get("expires")
            if expires is not None and expires > 0 and expires < current_time:
                logger.warning("[SessionBootstrap] Stored 'sessionid' cookie has expired.")
                return False
            return True

    return False


def load_session_cookies(session_path: Optional[str] = None) -> Optional[List[dict]]:
    """
    Safely load and validate Instagram session cookies from disk.
    Returns list of cookie dicts if valid, or None if file is missing, corrupt, or expired.
    """
    target_path = session_path or settings.instagram_session_path

    if not os.path.exists(target_path):
        logger.warning(f"[SessionBootstrap] Session file not found at '{target_path}'.")
        return None

    try:
        with open(target_path, "r", encoding="utf-8") as f:
            cookies = json.load(f)

        if not isinstance(cookies, list):
            logger.warning(f"[SessionBootstrap] Invalid session file format in '{target_path}' (expected list).")
            return None

        if not is_session_valid(cookies):
            logger.warning(f"[SessionBootstrap] Session file '{target_path}' does not contain a valid active 'sessionid' cookie.")
            return None

        logger.info(f"[SessionBootstrap] Successfully loaded valid session cookies from '{target_path}'.")
        return cookies

    except Exception as e:
        logger.warning(f"[SessionBootstrap] Failed to read session file '{target_path}': {e}")
        return None


def run_session_bootstrap(
    session_path: Optional[str] = None,
    timeout_seconds: int = 300,
    headless: bool = False
) -> bool:
    """
    Launch Playwright browser window for manual Instagram authentication (login / reCAPTCHA / 2FA OTP),
    capture session cookies, and save them to disk.
    """
    target_path = session_path or settings.instagram_session_path
    user = settings.instagram_username
    password = settings.instagram_password

    logger.info("================================================================================")
    logger.info("Starting Instagram Interactive Session Bootstrap Flow...")
    logger.info(f"Target session export path: {target_path}")
    if user:
        logger.info(f"Pre-filling credentials for user: {user}")
    logger.info("================================================================================")

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("Playwright library is not installed. Install via 'pip install playwright'.")
        return False

    os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)

    with sync_playwright() as p:
        # Launch installed system Google Chrome (channel="chrome") for authentic browser TLS/JA3 fingerprints
        launch_kwargs = {
            "headless": headless,
            "args": [
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        }
        try:
            browser = p.chromium.launch(channel="chrome", **launch_kwargs)
            logger.info("Launched system Google Chrome (channel='chrome') for authentic anti-bot fingerprinting.")
        except Exception as e:
            logger.warning(f"Could not launch channel='chrome' ({e}). Falling back to standard Chromium.")
            browser = p.chromium.launch(**launch_kwargs)

        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
        )

        # Mask navigator.webdriver to bypass reCAPTCHA bot detection
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        page = context.new_page()

        try:
            page.goto("https://www.instagram.com/accounts/login/", timeout=45000)
            page.wait_for_timeout(3000)

            # Accept cookie banners if present
            for btn_text in ["Allow all cookies", "Decline optional cookies", "Only allow essential cookies", "Allow essential and optional cookies"]:
                try:
                    page.click(f"button:has-text('{btn_text}')", timeout=1500)
                    break
                except Exception:
                    pass

            # Prompt user to enter credentials and complete login manually without programmatic field filling
            # (programmatic fill triggers Instagram's "Please try again later" anti-bot detection)
            print("\n================================================================================")
            print(">>> MANUAL ACTION REQUIRED IN BROWSER WINDOW <<<")
            print("1. Enter your Instagram login & password manually in the opened Chrome window.")
            print("2. Solve any reCAPTCHA or enter 2FA / OTP verification code if requested.")
            print(f"3. Waiting up to {timeout_seconds} seconds to detect logged-in sessionid cookie...")
            print("================================================================================\n")

            start_time = time.time()
            authenticated = False

            while (time.time() - start_time) < timeout_seconds:
                time.sleep(2)

                cookies = context.cookies()
                if is_session_valid(cookies):
                    logger.info("Detected valid 'sessionid' cookie in browser context!")
                    authenticated = True
                    break

                current_url = page.url.lower()
                if "instagram.com" in current_url and not any(k in current_url for k in ["login", "recaptcha", "auth_platform", "challenge"]):
                    # User navigated to feed/home or profile
                    if is_session_valid(cookies):
                        authenticated = True
                        break

            if authenticated:
                cookies = context.cookies()
                with open(target_path, "w", encoding="utf-8") as f:
                    json.dump(cookies, f, indent=2, ensure_ascii=False)
                logger.info(f"SUCCESS: Session cookies successfully saved to '{target_path}'.")
                browser.close()
                return True
            else:
                logger.error(f"FAILURE: Session bootstrap timed out or failed to acquire valid 'sessionid' cookie within {timeout_seconds}s.")
                browser.close()
                return False

        except Exception as e:
            logger.error(f"Error during Instagram session bootstrap: {e}")
            browser.close()
            return False


def create_session_file_from_id(session_id: str, session_path: Optional[str] = None) -> bool:
    """Create data/instagram_session.json directly from a user-provided sessionid cookie string."""
    target_path = session_path or settings.instagram_session_path
    clean_val = session_id.strip().strip('"').strip("'")
    if not clean_val:
        logger.error("[SessionBootstrap] Provided sessionid string is empty.")
        return False

    cookies = [
        {
            "name": "sessionid",
            "value": clean_val,
            "domain": ".instagram.com",
            "path": "/",
            "expires": time.time() + 86400 * 30,
            "httpOnly": True,
            "secure": True,
            "sameSite": "Lax"
        }
    ]

    # Automatically extract ds_user_id if embedded in sessionid string
    if "%3A" in clean_val or "%3a" in clean_val or ":" in clean_val:
        user_id_part = clean_val.replace("%3A", ":").replace("%3a", ":").split(":")[0]
        if user_id_part.isdigit():
            cookies.append({
                "name": "ds_user_id",
                "value": user_id_part,
                "domain": ".instagram.com",
                "path": "/",
                "expires": time.time() + 86400 * 30,
                "httpOnly": False,
                "secure": True,
                "sameSite": "Lax"
            })
            logger.info(f"[SessionBootstrap] Automatically extracted ds_user_id '{user_id_part}' from sessionid.")

    os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(cookies, f, indent=2, ensure_ascii=False)

    logger.info(f"SUCCESS: Session cookies successfully exported to '{target_path}'.")
    return True


def main():
    parser = argparse.ArgumentParser(description="Instagram Session Bootstrap Utility")
    parser.add_argument("--session-id", type=str, default=None, help="Direct sessionid cookie string from personal browser")
    parser.add_argument("--session-path", type=str, default=None, help="Path to save output session JSON (default: settings.instagram_session_path)")
    parser.add_argument("--timeout", type=int, default=300, help="Maximum seconds to wait for manual login (default: 300)")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode (not recommended for manual 2FA/reCAPTCHA)")
    args = parser.parse_args()

    session_id_input = args.session_id or settings.instagram_session_id
    if session_id_input:
        logger.info("Found direct sessionid string. Exporting session file without Playwright launch...")
        success = create_session_file_from_id(session_id_input, args.session_path)
    else:
        success = run_session_bootstrap(
            session_path=args.session_path,
            timeout_seconds=args.timeout,
            headless=args.headless
        )

    if success:
        print("\n[SUCCESS] Instagram session bootstrap completed successfully.")
    else:
        print("\n[FAILURE] Instagram session bootstrap did not capture a valid session.")
        exit(1)


if __name__ == "__main__":
    main()
