# -*- coding: utf-8 -*-
"""
Experimental Browser Fallback Probe Utility (TICKET-04B Research Track).
Isolated sandbox module for testing open-source anti-detection browser runtimes,
stealth CDP flags, and system Chrome integration for Instagram session acquisition.
Does NOT modify or replace the main production enrichment pipeline (src/fetchers/enrich.py).
"""

import os
import json
import time
import logging
import argparse
from typing import Dict, Any, Optional, List

from src.shared.config import settings
from src.fetchers.session_bootstrap import is_session_valid

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_browser_probe(
    username: Optional[str] = None,
    export_session: bool = False,
    timeout_seconds: int = 120,
    use_system_chrome: bool = True,
    headless: bool = False,
    session_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Execute controlled experimental browser probe to test anti-detection resilience,
    page access, and session acquisition capabilities.
    """
    target_path = session_path or settings.instagram_session_path
    report: Dict[str, Any] = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "probe_target": username or "login_page",
        "channel_used": "unknown",
        "final_url": "",
        "captcha_detected": False,
        "session_acquired": False,
        "profile_data_captured": False,
        "success": False,
        "message": ""
    }

    logger.info("================================================================================")
    logger.info("Starting TICKET-04B Experimental Hardened Browser Probe...")
    logger.info(f"Target: {report['probe_target']} | System Chrome: {use_system_chrome} | Headless: {headless}")
    logger.info("================================================================================")

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        report["message"] = "Playwright library is not installed."
        logger.error(report["message"])
        return report

    with sync_playwright() as p:
        launch_kwargs = {
            "headless": headless,
            "args": [
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-infobars",
                "--window-size=1280,800"
            ]
        }

        channel_to_use = "chrome" if use_system_chrome else None
        try:
            if channel_to_use:
                browser = p.chromium.launch(channel=channel_to_use, **launch_kwargs)
                report["channel_used"] = "system_chrome"
                logger.info("[Probe] Launched system Google Chrome (channel='chrome').")
            else:
                browser = p.chromium.launch(**launch_kwargs)
                report["channel_used"] = "standard_chromium"
                logger.info("[Probe] Launched standard Chromium build.")
        except Exception as e:
            logger.warning(f"[Probe] Fallback launching standard Chromium due to launch error: {e}")
            browser = p.chromium.launch(**launch_kwargs)
            report["channel_used"] = "fallback_chromium"

        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            timezone_id="Europe/Moscow"
        )

        # Inject stealth scripts to mask navigator.webdriver and automation signatures
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            window.chrome = { runtime: {} };
            Object.defineProperty(navigator, 'languages', {get: () => ['ru-RU', 'ru', 'en-US', 'en']});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
        """)

        # Load existing session if present
        if os.path.exists(target_path):
            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    cookies = json.load(f)
                    if isinstance(cookies, list):
                        context.add_cookies(cookies)
                        logger.info(f"[Probe] Attached {len(cookies)} existing cookies from '{target_path}'.")
            except Exception as e:
                logger.warning(f"[Probe] Could not read existing session file: {e}")

        captured_info: Dict[str, Any] = {}
        def handle_response(response):
            if "web_profile_info" in response.url:
                try:
                    captured_info["data"] = response.json()
                except Exception:
                    pass

        context.on("response", handle_response)
        page = context.new_page()

        try:
            target_url = f"https://www.instagram.com/{username}/" if username else "https://www.instagram.com/accounts/login/"
            logger.info(f"[Probe] Navigating to target URL: {target_url}")
            page.goto(target_url, timeout=45000)
            page.wait_for_timeout(3000)

            report["final_url"] = page.url
            current_url_lower = page.url.lower()

            if any(k in current_url_lower for k in ["recaptcha", "auth_platform", "challenge"]):
                report["captcha_detected"] = True
                logger.warning(f"[Probe] Anti-bot challenge or reCAPTCHA detected at: {page.url}")

            cookies = context.cookies()
            if is_session_valid(cookies):
                report["session_acquired"] = True
                logger.info("[Probe] Active valid 'sessionid' cookie detected in browser context.")

            if captured_info.get("data"):
                report["profile_data_captured"] = True
                logger.info("[Probe] Profile GraphQL/JSON payload successfully intercepted.")

            if export_session and report["session_acquired"]:
                os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)
                with open(target_path, "w", encoding="utf-8") as f:
                    json.dump(cookies, f, indent=2, ensure_ascii=False)
                logger.info(f"[Probe] Exported experimental session cookies to '{target_path}'.")

            if not report["captcha_detected"] and (report["session_acquired"] or report["profile_data_captured"] or "instagram.com" in current_url_lower):
                report["success"] = True
                report["message"] = "Experimental probe executed successfully without reCAPTCHA block."
            else:
                report["message"] = "Probe reached target page but reCAPTCHA challenge or login wall was present."

        except Exception as e:
            report["message"] = f"Error during browser probe execution: {e}"
            logger.error(report["message"])

        browser.close()

    logger.info(f"[Probe Result] Success: {report['success']} | Captcha: {report['captcha_detected']} | Session: {report['session_acquired']}")
    return report


def main():
    parser = argparse.ArgumentParser(description="TICKET-04B Experimental Hardened Browser Probe")
    parser.add_argument("--username", type=str, default=None, help="Target Instagram username to test fetching")
    parser.add_argument("--probe-only", action="store_true", help="Diagnostic mode: check login/recaptcha redirect without saving session")
    parser.add_argument("--export-session", action="store_true", help="Export captured cookies to data/instagram_session.json if valid sessionid exists")
    parser.add_argument("--no-system-chrome", action="store_true", help="Disable channel='chrome' and force Playwright bundled Chromium")
    parser.add_argument("--headless", action="store_true", help="Run browser probe in headless mode")
    parser.add_argument("--timeout", type=int, default=120, help="Maximum seconds for probe execution")
    args = parser.parse_args()

    report = run_browser_probe(
        username=args.username,
        export_session=args.export_session,
        timeout_seconds=args.timeout,
        use_system_chrome=not args.no_system_chrome,
        headless=args.headless
    )

    print("\n--- EXPERIMENTAL PROBE DIAGNOSTIC REPORT ---")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
