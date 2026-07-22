# -*- coding: utf-8 -*-
"""
Basic tests for Embedding Similarity & Feature Scoring layer (TICKET-07).
Tests text representation builders, cosine similarity, deterministic feature scoring rules,
and integration execution exporting CandidateRerankResult artifacts.
"""

import os
import json
import pytest
from pathlib import Path

from src.shared.models import (
    IdealBloggerProfile,
    CandidateProfile,
    PostInfo,
    CandidateFeatureScore,
    CandidateRerankResult
)
from src.scoring.embed import (
    build_ideal_text,
    build_candidate_text,
    cosine_similarity
)
from src.scoring.score import (
    calculate_niche_score,
    calculate_er_score,
    calculate_recency_score,
    calculate_sponsorship_score,
    calculate_language_score,
    compute_candidate_feature_score,
    compute_aggregated_features_score,
    run_feature_scoring
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
        rationale="Synthetic ideal portrait for scoring tests"
    )


@pytest.fixture
def sample_candidate() -> CandidateProfile:
    return CandidateProfile(
        username="style_expert",
        biography="Minimalist fashion enthusiast",
        followers_count=15000,
        engagement_rate=4.2,
        recent_posts=[
            PostInfo(caption="Beige trench outfit ideas", date="2026-07-20", likes=500, comments=20)
        ],
        language="ru",
        niche="fashion",
        caption_tone="friendly",
        product_talk_style="outfit_breakdown",
        sponsorship_saturation="low",
        activity_recency=3
    )


def test_build_text_representations(sample_ideal_portrait, sample_candidate):
    ideal_text = build_ideal_text(sample_ideal_portrait)
    assert "fashion" in ideal_text
    assert "capsule wardrobe" in ideal_text
    assert "friendly" in ideal_text

    cand_text = build_candidate_text(sample_candidate)
    assert "@style_expert" in cand_text
    assert "fashion" in cand_text
    assert "Beige trench outfit ideas" in cand_text


def test_cosine_similarity():
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    v3 = [0.0, 1.0, 0.0]

    assert cosine_similarity(v1, v2) == pytest.approx(1.0)
    assert cosine_similarity(v1, v3) == pytest.approx(0.0)
    assert cosine_similarity([], [1.0]) == 0.0


def test_feature_score_rules(sample_ideal_portrait):
    # 1. Niche score
    assert calculate_niche_score("fashion", sample_ideal_portrait.target_niches) == 1.0
    assert calculate_niche_score("beauty", sample_ideal_portrait.target_niches) == 0.5
    assert calculate_niche_score("gaming", sample_ideal_portrait.target_niches) == 0.0

    # 2. ER score
    assert calculate_er_score(4.0, 3.5) == 1.0
    assert calculate_er_score(1.75, 3.5) == pytest.approx(0.5)
    assert calculate_er_score(0.0, 3.5) == 0.0

    # 3. Recency score
    assert calculate_recency_score(5, 14) == 1.0
    assert calculate_recency_score(21, 14) == pytest.approx(0.5)
    assert calculate_recency_score(30, 14) == 0.0

    # 4. Sponsorship score
    assert calculate_sponsorship_score("low", "low") == 1.0
    assert calculate_sponsorship_score("medium", "low") == 0.5
    assert calculate_sponsorship_score("high", "low") == 0.0

    # 5. Language score
    assert calculate_language_score("ru") == 1.0
    assert calculate_language_score("en") == 1.0
    assert calculate_language_score("fr") == 0.0


def test_compute_candidate_feature_score(sample_candidate, sample_ideal_portrait):
    feat_score = compute_candidate_feature_score(sample_candidate, sample_ideal_portrait)
    assert feat_score.username == "style_expert"
    assert 0.0 <= feat_score.niche_match_score <= 1.0
    assert 0.0 <= feat_score.er_match_score <= 1.0
    assert 0.0 <= feat_score.recency_match_score <= 1.0
    assert 0.0 <= feat_score.sponsorship_match_score <= 1.0
    assert 0.0 <= feat_score.language_match_score <= 1.0

    agg_score = compute_aggregated_features_score(feat_score)
    assert 0.0 <= agg_score <= 1.0


def test_run_feature_scoring_integration(tmp_path, sample_ideal_portrait, sample_candidate):
    ideal_file = tmp_path / "ideal_portrait.json"
    candidates_file = tmp_path / "candidates_discovered.json"
    similarity_file = tmp_path / "candidate_embeddings_similarity.json"
    output_file = tmp_path / "candidates_scored.json"

    # Save test ideal portrait
    with open(ideal_file, "w", encoding="utf-8") as f:
        json.dump(sample_ideal_portrait.model_dump(), f, ensure_ascii=False, indent=2)

    # Save test candidates
    with open(candidates_file, "w", encoding="utf-8") as f:
        json.dump([sample_candidate.model_dump()], f, ensure_ascii=False, indent=2)

    # Save test similarity artifact
    sim_data = [{"username": "style_expert", "semantic_similarity": 0.85}]
    with open(similarity_file, "w", encoding="utf-8") as f:
        json.dump(sim_data, f, ensure_ascii=False, indent=2)

    results = run_feature_scoring(
        ideal_path=str(ideal_file),
        candidates_path=str(candidates_file),
        similarity_path=str(similarity_file),
        output_path=str(output_file)
    )

    assert len(results) == 1
    res = results[0]
    assert isinstance(res, CandidateRerankResult)
    assert res.username == "style_expert"
    assert res.semantic_similarity == 0.85
    assert res.cross_encoder_score == 0.0  # Explicitly 0.0 until TICKET-08
    assert 0.0 <= res.features_score <= 1.0
    assert 0.0 <= res.composite_score <= 1.0

    assert os.path.exists(output_file)
    with open(output_file, "r", encoding="utf-8") as f:
        saved_json = json.load(f)

    assert len(saved_json) == 1
    parsed = CandidateRerankResult.model_validate(saved_json[0])
    assert parsed.username == "style_expert"
    assert parsed.cross_encoder_score == 0.0
