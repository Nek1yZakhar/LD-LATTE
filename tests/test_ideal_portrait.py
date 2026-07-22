# -*- coding: utf-8 -*-
import os
import json
import pytest
from pathlib import Path

from src.shared.models import EnrichedSeedProfile, PostInfo, IdealBloggerProfile
from src.analyzers.portrait import (
    aggregate_seed_metrics,
    build_fallback_portrait,
    run_profiler
)

def test_aggregate_seed_metrics():
    profiles = [
        EnrichedSeedProfile(
            username="user1",
            biography="Fashion & lifestyle",
            followers_count=10000,
            engagement_rate=4.5,
            recent_posts=[PostInfo(caption="Beige coat #ootd", likes=400)],
            activity_recency=2,
            language="ru",
            niche="fashion",
            caption_tone="friendly",
            sponsorship_saturation="low"
        ),
        EnrichedSeedProfile(
            username="user2",
            biography="Minimalist outfits",
            followers_count=20000,
            engagement_rate=3.8,
            recent_posts=[PostInfo(caption="Silk shirt", likes=800)],
            activity_recency=5,
            language="ru",
            niche="fashion",
            caption_tone="friendly",
            sponsorship_saturation="low"
        ),
    ]

    stats = aggregate_seed_metrics(profiles)
    assert stats["count"] == 2
    assert stats["min_er"] == 3.8
    assert stats["avg_er"] == 4.15
    assert "fashion" in stats["top_niches"]
    assert stats["preferred_tone"] == "friendly"
    assert stats["max_sponsorship_saturation"] == "low"
    assert stats["max_activity_recency_days"] == 5

def test_fallback_portrait_synthesis():
    stats = {
        "count": 5,
        "min_er": 3.65,
        "avg_er": 4.1,
        "top_niches": ["fashion", "beauty"],
        "preferred_tone": "friendly",
        "max_sponsorship_saturation": "low",
        "max_activity_recency_days": 10,
        "key_themes": ["capsule wardrobe", "slow fashion"]
    }

    portrait = build_fallback_portrait(stats)
    assert isinstance(portrait, IdealBloggerProfile)
    assert portrait.estimated_er_min == 3.65
    assert portrait.target_niches == ["fashion", "beauty"]
    assert portrait.preferred_tone_of_voice == "friendly"
    assert portrait.sponsorship_saturation_max == "low"
    assert portrait.activity_recency_max_days == 10
    assert len(portrait.rationale) > 0

def test_run_profiler_full_flow(tmp_path):
    test_input = tmp_path / "seed_enriched_test.json"
    test_output = tmp_path / "ideal_portrait_test.json"

    seed_data = [
        {
            "username": "test_influencer",
            "biography": "Personal style diary",
            "followers_count": 50000,
            "posts_count": 120,
            "engagement_rate": 4.2,
            "recent_posts": [
                {"caption": "Capsule wardrobe essentials #fashion", "date": "2026-07-20T00:00:00", "likes": 2000, "comments": 30}
            ],
            "activity_recency": 1,
            "language": "ru",
            "niche": "fashion",
            "caption_tone": "friendly",
            "sponsorship_saturation": "low",
            "fetched_at": "2026-07-21T00:00:00"
        }
    ]

    with open(test_input, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)

    # Force fallback mode to guarantee deterministic offline execution
    portrait = run_profiler(
        input_path=str(test_input),
        output_path=str(test_output),
        force_fallback=True
    )

    # Verify file exists
    assert os.path.exists(test_output), "Output file ideal_portrait.json was not created"

    # Validate output schema
    with open(test_output, "r", encoding="utf-8") as f:
        saved_data = json.load(f)

    validated_portrait = IdealBloggerProfile.model_validate(saved_data)
    assert len(validated_portrait.target_niches) > 0
    assert validated_portrait.estimated_er_min > 0
    assert len(validated_portrait.preferred_tone_of_voice) > 0
    assert len(validated_portrait.rationale) > 0
