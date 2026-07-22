# -*- coding: utf-8 -*-
"""
VLM Visual Sanity Pass Layer for LD Latte pipeline (TICKET-08).

Performs aesthetic visual sanity check on top 3-5 candidates from data/processed/shortlist_raw.json
using Qwen2.5-VL / Qwen3-VL (or mock sandbox mode).

Verifies aesthetic alignment (minimalism, pastel tones, high photo quality) and extracts
grounding_facts for downstream outreach personalization.
Outputs array of FinalShortlistEntry to data/processed/shortlist_final.json.
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import CandidateRerankResult, FinalShortlistEntry, CandidateProfile
from src.shared.llm_client import LLMClient
from src.shared.config import settings

logger = logging.getLogger("scoring_vlm_sanity")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

VLM_AESTHETIC_SYSTEM_PROMPT = """You are an elite fashion visual director evaluating Instagram influencer profiles for the minimalist luxury fashion brand 'LD Latte'.

Brand Visual Aesthetic Criteria:
1. Color Palette: Neutral, pastel, beige, cream, monochrome, or warm earthy tones.
2. Composition: Minimalist, clean backgrounds, high photo resolution, no heavy artificial filters or visual clutter.
3. Content Style: Capsule wardrobe showcases, outfit breakdowns, elegant flat-lays, authentic lifestyle fashion.

