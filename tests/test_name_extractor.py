# -*- coding: utf-8 -*-
"""
Unit and integration tests for First Name Extraction & Personalization Upgrade (TICKET-09A).
Tests biography priority, username fallback, Cyrillic/Latin support,
stopword filtering, noisy/junk username handling, and deterministic greeting assembly.
"""

import pytest
from src.outreach.name_extractor import (
    extract_first_name,
    extract_from_biography,
    extract_from_username,
    NameExtractionResult
)
from src.shared.models import FinalShortlistEntry, CandidateRerankResult
from src.outreach.generator import build_deterministic_fallback_draft


def test_bio_explicit_name_extraction_cyrillic_and_latin():
    """Verify name extraction from explicit bio introductions and headers."""
    # Pattern 1: Intro Cyrillic
    res1 = extract_first_name(biography="Привет всем! Меня зовут Кристина ✨", username="kristi_naxodka")
    assert res1.confidence == "high"
    assert res1.first_name == "Кристина"
    assert res1.greeting_name == "Кристина"
    assert res1.source == "biography"

    # Pattern 2: Header separator Cyrillic
    res2 = extract_first_name(biography="Дарья | Fashion & Lifestyle\nСотрудничество DM", username="daria_grogulenko")
    assert res2.confidence == "high"
    assert res2.first_name == "Дарья"
    assert res2.greeting_name == "Дарья"
    assert res2.source == "biography"

    # Pattern 3: Header separator Latin (transliterates to natural Cyrillic Катя)
    res3 = extract_first_name(biography="Kate • Model & Content Creator 🎞️", username="_kate_bruni")
    assert res3.confidence == "high"
    assert res3.first_name == "Катя"
    assert res3.greeting_name == "Катя"
    assert res3.source == "biography"

    # Pattern 4: Profession + Name
    res4 = extract_first_name(biography="Персональный стилист Алена | Москва", username="bazhenova_alenaa")
    assert res4.confidence == "high"
    assert res4.first_name == "Алена"
    assert res4.greeting_name == "Алена"


def test_username_fallback_extraction():
    """Verify fallback to username when bio has no explicit name."""
    # Username with valid human name token (transliterates to natural Cyrillic Дарья / Зари)
    res = extract_first_name(biography="Visual fashion diary / lifestyle", username="daria_grogulenko")
    assert res.confidence == "high"
    assert res.first_name == "Дарья"
    assert res.greeting_name == "Дарья"
    assert res.source == "username"

    res_zari = extract_first_name(biography="Daily fashion looks", username="zari.ishikhovaa")
    assert res_zari.confidence == "high"
    assert res_zari.first_name == "Зари"
    assert res_zari.greeting_name == "Зари"


def test_digit_containing_and_noisy_usernames_fallback():
    """Verify noisy usernames with digits/junk fall back to @username with low confidence."""
    # Digit containing usernames
    res1 = extract_first_name(biography="Fashion blog", username="19.voron")
    assert res1.confidence == "low"
    assert res1.first_name is None
    assert res1.greeting_name == "@19.voron"

    res2 = extract_first_name(biography="", username="rtini.a13")
    assert res2.confidence == "low"
    assert res2.first_name is None
    assert res2.greeting_name == "@rtini.a13"

    res3 = extract_first_name(biography="", username="ninooochka2.0")
    assert res3.confidence == "low"
    assert res3.first_name is None
    assert res3.greeting_name == "@ninooochka2.0"


def test_branded_and_non_human_usernames_fallback():
    """Verify commercial/branded/niche usernames fall back to @username (regex-only, no LLM)."""
    # Cosm / beauty / obzor / wb
    res1 = extract_first_name(biography="Beauty reviews & products", username="jd_cosm", use_llm_fallback=False)
    assert res1.confidence == "low"
    assert res1.greeting_name == "@jd_cosm"

    res2 = extract_first_name(biography="Beauty & makeup blog", username="v.m.Beauty_blog", use_llm_fallback=False)
    assert res2.confidence == "low"
    assert res2.greeting_name == "@v.m.Beauty_blog"

    res3 = extract_first_name(biography="Обзоры продуктов WB", username="sha_obzor.wb", use_llm_fallback=False)
    assert res3.confidence == "low"
    assert res3.greeting_name == "@sha_obzor.wb"


def test_bio_without_name_fallback():
    """Verify bio without name or with stop-words only falls back to @username."""
    bio_store = "Официальный магазин капсульной одежды. Доставка по всей России."
    res = extract_first_name(biography=bio_store, username="store_official")
    assert res.confidence == "low"
    assert res.first_name is None
    assert res.greeting_name == "@store_official"


def test_ambiguous_short_tokens():
    """Verify ambiguous short or non-name tokens are low confidence (regex-only, no LLM)."""
    res = extract_first_name(biography="Style & Life", username="shalafaeva.al", use_llm_fallback=False)
    assert res.confidence == "low"
    assert res.greeting_name == "@shalafaeva.al"


def test_outreach_draft_greeting_integration():
    """Integration test: verify deterministic draft greeting assembly."""
    entry = FinalShortlistEntry(
        username="daria_grogulenko",
        rerank_result=CandidateRerankResult(username="daria_grogulenko"),
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Minimalist",
        grounding_facts=["Fashion content"]
    )

    # High confidence case: bio has name "Дарья"
    cand_high = {
        "username": "daria_grogulenko",
        "language": "ru",
        "biography": "Дарья | Минимализм и капсульный гардероб",
        "niche": "fashion"
    }
    draft_high = build_deterministic_fallback_draft(entry, cand_high)
    assert "Здравствуйте, Дарья!" in draft_high.body
    assert "Извлеченное имя (high confidence): Дарья" in draft_high.personalized_elements

    # Low confidence case: noisy username with digits
    entry_digit = FinalShortlistEntry(
        username="19.voron",
        rerank_result=CandidateRerankResult(username="19.voron"),
        vlm_sanity_passed=True,
        vlm_aesthetic_notes="Dark aesthetic",
        grounding_facts=["Lifestyle content"]
    )
    cand_low = {
        "username": "19.voron",
        "language": "ru",
        "biography": "Lifestyle content",
        "niche": "fashion"
    }
    draft_low = build_deterministic_fallback_draft(entry_digit, cand_low)
    assert "Здравствуйте, @19.voron!" in draft_low.body
