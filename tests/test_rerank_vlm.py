# -*- coding: utf-8 -*-
"""
Tests for Cross-Encoder Reranking & VLM Visual Sanity Pass layer (TICKET-08).
"""

import os
import json
import pytest
from pathlib import Path

from src.shared.models import (
    IdealBloggerProfile,
    CandidateProfile,
    CandidateRerankResult,
    FinalShortlistEntry,
    PostInfo
)
from src.scoring.rerank import (
    sigmoid_normalize,
    build_ideal_query_text,
    build_candidate_document_text,
    run_reranking
)
from src.scoring.vlm_sanity import (
    generate_mock_vlm_response,
    evaluate_candidate_vlm,
    run_vlm_sanity_pass
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
        rationale="Ideal portrait for rerank & VLM unit tests"
    )


@pytest.fixture
def sample_candidate_profile() -> CandidateProfile:
    return CandidateProfile(
        username="fashion_editor",
        biography="Capsule wardrobe & minimalist outfits",
        followers_count=20000,
        engagement_rate=4.5,
        recent_posts=[
            PostInfo(caption="Pastel trench coat outfit breakdown", date="2026-07-20", likes=800, comments=40)
        ],
        language="ru",
        niche="fashion",
        caption_tone="friendly",
        product_talk_style="outfit_breakdown",
        sponsorship_saturation="low",
        activity_recency=2
    )


@pytest.fixture
def sample_scored_candidate() -> CandidateRerankResult:
    return CandidateRerankResult(
        username="fashion_editor",
        semantic_similarity=0.80,
        features_score=0.90,
        cross_encoder_score=0.0,
        composite_score=0.85,
        similarity_breakdown={"note": "initial scoring"}
    )


def test_sigmoid_normalize():
    # 0 logit maps to 0.5
    assert sigmoid_normalize(0.0) == pytest.approx(0.5)
    # Positive logits map > 0.5
    assert sigmoid_normalize(2.0) > 0.5
    # Negative logits map < 0.5
    assert sigmoid_normalize(-2.0) < 0.5
    # Value is strictly within [0.0, 1.0]
    assert 0.0 <= sigmoid_normalize(10.0) <= 1.0
    assert 0.0 <= sigmoid_normalize(-10.0) <= 1.0


def test_build_query_and_document_text(sample_ideal_portrait, sample_scored_candidate, sample_candidate_profile):
    query_text = build_ideal_query_text(sample_ideal_portrait)
    assert "LD Latte" in query_text
    assert "fashion, lifestyle" in query_text
    assert "capsule wardrobe" in query_text

    doc_text = build_candidate_document_text(sample_scored_candidate, sample_candidate_profile)
    assert "@fashion_editor" in doc_text
    assert "Capsule wardrobe" in doc_text
    assert "Pastel trench coat outfit breakdown" in doc_text


def test_final_shortlist_entry_model(sample_scored_candidate):
    entry = FinalShortlistEntry(
        username="fashion_editor",
        rerank_result=sample_scored_candidate,
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Clean pastel aesthetic",
        grounding_facts=["Pastel trench coat breakdown"]
    )
    assert entry.username == "fashion_editor"
    assert entry.vlm_sanity_passed is True
    assert len(entry.grounding_facts) == 1
    assert entry.rerank_result.composite_score == 0.85


def test_run_reranking_mock_integration(tmp_path, sample_ideal_portrait, sample_scored_candidate, sample_candidate_profile):
    ideal_file = tmp_path / "ideal_portrait.json"
    scored_file = tmp_path / "candidates_scored.json"
    disc_file = tmp_path / "candidates_discovered.json"
    reranked_file = tmp_path / "candidates_reranked.json"
    shortlist_raw_file = tmp_path / "shortlist_raw.json"

    # Save test ideal portrait
    with open(ideal_file, "w", encoding="utf-8") as f:
        json.dump(sample_ideal_portrait.model_dump(), f, ensure_ascii=False, indent=2)

    # Save test candidates_scored
    with open(scored_file, "w", encoding="utf-8") as f:
        json.dump([sample_scored_candidate.model_dump()], f, ensure_ascii=False, indent=2)

    # Save test candidates_discovered
    with open(disc_file, "w", encoding="utf-8") as f:
        json.dump([sample_candidate_profile.model_dump()], f, ensure_ascii=False, indent=2)

    # Execute reranking in mock mode
    results = run_reranking(
        scored_path=str(scored_file),
        ideal_path=str(ideal_file),
        discovered_path=str(disc_file),
        output_reranked_path=str(reranked_file),
        output_shortlist_raw_path=str(shortlist_raw_file),
        top_n=5,
        use_mock=True
    )

    assert len(results) == 1
    res = results[0]
    assert res.username == "fashion_editor"
    assert res.cross_encoder_score > 0.0
    assert 0.0 <= res.composite_score <= 1.0

    # Ensure candidates_scored.json was NOT overwritten
    with open(scored_file, "r", encoding="utf-8") as f:
        original_scored = json.load(f)
    assert original_scored[0]["cross_encoder_score"] == 0.0

    # Verify candidates_reranked.json and shortlist_raw.json exist and are valid
    assert os.path.exists(reranked_file)
    assert os.path.exists(shortlist_raw_file)

    with open(shortlist_raw_file, "r", encoding="utf-8") as f:
        raw_shortlist = json.load(f)
    assert len(raw_shortlist) == 1
    assert raw_shortlist[0]["username"] == "fashion_editor"


def test_run_vlm_sanity_pass_mock_integration(tmp_path, sample_scored_candidate):
    shortlist_raw_file = tmp_path / "shortlist_raw.json"
    shortlist_final_file = tmp_path / "shortlist_final.json"

    # Save test shortlist_raw
    with open(shortlist_raw_file, "w", encoding="utf-8") as f:
        json.dump([sample_scored_candidate.model_dump()], f, ensure_ascii=False, indent=2)

    # Execute VLM sanity pass in mock mode
    final_entries = run_vlm_sanity_pass(
        shortlist_raw_path=str(shortlist_raw_file),
        output_final_path=str(shortlist_final_file),
        max_candidates=5,
        use_mock=True
    )

    assert len(final_entries) == 1
    entry = final_entries[0]
    assert isinstance(entry, FinalShortlistEntry)
    assert entry.username == "fashion_editor"
    assert entry.vlm_sanity_passed is True
    assert "LD Latte" in entry.vlm_aesthetic_notes
    assert len(entry.grounding_facts) > 0

    # Verify shortlist_final.json artifact
    assert os.path.exists(shortlist_final_file)
    with open(shortlist_final_file, "r", encoding="utf-8") as f:
        saved_final = json.load(f)
    assert len(saved_final) == 1
    parsed_entry = FinalShortlistEntry.model_validate(saved_final[0])
    assert parsed_entry.username == "fashion_editor"
    assert parsed_entry.vlm_sanity_passed is True
