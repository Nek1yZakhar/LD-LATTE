# -*- coding: utf-8 -*-
"""
Embedding Similarity Layer for LD Latte pipeline (TICKET-07).

Builds text representations for IdealBloggerProfile and CandidateProfile items,
invokes Qwen3-Embedding-0.6B via LocalEmbedder, calculates cosine similarity
between candidate vectors and ideal portrait centroid, and exports intermediate
artifact to data/processed/candidate_embeddings_similarity.json.
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import IdealBloggerProfile, CandidateProfile
from src.shared.embedder import LocalEmbedder

logger = logging.getLogger("scoring_embed")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def build_ideal_text(ideal: IdealBloggerProfile) -> str:
    """Builds a rich textual representation of the ideal blogger profile."""
    niches = ", ".join(ideal.target_niches) if ideal.target_niches else "fashion"
    themes = ", ".join(ideal.key_themes) if ideal.key_themes else "capsule wardrobe, minimalist style"
    return (
        f"Ideal blogger profile for fashion brand LD Latte. "
        f"Target Niches: {niches}. "
        f"Key Content Themes: {themes}. "
        f"Preferred Tone of Voice: {ideal.preferred_tone_of_voice}. "
        f"Rationale: {ideal.rationale}"
    ).strip()


def build_candidate_text(cand: CandidateProfile) -> str:
    """Builds a rich textual representation of a candidate profile."""
    recent_captions = [p.caption.strip() for p in cand.recent_posts if p.caption and p.caption.strip()]
    posts_str = " | ".join(recent_captions[:3]) if recent_captions else "No recent post captions available."

    return (
        f"Blogger handle: @{cand.username}. "
        f"Niche: {cand.niche}. "
        f"Language: {cand.language}. "
        f"Bio: {cand.biography or 'No bio provided'}. "
        f"Tone of voice: {cand.caption_tone}. "
        f"Product presentation style: {cand.product_talk_style}. "
        f"Recent post captions: {posts_str}"
    ).strip()


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculates cosine similarity between two numeric vectors."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = sum(a * a for a in vec1) ** 0.5
    norm2 = sum(b * b for b in vec2) ** 0.5
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return float(dot / (norm1 * norm2))


def compute_embeddings_and_similarity(
    ideal: IdealBloggerProfile,
    candidates: List[CandidateProfile],
    embedder: Optional[LocalEmbedder] = None
) -> List[Dict[str, Any]]:
    """
    Computes Qwen3 embeddings for ideal portrait and candidates, returning
    a list of dictionaries with username and semantic_similarity score.
    """
    if not candidates:
        logger.info("No candidates provided for embedding similarity calculation.")
        return []

    if embedder is None:
        embedder = LocalEmbedder()

    ideal_text = build_ideal_text(ideal)
    cand_texts = [build_candidate_text(c) for c in candidates]

    logger.info(f"Generating embeddings for ideal centroid and {len(candidates)} candidates...")
    all_texts = [ideal_text] + cand_texts
    all_embeddings = embedder.get_embeddings(all_texts)

    ideal_vector = all_embeddings[0]
    cand_vectors = all_embeddings[1:]

    results: List[Dict[str, Any]] = []
    for cand, vec in zip(candidates, cand_vectors):
        sim = cosine_similarity(ideal_vector, vec)
        # Clamp similarity to [0.0, 1.0] for normalized scoring
        clamped_sim = max(0.0, min(1.0, float(sim)))
        results.append({
            "username": cand.username,
            "semantic_similarity": round(clamped_sim, 4)
        })
        logger.debug(f"Candidate @{cand.username} semantic similarity: {clamped_sim:.4f}")

    return results


def run_embedding_layer(
    ideal_path: str = "data/processed/ideal_portrait.json",
    candidates_path: str = "data/processed/candidates_discovered.json",
    output_path: str = "data/processed/candidate_embeddings_similarity.json"
) -> List[Dict[str, Any]]:
    """
    CLI entrypoint logic for embedding layer:
    Reads ideal portrait & discovered candidates, calculates similarity, and saves artifact.
    """
    logger.info("Starting Embedding Similarity Layer (TICKET-07)...")

    # 1. Load ideal portrait
    p_ideal = Path(ideal_path)
    if not p_ideal.exists():
        logger.error(f"Ideal portrait file not found at '{ideal_path}'")
        return []
    try:
        with open(p_ideal, "r", encoding="utf-8") as f:
            ideal = IdealBloggerProfile.model_validate(json.load(f))
    except Exception as e:
        logger.error(f"Failed to load ideal portrait from '{ideal_path}': {e}")
        return []

    # 2. Load discovered candidates
    p_cand = Path(candidates_path)
    if not p_cand.exists():
        logger.warning(f"Candidates discovered file not found at '{candidates_path}'.")
        candidates = []
    else:
        try:
            with open(p_cand, "r", encoding="utf-8") as f:
                raw_cands = json.load(f)
            candidates = [CandidateProfile.model_validate(c) for c in raw_cands]
        except Exception as e:
            logger.error(f"Failed to load candidates from '{candidates_path}': {e}")
            candidates = []

    # 3. Compute similarities
    results = compute_embeddings_and_similarity(ideal, candidates)

    # 4. Save output artifact
    p_out = Path(output_path)
    p_out.parent.mkdir(parents=True, exist_ok=True)
    try:
        with open(p_out, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved {len(results)} candidate similarity scores to '{output_path}'.")
    except Exception as e:
        logger.error(f"Failed to write output artifact to '{output_path}': {e}")

    return results


if __name__ == "__main__":
    run_embedding_layer()
