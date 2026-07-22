# -*- coding: utf-8 -*-
"""
Tests for Candidate Discovery module (TICKET-06).
Includes unit tests for normalization and filtering, and integration tests
with synthetic file fixtures.
"""

import os
import json
import pytest
from pathlib import Path

from src.shared.models import IdealBloggerProfile, CandidateProfile, PostInfo
from src.search.discover import (
    normalize_candidate,
    filter_candidate,
    run_discovery,
    SATURATION_RANK
)

@pytest.fixture
def sample_ideal_portrait() -> IdealBloggerProfile:
    return IdealBloggerProfile(
        target_niches=["fashion", "lifestyle"],
        estimated_er_min=3.5,
        key_themes=["capsule wardrobe", "slow fashion"],
        preferred_tone_of_voice="friendly",
        sponsorship_saturation_max="low",
        activity_recency_max_days=14,
        rationale="Synthetic ideal portrait for testing"
    )

def test_normalize_candidate_standard():
    raw = {
        "username": "fashion_icon",
        "biography": "Daily outfits & chic style",
        "followers_count": 25000,
        "engagement_rate": 4.1,
        "recent_posts": [
            {"caption": "Summer dress #ootd", "date": "2026-07-20", "likes": 1000, "comments": 25}
        ],
        "language": "ru",
        "niche": "fashion",
        "caption_tone": "friendly",
        "product_talk_style": "outfit_breakdown",
        "sponsorship_saturation": "low",
        "activity_recency": 3,
        "contact_info": "email@example.com"
    }

    candidate = normalize_candidate(raw)
    assert candidate is not None
    assert candidate.username == "fashion_icon"
    assert candidate.followers_count == 25000
    assert candidate.engagement_rate == 4.1
    assert candidate.language == "ru"
    assert candidate.niche == "fashion"
    assert len(candidate.recent_posts) == 1
    assert candidate.recent_posts[0].likes == 1000

def test_normalize_candidate_alternate_keys():
    raw = {
        "handle": "@minimal_girl",
        "bio": "Minimal style enthusiast",
        "followers": "15000",
        "er": "3.8",
        "recency_days": "2",
        "email": "contact@minimal.com"
    }

    candidate = normalize_candidate(raw)
    assert candidate is not None
    assert candidate.username == "minimal_girl"
    assert candidate.followers_count == 15000
    assert candidate.engagement_rate == 3.8
    assert candidate.activity_recency == 2
    assert candidate.contact_info == "contact@minimal.com"

def test_normalize_candidate_malformed():
    # Non-dict input
    assert normalize_candidate("not_a_dict") is None

    # Missing username
    assert normalize_candidate({"bio": "No username"}) is None

    # Empty username
    assert normalize_candidate({"username": "   "}) is None

def test_filter_candidate_rules(sample_ideal_portrait):
    ideal = sample_ideal_portrait

    valid_cand = CandidateProfile(
        username="valid_user",
        biography="Fashion blog",
        followers_count=10000,
        engagement_rate=4.0,
        language="ru",
        niche="fashion",
        sponsorship_saturation="low",
        activity_recency=5
    )
    assert filter_candidate(valid_cand, ideal, min_followers=3000, max_followers=500000) is True

    # 1. Followers out of bounds
    too_few = valid_cand.model_copy(update={"followers_count": 1000})
    assert filter_candidate(too_few, ideal, min_followers=3000, max_followers=500000) is False

    too_many = valid_cand.model_copy(update={"followers_count": 1000000})
    assert filter_candidate(too_many, ideal, min_followers=3000, max_followers=500000) is False

    # 2. ER below threshold
    low_er = valid_cand.model_copy(update={"engagement_rate": 2.0})
    assert filter_candidate(low_er, ideal) is False

    # 3. Irrelevant niche
    wrong_niche = valid_cand.model_copy(update={"niche": "gaming"})
    assert filter_candidate(wrong_niche, ideal) is False

    # 4. Irrelevant language
    wrong_lang = valid_cand.model_copy(update={"language": "es"})
    assert filter_candidate(wrong_lang, ideal, allowed_languages=["ru", "en"]) is False

    # 5. Activity recency too high
    inactive = valid_cand.model_copy(update={"activity_recency": 30})
    assert filter_candidate(inactive, ideal) is False

    # 6. Sponsorship saturation too high
    spammed = valid_cand.model_copy(update={"sponsorship_saturation": "high"})
    assert filter_candidate(spammed, ideal) is False

def test_run_discovery_integration(tmp_path):
    ideal_file = tmp_path / "ideal_portrait.json"
    pool_file = tmp_path / "candidates_pool.json"
    output_file = tmp_path / "candidates_discovered.json"

    ideal_data = {
        "target_niches": ["fashion", "lifestyle"],
        "estimated_er_min": 3.0,
        "key_themes": ["capsule wardrobe"],
        "preferred_tone_of_voice": "friendly",
        "sponsorship_saturation_max": "medium",
        "activity_recency_max_days": 20,
        "rationale": "Integration test ideal portrait"
    }

    pool_data = [
        # Passing candidate 1
        {
            "username": "fashion_blogger_1",
            "biography": "Capsule wardrobe ideas",
            "followers_count": 50000,
            "engagement_rate": 4.5,
            "recent_posts": [{"caption": "Ootd post", "likes": 500}],
            "language": "ru",
            "niche": "fashion",
            "sponsorship_saturation": "low",
            "activity_recency": 3
        },
        # Passing candidate 2
        {
            "username": "lifestyle_blogger_2",
            "biography": "My lifestyle and fashion",
            "followers_count": 120000,
            "engagement_rate": 3.2,
            "recent_posts": [],
            "language": "en",
            "niche": "lifestyle",
            "sponsorship_saturation": "medium",
            "activity_recency": 10
        },
        # Failing candidate: low ER
        {
            "username": "low_er_blogger",
            "biography": "Style",
            "followers_count": 20000,
            "engagement_rate": 1.5,
            "language": "ru",
            "niche": "fashion",
            "sponsorship_saturation": "low",
            "activity_recency": 2
        },
        # Failing candidate: inactive
        {
            "username": "old_blogger",
            "biography": "Style",
            "followers_count": 20000,
            "engagement_rate": 4.0,
            "language": "ru",
            "niche": "fashion",
            "sponsorship_saturation": "low",
            "activity_recency": 45
        }
    ]

    with open(ideal_file, "w", encoding="utf-8") as f:
        json.dump(ideal_data, f, ensure_ascii=False, indent=2)

    with open(pool_file, "w", encoding="utf-8") as f:
        json.dump(pool_data, f, ensure_ascii=False, indent=2)

    results = run_discovery(
        ideal_path=str(ideal_file),
        pool_path=str(pool_file),
        output_path=str(output_file)
    )

    assert len(results) == 2
    assert results[0].username == "fashion_blogger_1"
    assert results[1].username == "lifestyle_blogger_2"

    assert os.path.exists(output_file)

    with open(output_file, "r", encoding="utf-8") as f:
        saved_json = json.load(f)

    assert len(saved_json) == 2
    parsed = [CandidateProfile.model_validate(item) for item in saved_json]
    assert parsed[0].username == "fashion_blogger_1"

def test_run_discovery_missing_files(tmp_path):
    missing_ideal = tmp_path / "non_existent_ideal.json"
    missing_pool = tmp_path / "non_existent_pool.json"
    output_file = tmp_path / "discovered.json"

    # Should gracefully return empty list without crashing
    results = run_discovery(
        ideal_path=str(missing_ideal),
        pool_path=str(missing_pool),
        output_path=str(output_file)
    )

    assert results == []
