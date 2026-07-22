# -*- coding: utf-8 -*-
"""
Unit and integration tests for Outreach Generator & QA module.
Tests schema validation, language selection, strict grounding,
fallback behavior, and end-to-end execution.
"""

import os
import json
import pytest
from pathlib import Path

from src.shared.models import (
    OutreachDraft,
    FinalShortlistEntry,
    CandidateRerankResult
)
from src.outreach.generator import (
    build_deterministic_fallback_draft,
    validate_qa_draft,
    generate_single_offer,
    run_outreach_generation
)


def test_outreach_draft_schema_validity():
    """Verify OutreachDraft Pydantic model validation and serializability."""
    draft_data = {
        "username": "test_user",
        "subject": "Бартерное сотрудничество c LD Latte",
        "body": "Здравствуйте! Предлагаем бартерное сотрудничество...",
        "language": "ru",
        "personalized_elements": ["Эстетика минимализма", "Ниша: fashion"],
        "grounding_facts": ["Профиль посвящен стильным образам"]
    }
    
    draft = OutreachDraft.model_validate(draft_data)
    assert draft.username == "test_user"
    assert draft.language == "ru"
    assert len(draft.personalized_elements) == 2
    assert len(draft.grounding_facts) == 1

    serialized = draft.model_dump()
    assert serialized["username"] == "test_user"
    assert isinstance(serialized["personalized_elements"], list)


def test_language_selection_ru_and_en():
    """Verify that language selection produces appropriate Russian and English drafts."""
    entry = FinalShortlistEntry(
        username="fashion_blogger",
        rerank_result=CandidateRerankResult(username="fashion_blogger"),
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Minimalist palette",
        grounding_facts=["Authentic fashion content"]
    )

    # Test Russian candidate
    cand_ru = {"username": "fashion_blogger", "language": "ru", "niche": "fashion", "biography": "Стильные образы"}
    draft_ru = build_deterministic_fallback_draft(entry, cand_ru)
    assert draft_ru.language == "ru"
    assert "Стильный подарок от LD Latte" in draft_ru.subject
    assert "Здравствуйте" in draft_ru.body

    # Test English candidate
    cand_en = {"username": "fashion_blogger", "language": "en", "niche": "fashion", "biography": "Fashion style diary"}
    draft_en = build_deterministic_fallback_draft(entry, cand_en)
    assert draft_en.language == "en"
    assert "Collaboration offer from LD Latte" in draft_en.subject
    assert "Hello" in draft_en.body


def test_strict_grounding_no_invented_facts():
    """Verify that grounding facts strictly retain real input facts without invention."""
    entry = FinalShortlistEntry(
        username="real_user",
        rerank_result=CandidateRerankResult(username="real_user"),
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Pastel visual feed",
        grounding_facts=["Real fact: bio mentions capsule wardrobe"]
    )
    cand_info = {
        "username": "real_user",
        "language": "ru",
        "biography": "Капсульный гардероб каждый день",
        "niche": "fashion / style",
        "caption_tone": "friendly"
    }

    draft = build_deterministic_fallback_draft(entry, cand_info)
    
    # Assert ground facts contain real information
    combined_facts_str = " ".join(draft.grounding_facts)
    assert "Капсульный гардероб" in combined_facts_str
    assert "fashion / style" in combined_facts_str
    
    # Assert no fake numbers or fake posts are present
    assert "100k followers" not in combined_facts_str
    assert "http://" not in combined_facts_str


def test_qa_validation_pass_and_fail():
    """Verify QA validation catches invalid drafts (empty body, language drift, etc.)."""
    valid_draft = OutreachDraft(
        username="user1",
        subject="Valid Subject Line Here",
        body="Здравствуйте! Это валидный текст предложения длиной более 20 символов.",
        language="ru",
        personalized_elements=["Fashion niche"],
        grounding_facts=["Bio contains fashion"]
    )
    assert validate_qa_draft(valid_draft, target_lang="ru") is True

    # Empty subject test
    invalid_draft_subject = OutreachDraft(
        username="user1",
        subject="",
        body="Здравствуйте! Это текст предложения...",
        language="ru",
        personalized_elements=["Fashion"],
        grounding_facts=["Fact"]
    )
    assert validate_qa_draft(invalid_draft_subject, target_lang="ru") is False

    # Language drift test (expected ru, got english body)
    invalid_draft_lang = OutreachDraft(
        username="user1",
        subject="Collaboration Offer",
        body="Hello there! This is a complete English letter body without Russian text.",
        language="en",
        personalized_elements=["Fashion"],
        grounding_facts=["Fact"]
    )
    assert validate_qa_draft(invalid_draft_lang, target_lang="ru") is False


