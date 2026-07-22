# -*- coding: utf-8 -*-
import os
import json
import time
import pytest
from pathlib import Path

from src.fetchers.session_bootstrap import is_session_valid, load_session_cookies, create_session_file_from_id
from src.fetchers.enrich import run_enrichment, fetch_playwright
from src.shared.models import EnrichedSeedProfile


def test_create_session_file_from_id(tmp_path):
    target_file = tmp_path / "custom_session.json"
    res = create_session_file_from_id("my_secret_session_token_999", str(target_file))
    assert res is True
    assert target_file.exists()

    loaded = load_session_cookies(str(target_file))
    assert loaded is not None
    assert len(loaded) == 1
    assert loaded[0]["value"] == "my_secret_session_token_999"


def test_is_session_valid():
    assert is_session_valid(None) is False
    assert is_session_valid([]) is False
    assert is_session_valid("not a list") is False

    # Cookie without sessionid
    cookies_no_sessionid = [{"name": "csrftoken", "value": "12345"}]
    assert is_session_valid(cookies_no_sessionid) is False

    # Cookie with empty sessionid
    cookies_empty_sessionid = [{"name": "sessionid", "value": ""}]
    assert is_session_valid(cookies_empty_sessionid) is False

    # Valid sessionid
    cookies_valid = [{"name": "sessionid", "value": "abc_session_token_123"}]
    assert is_session_valid(cookies_valid) is True

    # Expired sessionid
    past_time = time.time() - 3600
    cookies_expired = [{"name": "sessionid", "value": "abc_session_token_123", "expires": past_time}]
    assert is_session_valid(cookies_expired) is False


def test_load_session_cookies(tmp_path):
    # Non-existent file
    non_existent = tmp_path / "missing_session.json"
    assert load_session_cookies(str(non_existent)) is None

    # Invalid JSON file
    corrupt_file = tmp_path / "corrupt_session.json"
    corrupt_file.write_text("invalid json content {{{", encoding="utf-8")
    assert load_session_cookies(str(corrupt_file)) is None

    # Valid JSON file without sessionid
    no_session_file = tmp_path / "no_session.json"
    no_session_file.write_text(json.dumps([{"name": "foo", "value": "bar"}]), encoding="utf-8")
    assert load_session_cookies(str(no_session_file)) is None

    # Valid session file
    valid_file = tmp_path / "valid_session.json"
    valid_cookies = [{"name": "sessionid", "value": "valid_token_xyz"}]
    valid_file.write_text(json.dumps(valid_cookies), encoding="utf-8")
    loaded = load_session_cookies(str(valid_file))
    assert loaded is not None
    assert len(loaded) == 1
    assert loaded[0]["value"] == "valid_token_xyz"


def test_enrichment_mock_regression(tmp_path):
    test_seed_path = tmp_path / "test_seed.json"
    test_output_path = tmp_path / "test_enriched.json"

    seed_data = [
        {"id": 1, "raw_url": "https://instagram.com/test_user", "username": "test_user", "is_valid": True, "error_message": None}
    ]
    test_seed_path.write_text(json.dumps(seed_data, ensure_ascii=False, indent=2), encoding="utf-8")

    results = run_enrichment(
        seed_path=str(test_seed_path),
        output_path=str(test_output_path),
        use_mock=True,
        force_refresh=True
    )

    assert len(results) == 1
    assert isinstance(results[0], EnrichedSeedProfile)
    assert results[0].username == "test_user"
