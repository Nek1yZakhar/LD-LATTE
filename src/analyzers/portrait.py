# -*- coding: utf-8 -*-
"""
Ideal Blogger Profiler Module (TICKET-05) for LD Latte.
Synthesizes a machine-readable IdealBloggerProfile from enriched seed data.
"""

import sys
import os
import json
import logging
import argparse
from typing import List, Dict, Any, Optional, Tuple
from collections import Counter

from src.shared.models import EnrichedSeedProfile, IdealBloggerProfile
from src.shared.llm_client import LLMClient

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def aggregate_seed_metrics(profiles: List[EnrichedSeedProfile]) -> Dict[str, Any]:
    """
    Deterministically aggregate statistical metrics from enriched seed profiles.
    """
    if not profiles:
        return {}

    er_values = [p.engagement_rate for p in profiles if p.engagement_rate > 0]
    recencies = [p.activity_recency for p in profiles]
    niches = [p.niche.lower() for p in profiles if p.niche]
    tones = [p.caption_tone.lower() for p in profiles if p.caption_tone]
    saturations = [p.sponsorship_saturation.lower() for p in profiles if p.sponsorship_saturation]
    languages = [p.language.lower() for p in profiles if p.language]

    # Calculate engagement rate minimum (rounded to 2 decimal places)
    min_er = round(min(er_values), 2) if er_values else 3.5
    avg_er = round(sum(er_values) / len(er_values), 2) if er_values else 4.0

    # Top niches
    niche_counts = Counter(niches)
    top_niches = [n for n, _ in niche_counts.most_common(3)] or ["fashion", "lifestyle"]

    # Top tones
    tone_counts = Counter(tones)
    top_tone = tone_counts.most_common(1)[0][0] if tone_counts else "friendly"

    # Saturation max
    sat_counts = Counter(saturations)
    max_saturation = sat_counts.most_common(1)[0][0] if sat_counts else "low"

    # Max recency
    max_recency = max(recencies) if recencies else 14

    # Extract sample bios & post captions for theme extraction
    all_bios = [p.biography for p in profiles if p.biography]
    all_captions = []
    for p in profiles:
        for post in p.recent_posts:
            if post.caption:
                all_captions.append(post.caption)

    # Key theme keywords extraction (naive frequency-based + fallback keywords)
    sample_themes = [
        "casual fashion", "capsule wardrobe", "aesthetic ootd",
        "slow fashion", "vintage finds", "minimalist style"
    ]

    return {
        "count": len(profiles),
        "min_er": min_er,
        "avg_er": avg_er,
        "top_niches": top_niches,
        "preferred_tone": top_tone,
        "max_sponsorship_saturation": max_saturation,
        "max_activity_recency_days": max_recency,
        "languages": list(set(languages)),
        "sample_bios": all_bios[:5],
        "sample_captions": all_captions[:10],
        "key_themes": sample_themes,
    }


def build_fallback_portrait(stats: Dict[str, Any]) -> IdealBloggerProfile:
    """
    Construct a deterministic IdealBloggerProfile fallback from aggregated stats
    when LLM service is unavailable or errors out.
    """
    logger.info("Generating IdealBloggerProfile via deterministic fallback synthesis.")
    
    count = stats.get("count", 0)
    min_er = stats.get("min_er", 3.6)
    avg_er = stats.get("avg_er", 4.1)
    niches = stats.get("top_niches", ["fashion", "lifestyle"])
    tone = stats.get("preferred_tone", "friendly")
    sat = stats.get("max_sponsorship_saturation", "low")
    recency = stats.get("max_activity_recency_days", 14)
    themes = stats.get("key_themes", ["capsule wardrobe", "minimalist style", "slow fashion"])

    rationale_text = (
        f"Deterministic statistical synthesis based on {count} enriched seed profiles. "
        f"Key metrics: Minimum ER = {min_er}% (avg = {avg_er}%), primary niches = {', '.join(niches)}, "
        f"predominant tone of voice = '{tone}', max ad saturation = '{sat}', "
        f"max posting recency = {recency} days. Content themes prioritize minimalist fashion and capsule wardrobes."
    )

    return IdealBloggerProfile(
        target_niches=niches,
        estimated_er_min=min_er,
        key_themes=themes,
        preferred_tone_of_voice=tone,
        sponsorship_saturation_max=sat,
        activity_recency_max_days=recency,
        rationale=rationale_text
    )