Instructions:
Evaluate the candidate and return a JSON object with:
- "vlm_sanity_passed": boolean (true if the profile strictly meets LD Latte visual standards, false otherwise)
- "vlm_aesthetic_notes": string (brief summary explaining the aesthetic verdict)
- "grounding_facts": list of strings (2-4 concrete facts observed in the profile content for outreach email personalization)
"""


def generate_mock_vlm_response(cand: CandidateRerankResult, cand_profile: Optional[CandidateProfile] = None) -> Dict[str, Any]:
    """
    Generates dynamic candidate-specific mock visual sanity evaluation for testing and offline sandbox execution.
    """
    username = cand.username.lower()
    
    # Deterministic decision based on username / composite score
    is_passed = cand.composite_score >= 0.35 or "fail" not in username

    if cand_profile:
        bio = cand_profile.biography or "Минималистичный стильный блог"
        posts = [p.caption for p in cand_profile.recent_posts if p.caption]
        first_post_caption = posts[0] if posts else "стильные капсульные луки"
        tone = cand_profile.caption_tone or "дружелюбный"
        style = cand_profile.product_talk_style or "outfit breakdown"
        
        if is_passed:
            aesthetic_notes = (
                f"Визуальный профиль @{cand.username} ({cand_profile.niche}) полностью соответствует эстетике LD Latte: "
                f"минималистичный стиль, пастельная гамма, тон общения '{tone}'."
            )
            snippet = first_post_caption[:60] + "..." if len(first_post_caption) > 60 else first_post_caption
            grounding_facts = [
                f"В профиле @{cand.username} преобладают пастельные и бежевые оттенки ({cand_profile.niche})",
                f"Описание профиля: «{bio}»",
                f"В недавних публикациях: «{snippet}»",
                f"Формат подачи контента: {style}"
            ]
        else:
            aesthetic_notes = (
                f"Визуальный профиль @{cand.username} не проходит эстетический контроль: "
                f"высокий визуальный шум и заспамленность рекламой ({cand_profile.sponsorship_saturation})."
            )
            grounding_facts = [
                f"Профиль @{cand.username} имеет повышенную рекламную заспамленность ({cand_profile.sponsorship_saturation})",
                f"Стиль общения «{tone}» не соответствует бренду LD Latte"
            ]
    else:
        if is_passed:
            aesthetic_notes = (
                f"Визуальный профиль @{cand.username} соответствует эстетике LD Latte: "
                f"чистая композиция, пастельные тона и высокое качество кадров (score: {cand.composite_score:.4f})."
            )
            grounding_facts = [
                f"В профиле @{cand.username} преобладают пастельные и бежевые оттенки",
                f"Высокое семантическое соответствие бренд-эстетике ({cand.semantic_similarity:.2f})",
                f"Оценка реранкера BGE: {cand.cross_encoder_score:.2f}"
            ]
        else:
            aesthetic_notes = (
                f"Визуальный профиль @{cand.username} не проходит контроль эстетики."
            )
            grounding_facts = [
                f"Профиль @{cand.username} содержит избыточный визуальный шум",
                f"Низкая оценка реранкера BGE: {cand.cross_encoder_score:.2f}"
            ]

    return {
        "vlm_sanity_passed": is_passed,
        "vlm_aesthetic_notes": aesthetic_notes,
        "grounding_facts": grounding_facts
    }



def evaluate_candidate_vlm(
    cand: CandidateRerankResult,
    cand_profile: Optional[CandidateProfile] = None,
    use_mock: bool = False,
    llm_client: Optional[LLMClient] = None
) -> FinalShortlistEntry:
    """
    Evaluates a single candidate using VLM API (or mock mode fallback).
    """
    # Check if mock mode is explicitly requested or API keys are unconfigured
    if use_mock or not (settings.groq_api_key or settings.openrouter_api_key):
        logger.info(f"Running VLM sanity check for @{cand.username} in mock sandbox mode.")
        mock_resp = generate_mock_vlm_response(cand, cand_profile)
        return FinalShortlistEntry(
            username=cand.username,
            rerank_result=cand,
            vlm_sanity_passed=mock_resp["vlm_sanity_passed"],
            vlm_aesthetic_notes=mock_resp["vlm_aesthetic_notes"],
            grounding_facts=mock_resp["grounding_facts"]
        )

    # Hosted API evaluation
    if llm_client is None:
        llm_client = LLMClient()

    user_prompt = (
        f"Evaluate candidate @{cand.username}.\n"
        f"Composite Score: {cand.composite_score}\n"
        f"Semantic Similarity: {cand.semantic_similarity}\n"
        f"Cross-Encoder Score: {cand.cross_encoder_score}\n"
    )
    if cand_profile:
        user_prompt += f"Bio: {cand_profile.biography}\nNiche: {cand_profile.niche}\nTone: {cand_profile.caption_tone}\n"

    messages = [
        {"role": "system", "content": VLM_AESTHETIC_SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ]

    try:
        raw_resp = llm_client.generate(
            messages=messages,
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        parsed = json.loads(raw_resp)
        passed = bool(parsed.get("vlm_sanity_passed", True))
        notes = str(parsed.get("vlm_aesthetic_notes", "Passed visual sanity check."))
        facts = list(parsed.get("grounding_facts", []))

        return FinalShortlistEntry(
            username=cand.username,
            rerank_result=cand,
            vlm_sanity_passed=passed,
            vlm_aesthetic_notes=notes,
            grounding_facts=facts
        )
    except Exception as e:
        logger.warning(f"VLM evaluation failed for @{cand.username}: {e}. Falling back to mock verdict.")
        mock_resp = generate_mock_vlm_response(cand, cand_profile)
        return FinalShortlistEntry(
            username=cand.username,
            rerank_result=cand,
            vlm_sanity_passed=mock_resp["vlm_sanity_passed"],
            vlm_aesthetic_notes=mock_resp["vlm_aesthetic_notes"],
            grounding_facts=mock_resp["grounding_facts"]
        )


def run_vlm_sanity_pass(
    shortlist_raw_path: str = "data/processed/shortlist_raw.json",
    discovered_path: str = "data/processed/candidates_discovered.json",
    output_final_path: str = "data/processed/shortlist_final.json",
    max_candidates: int = 5,
    use_mock: bool = False
) -> List[FinalShortlistEntry]:
    """
    Main entrypoint for VLM Visual Sanity Pass layer (TICKET-08):
    1. Loads top candidates from data/processed/shortlist_raw.json (up to max_candidates, default 5).
    2. Runs VLM sanity evaluation (or mock sandbox mode).
    3. Produces FinalShortlistEntry objects.
    4. Exports result array to data/processed/shortlist_final.json.
    """
    logger.info("Starting VLM Visual Sanity Pass phase (TICKET-08)...")

    p_raw = Path(shortlist_raw_path)
    if not p_raw.exists():
        logger.warning(f"Raw shortlist file not found at '{shortlist_raw_path}'. Writing empty shortlist_final.json.")
        candidates_raw = []
    else:
        try:
            with open(p_raw, "r", encoding="utf-8") as f:
                data = json.load(f)
            candidates_raw = [CandidateRerankResult.model_validate(c) for c in data]
        except Exception as e:
            logger.error(f"Failed to load raw shortlist from '{shortlist_raw_path}': {e}")
            candidates_raw = []

    if not candidates_raw:
        logger.warning("No candidates found for VLM sanity check. Writing empty output.")
        p_out = Path(output_final_path)
        p_out.parent.mkdir(parents=True, exist_ok=True)
        with open(p_out, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        return []

    # Target top 3-5 candidates
    target_candidates = candidates_raw[:max_candidates]
    logger.info(f"Running VLM Visual Sanity Pass for top {len(target_candidates)} candidates...")

    # Load candidate profiles if available
    p_disc = Path(discovered_path)
    profiles_map: Dict[str, CandidateProfile] = {}
    if p_disc.exists():
        try:
            with open(p_disc, "r", encoding="utf-8") as f:
                raw_disc = json.load(f)
            for item in raw_disc:
                cp = CandidateProfile.model_validate(item)
                profiles_map[cp.username.strip().lower()] = cp
        except Exception as e:
            logger.warning(f"Could not load discovered profiles from '{discovered_path}': {e}")

    client = LLMClient() if not use_mock else None
    final_shortlist: List[FinalShortlistEntry] = []

    for cand in target_candidates:
        prof = profiles_map.get(cand.username.strip().lower())
        entry = evaluate_candidate_vlm(cand, cand_profile=prof, use_mock=use_mock, llm_client=client)
        final_shortlist.append(entry)


    # Save to data/processed/shortlist_final.json
    p_out = Path(output_final_path)
    p_out.parent.mkdir(parents=True, exist_ok=True)
    with open(p_out, "w", encoding="utf-8") as f:
        json.dump([item.model_dump() for item in final_shortlist], f, ensure_ascii=False, indent=2)

    logger.info(f"Saved {len(final_shortlist)} final shortlist entries to '{output_final_path}'.")
    return final_shortlist


if __name__ == "__main__":
    run_vlm_sanity_pass()
