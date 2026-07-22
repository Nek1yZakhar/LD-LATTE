# -*- coding: utf-8 -*-
import os
import json
import pytest
from src.fetchers.browser_probe import run_browser_probe


def test_browser_probe_interface(tmp_path):
    temp_session_path = tmp_path / "test_probe_session.json"

    # Run browser probe in headless probe-only mode
    report = run_browser_probe(
        username=None,
        export_session=False,
        timeout_seconds=30,
        use_system_chrome=True,
        headless=True,
        session_path=str(temp_session_path)
    )

    assert isinstance(report, dict)
    assert "probe_target" in report
    assert "channel_used" in report
    assert "captcha_detected" in report
    assert "session_acquired" in report
    assert "success" in report
    assert "message" in report