def test_anti_robotic_qa_check():
    """Verify QA validator rejects drafts containing robotic jargon or raw metadata terms."""
    robotic_draft = OutreachDraft(
        username="robotic_user",
        subject="Сотрудничество с LD Latte",
        body="Мы от бренда LD Latte обратили внимание на ваш дружелюбный и аутентичный тон и лайфстайл ниша...",
        language="ru",
        personalized_elements=["Friendly tone"],
        grounding_facts=["Authentic content"]
    )
    assert validate_qa_draft(robotic_draft, target_lang="ru") is False



def test_fallback_behavior_without_llm():
    """Verify fallback draft generation works cleanly when LLM client is None."""
    entry = FinalShortlistEntry(
        username="fallback_user",
        rerank_result=CandidateRerankResult(username="fallback_user"),
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Clean visual style",
        grounding_facts=["Authentic blogger"]
    )
    cand_info = {"username": "fallback_user", "language": "ru", "niche": "fashion"}

    draft = generate_single_offer(
        shortlist_entry=entry,
        candidate_info=cand_info,
        system_prompt="Test system prompt",
        llm_client=None  # Force fallback path
    )

    assert draft.username == "fallback_user"
    assert draft.language == "ru"
    assert len(draft.personalized_elements) > 0
    assert len(draft.grounding_facts) > 0


def test_full_outreach_generation_run(tmp_path):
    """Integration test: run full pipeline writing output file."""
    test_shortlist = tmp_path / "shortlist_final.json"
    test_candidates = tmp_path / "candidates_discovered.json"
    test_output = tmp_path / "barter_offers.json"

    shortlist_data = [
        {
            "username": "llaurraiiam",
            "rerank_result": {
                "username": "llaurraiiam",
                "semantic_similarity": 0.7035,
                "features_score": 0.4524,
                "cross_encoder_score": 0.502,
                "composite_score": 0.5552,
                "similarity_breakdown": {}
            },
            "vlm_sanity_passed": True,
            "vlm_aesthetic_notes": "Clean minimalist aesthetic",
            "grounding_facts": ["Lifestyle and model content"]
        }
    ]

    candidates_data = [
        {
            "username": "llaurraiiam",
            "biography": "Lifestyle / model / trvl 🎞️ Make up / сотрудничество dm 📩",
            "followers_count": 11461,
            "engagement_rate": 0.035,
            "recent_posts": [],
            "language": "ru",
            "niche": "lifestyle / beauty / coffee",
            "caption_tone": "friendly / authentic",
            "product_talk_style": "outfit_breakdown",
            "sponsorship_saturation": "medium",
            "activity_recency": 3,
            "contact_info": None
        }
    ]

    with open(test_shortlist, "w", encoding="utf-8") as f:
        json.dump(shortlist_data, f, ensure_ascii=False)

    with open(test_candidates, "w", encoding="utf-8") as f:
        json.dump(candidates_data, f, ensure_ascii=False)

    results = run_outreach_generation(
        shortlist_path=str(test_shortlist),
        candidates_path=str(test_candidates),
        output_path=str(test_output),
        use_llm=False  # Deterministic test run
    )

    assert len(results) == 1
    assert results[0].username == "llaurraiiam"
    assert os.path.exists(test_output)

    with open(test_output, "r", encoding="utf-8") as f:
        saved_json = json.load(f)

    assert len(saved_json) == 1
    validated = OutreachDraft.model_validate(saved_json[0])
    assert validated.username == "llaurraiiam"