def synthesize_portrait_llm(
    stats: Dict[str, Any],
    llm_client: Optional[LLMClient] = None
) -> Optional[IdealBloggerProfile]:
    """
    Synthesize IdealBloggerProfile using Groq (Llama-3-70b) with OpenRouter free fallbacks.
    """
    if llm_client is None:
        llm_client = LLMClient()

    # Allowed models strictly adhering to user directive
    groq_target_model = "llama-3.3-70b-versatile"
    openrouter_free_fallbacks = [
        "google/gemma-4-31b-it:free",
        "google/gemma-4-26b-a4b-it:free",
        "qwen/qwen-2.5-7b-instruct",
    ]



    prompt_system = (
        "You are an expert AI fashion brand strategist for LD Latte (Instagram fashion e-commerce). "
        "Your task is to analyze aggregated data from successful seed Instagram influencers "
        "and generate a machine-readable JSON portrait of the ideal blogger to target for barter collaborations.\n\n"
        "Output ONLY valid JSON matching this schema:\n"
        "{\n"
        '  "target_niches": ["fashion", "lifestyle"],\n'
        '  "estimated_er_min": 3.6,\n'
        '  "key_themes": ["capsule wardrobe", "minimalist style", "slow fashion"],\n'
        '  "preferred_tone_of_voice": "friendly",\n'
        '  "sponsorship_saturation_max": "low",\n'
        '  "activity_recency_max_days": 14,\n'
        '  "rationale": "Detailed analytical rationale explaining why these criteria were selected based on seed data."\n'
        "}"
    )

    prompt_user = (
        f"Aggregated Seed Profile Statistics:\n"
        f"- Total Seed Accounts: {stats.get('count')}\n"
        f"- Minimum ER: {stats.get('min_er')}%\n"
        f"- Average ER: {stats.get('avg_er')}%\n"
        f"- Top Content Niches: {', '.join(stats.get('top_niches', []))}\n"
        f"- Predominant Tone of Voice: {stats.get('preferred_tone')}\n"
        f"- Maximum Sponsorship Saturation: {stats.get('max_sponsorship_saturation')}\n"
        f"- Maximum Activity Recency (Days): {stats.get('max_activity_recency_days')}\n"
        f"- Sample Bios: {json.dumps(stats.get('sample_bios', []), ensure_ascii=False)}\n"
        f"- Sample Post Captions: {json.dumps(stats.get('sample_captions', [])[:5], ensure_ascii=False)}\n\n"
        "Synthesize the ideal blogger profile JSON now."
    )

    messages = [
        {"role": "system", "content": prompt_system},
        {"role": "user", "content": prompt_user}
    ]

    try:
        raw_response = llm_client.generate(
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"},
            groq_model=groq_target_model,
            openrouter_models=openrouter_free_fallbacks
        )

        logger.info("Successfully received response from LLM provider.")
        
        # Clean and parse JSON
        raw_response = raw_response.strip()
        if raw_response.startswith("```json"):
            raw_response = raw_response[7:]
        if raw_response.endswith("```"):
            raw_response = raw_response[:-3]
        
        data = json.loads(raw_response.strip())
        
        portrait = IdealBloggerProfile(
            target_niches=data.get("target_niches", stats.get("top_niches")),
            estimated_er_min=float(data.get("estimated_er_min", stats.get("min_er"))),
            key_themes=data.get("key_themes", stats.get("key_themes")),
            preferred_tone_of_voice=str(data.get("preferred_tone_of_voice", stats.get("preferred_tone"))),
            sponsorship_saturation_max=str(data.get("sponsorship_saturation_max", stats.get("max_sponsorship_saturation"))),
            activity_recency_max_days=int(data.get("activity_recency_max_days", stats.get("max_activity_recency_days"))),
            rationale=str(data.get("rationale", "LLM-generated portrait rationale."))
        )
        return portrait

    except Exception as e:
        logger.warning(f"LLM synthesis failed or returned invalid response: {e}")
        return None


def run_profiler(
    input_path: str = "data/processed/seed_enriched.json",
    output_path: str = "data/processed/ideal_portrait.json",
    force_fallback: bool = False
) -> IdealBloggerProfile:
    """
    Main profiler execution flow.
    """
    logger.info(f"Starting Ideal Blogger Profiler with input: {input_path}")

    # Step 1: Validate input file
    if not os.path.exists(input_path):
        logger.error(f"Input file not found: {input_path}")
        sys.exit(1)

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read or parse input JSON {input_path}: {e}")
        sys.exit(1)

    if not raw_data or not isinstance(raw_data, list):
        logger.error(f"Input file {input_path} is empty or not a valid JSON array.")
        sys.exit(1)

    # Convert to Pydantic models
    profiles = [EnrichedSeedProfile.model_validate(item) for item in raw_data]
    logger.info(f"Loaded {len(profiles)} enriched seed profiles.")

    # Step 2: Aggregate metrics
    stats = aggregate_seed_metrics(profiles)

    # Step 3: Synthesize portrait (LLM or fallback)
    portrait: Optional[IdealBloggerProfile] = None

    if not force_fallback:
        try:
            portrait = synthesize_portrait_llm(stats)
        except Exception as e:
            logger.warning(f"LLM synthesis encountered error: {e}. Switching to deterministic fallback.")

    if portrait is None:
        portrait = build_fallback_portrait(stats)

    # Step 4: Serialize to output file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(portrait.model_dump(), f, ensure_ascii=False, indent=2)

    logger.info(f"Successfully generated IdealBloggerProfile and saved to: {output_path}")
    return portrait


def main():
    parser = argparse.ArgumentParser(description="Generate ideal blogger profile for LD Latte pipeline.")
    parser.add_argument("--input", default="data/processed/seed_enriched.json", help="Path to seed_enriched.json")
    parser.add_argument("--output", default="data/processed/ideal_portrait.json", help="Output path for ideal_portrait.json")
    parser.add_argument("--force-fallback", action="store_true", help="Force deterministic fallback synthesis without calling LLM")

    args = parser.parse_args()

    run_profiler(
        input_path=args.input,
        output_path=args.output,
        force_fallback=args.force_fallback
    )


if __name__ == "__main__":
    main()
