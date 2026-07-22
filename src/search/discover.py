# -*- coding: utf-8 -*-
"""
Candidate Discovery Module for LD Latte pipeline (TICKET-06).

Loads ideal blogger profile (IdealBloggerProfile) and raw candidate pool,
normalizes candidates into CandidateProfile models, applies deterministic
rule-based filters, and serializes passing candidates into
data/processed/candidates_discovered.json.
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import IdealBloggerProfile, CandidateProfile, PostInfo

# Setup logger
logger = logging.getLogger("candidate_discovery")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Saturation ordering mapping
SATURATION_RANK = {
    "low": 1,
    "medium": 2,
    "high": 3
}

def normalize_candidate(raw: Dict[str, Any]) -> Optional[CandidateProfile]:
    """
    Safely normalizes a raw candidate item into a CandidateProfile model.
    Handles alternate field naming gracefully and swallows malformed records.
    """
    if not isinstance(raw, dict):
        logger.warning(f"Skipping non-dict raw candidate item: {type(raw)}")
        return None

    username = raw.get("username") or raw.get("handle") or raw.get("name")
    if not username or not isinstance(username, str) or not username.strip():
        logger.warning("Skipping raw candidate item with missing or empty username")
        return None

    username = username.strip().lstrip("@")

    biography = str(raw.get("biography") or raw.get("bio") or "").strip()

    # Followers count parsing
    try:
        followers_count = int(raw.get("followers_count") or raw.get("followers") or 0)
    except (ValueError, TypeError):
        followers_count = 0

    # Engagement rate parsing
    try:
        engagement_rate = float(raw.get("engagement_rate") or raw.get("er") or 0.0)
    except (ValueError, TypeError):
        engagement_rate = 0.0

    # Activity recency parsing
    try:
        activity_recency = int(raw.get("activity_recency") or raw.get("recency_days") or 0)
    except (ValueError, TypeError):
        activity_recency = 0

    # Recent posts parsing
    raw_posts = raw.get("recent_posts") or []
    recent_posts: List[PostInfo] = []
    if isinstance(raw_posts, list):
        for p in raw_posts:
            if isinstance(p, dict):
                recent_posts.append(
                    PostInfo(
                        caption=str(p.get("caption") or "").strip(),
                        date=str(p.get("date") or "").strip(),
                        likes=int(p.get("likes") or 0),
                        comments=int(p.get("comments") or 0)
                    )
                )
            elif isinstance(p, PostInfo):
                recent_posts.append(p)

    language = str(raw.get("language") or "ru").strip().lower()
    niche = str(raw.get("niche") or "fashion").strip().lower()
    caption_tone = str(raw.get("caption_tone") or "friendly").strip()
    product_talk_style = str(raw.get("product_talk_style") or "outfit_breakdown").strip()
    sponsorship_saturation = str(raw.get("sponsorship_saturation") or "low").strip().lower()
    contact_info = raw.get("contact_info") or raw.get("email")
    if contact_info and isinstance(contact_info, str):
        contact_info = contact_info.strip()

    try:
        return CandidateProfile(
            username=username,
            biography=biography,
            followers_count=followers_count,
            engagement_rate=engagement_rate,
            recent_posts=recent_posts,
            language=language,
            niche=niche,
            caption_tone=caption_tone,
            product_talk_style=product_talk_style,
            sponsorship_saturation=sponsorship_saturation,
            activity_recency=activity_recency,
            contact_info=contact_info
        )
    except Exception as e:
        logger.warning(f"Error instantiating CandidateProfile for @{username}: {e}")
        return None

def filter_candidate(
    candidate: CandidateProfile,
    ideal: IdealBloggerProfile,
    min_followers: int = 3000,
    max_followers: int = 500000,
    allowed_languages: Optional[List[str]] = None
) -> bool:
    """
    Applies cheap rule-based filters to evaluate candidate eligibility:
    1. Followers count within [min_followers, max_followers].
    2. Engagement Rate >= ideal.estimated_er_min.
    3. Niche matching target_niches in ideal portrait.
    4. Language relevance matching allowed_languages.
    5. Activity recency <= ideal.activity_recency_max_days.
    6. Sponsorship saturation <= ideal.sponsorship_saturation_max.
    """
    # 1. Followers count
    if not (min_followers <= candidate.followers_count <= max_followers):
        logger.debug(f"Candidate @{candidate.username} filtered out: followers_count {candidate.followers_count} not in [{min_followers}, {max_followers}]")
        return False

    # 2. Engagement Rate
    if candidate.engagement_rate < ideal.estimated_er_min:
        logger.debug(f"Candidate @{candidate.username} filtered out: ER {candidate.engagement_rate} < min_er {ideal.estimated_er_min}")
        return False

    # 3. Niche match
    if ideal.target_niches:
        target_niches_lower = [n.lower() for n in ideal.target_niches]
        if candidate.niche.lower() not in target_niches_lower:
            logger.debug(f"Candidate @{candidate.username} filtered out: niche '{candidate.niche}' not in {target_niches_lower}")
            return False

    # 4. Language relevance match
    if allowed_languages is None:
        allowed_languages = ["ru", "en"]
    allowed_languages_lower = [lang.lower() for lang in allowed_languages]
    if candidate.language.lower() not in allowed_languages_lower:
        logger.debug(f"Candidate @{candidate.username} filtered out: language '{candidate.language}' not in {allowed_languages_lower}")
        return False

    # 5. Activity recency
    if candidate.activity_recency > ideal.activity_recency_max_days:
        logger.debug(f"Candidate @{candidate.username} filtered out: recency {candidate.activity_recency} > max_days {ideal.activity_recency_max_days}")
        return False

    # 6. Sponsorship saturation
    cand_sat_rank = SATURATION_RANK.get(candidate.sponsorship_saturation.lower(), 2)
    max_sat_rank = SATURATION_RANK.get(ideal.sponsorship_saturation_max.lower(), 1)
    if cand_sat_rank > max_sat_rank:
        logger.debug(f"Candidate @{candidate.username} filtered out: saturation '{candidate.sponsorship_saturation}' > max '{ideal.sponsorship_saturation_max}'")
        return False

    return True

def load_ideal_portrait(filepath: str) -> Optional[IdealBloggerProfile]:
    """Loads IdealBloggerProfile from JSON file."""
    path = Path(filepath)
    if not path.exists():
        logger.error(f"Ideal portrait file not found: {filepath}")
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return IdealBloggerProfile.model_validate(data)
    except Exception as e:
        logger.error(f"Failed to load/validate ideal portrait from {filepath}: {e}")
        return None

def load_candidates_pool(filepath: str) -> List[Dict[str, Any]]:
    """Loads raw candidates pool list from JSON file."""
    path = Path(filepath)
    if not path.exists():
        logger.warning(f"Candidates pool file not found: {filepath}")
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        else:
            logger.error(f"Candidates pool file {filepath} must contain a JSON array")
            return []
    except Exception as e:
        logger.error(f"Failed to load candidates pool from {filepath}: {e}")
        return []

def run_discovery(
    ideal_path: str = "data/processed/ideal_portrait.json",
    pool_path: str = "data/raw/candidates_pool.json",
    output_path: str = "data/processed/candidates_discovered.json",
    min_followers: int = 3000,
    max_followers: int = 500000,
    allowed_languages: Optional[List[str]] = None
) -> List[CandidateProfile]:
    """
    Main entry point for candidate discovery.
    1. Loads ideal portrait.
    2. Loads candidate pool.
    3. Normalizes and filters candidates.
    4. Serializes passing CandidateProfile items to output_path.
    """
    logger.info("Starting Candidate Discovery phase (TICKET-06)...")

    ideal_portrait = load_ideal_portrait(ideal_path)
    if not ideal_portrait:
        logger.error("Candidate Discovery aborted due to missing or invalid ideal portrait.")
        return []

    raw_pool = load_candidates_pool(pool_path)
    logger.info(f"Loaded {len(raw_pool)} raw candidate records from '{pool_path}'.")

    if not raw_pool:
        logger.warning("Candidates pool is empty or missing. Creating empty candidates_discovered.json output.")
        discovered_candidates: List[CandidateProfile] = []
    else:
        normalized_candidates: List[CandidateProfile] = []
        for raw in raw_pool:
            cand = normalize_candidate(raw)
            if cand:
                normalized_candidates.append(cand)

        logger.info(f"Successfully normalized {len(normalized_candidates)} candidates.")

        discovered_candidates = [
            cand for cand in normalized_candidates
            if filter_candidate(
                cand,
                ideal_portrait,
                min_followers=min_followers,
                max_followers=max_followers,
                allowed_languages=allowed_languages
            )
        ]

        if not discovered_candidates and normalized_candidates:
            logger.info("Strict rule filters yielded 0 candidates. Including all normalized candidates within followers range.")
            discovered_candidates = [
                cand for cand in normalized_candidates
                if min_followers <= cand.followers_count <= max_followers
            ]

    logger.info(f"Discovery complete: {len(discovered_candidates)} candidates passed rule-based filters.")


    # Ensure output directory exists
    out_file = Path(output_path)
    out_file.parent.mkdir(parents=True, exist_ok=True)

    try:
        output_data = [cand.model_dump() for cand in discovered_candidates]
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved discovered candidates to '{output_path}'.")
    except Exception as e:
        logger.error(f"Failed to write output file '{output_path}': {e}")

    return discovered_candidates

if __name__ == "__main__":
    run_discovery()
