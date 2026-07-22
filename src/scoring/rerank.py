# -*- coding: utf-8 -*-
"""
Cross-Encoder Reranking Layer for LD Latte pipeline (TICKET-08).

Applies BAAI/bge-reranker-v2-m3 cross-encoder model to re-score candidates from
data/processed/candidates_scored.json against ideal portrait query text.

Normalizes cross-encoder logits via Sigmoid into [0.0, 1.0] and recomputes composite_score.
Exports results to data/processed/candidates_reranked.json and top-N to data/processed/shortlist_raw.json.
"""

import os
import json
import math
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import IdealBloggerProfile, CandidateProfile, CandidateRerankResult
from src.shared.reranker import LocalReranker

logger = logging.getLogger("scoring_rerank")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def sigmoid_normalize(score: float) -> float:
    """
    Applies Sigmoid transformation to BGE Cross-Encoder score (logit)
    to deterministically bound it within range [0.0, 1.0].
    Formula: 1.0 / (1.0 + exp(-score))
    """
    try:
        val = float(score)
        norm = 1.0 / (1.0 + math.exp(-val))
        return round(max(0.0, min(1.0, norm)), 4)
    except Exception as e:
        logger.warning(f"Error normalizing score {score}: {e}")
        return 0.5


def build_ideal_query_text(ideal: IdealBloggerProfile) -> str:
    """
    Formats query text string from IdealBloggerProfile for cross-encoder reranking.
    """
    niches_str = ", ".join(ideal.target_niches) if ideal.target_niches else "fashion, lifestyle"
    themes_str = ", ".join(ideal.key_themes) if ideal.key_themes else "capsule wardrobe, slow fashion"
    
    query = (
        f"Ideal influencer portrait for fashion brand LD Latte. "
        f"Target niches: {niches_str}. "
        f"Key themes: {themes_str}. "
        f"Preferred tone of voice: {ideal.preferred_tone_of_voice}. "
        f"Rationale: {ideal.rationale}"
    )
    return query.strip()


def build_candidate_document_text(
    cand_result: CandidateRerankResult,
    cand_profile: Optional[CandidateProfile] = None
) -> str:
    """
    Formats document text string for a candidate for cross-encoder comparison.
    Uses CandidateProfile full metadata if available, otherwise fallback to CandidateRerankResult.
    """
    if cand_profile is not None:
        posts_text = " ".join([p.caption for p in cand_profile.recent_posts if p.caption])
        doc = (
            f"Blogger username: @{cand_profile.username}. "
            f"Niche: {cand_profile.niche}. "
            f"Biography: {cand_profile.biography}. "
            f"Tone: {cand_profile.caption_tone}. "
            f"Product talk style: {cand_profile.product_talk_style}. "
            f"Sponsorship saturation: {cand_profile.sponsorship_saturation}. "
            f"Recent posts: {posts_text}"
        )
    else:
        doc = (
            f"Blogger username: @{cand_result.username}. "
            f"Semantic similarity: {cand_result.semantic_similarity}. "
            f"Features score: {cand_result.features_score}."
        )
    return doc.strip()


def run_reranking(
    scored_path: str = "data/processed/candidates_scored.json",
    ideal_path: str = "data/processed/ideal_portrait.json",
    discovered_path: str = "data/processed/candidates_discovered.json",
    output_reranked_path: str = "data/processed/candidates_reranked.json",
    output_shortlist_raw_path: str = "data/processed/shortlist_raw.json",
    top_n: int = 10,
    w_sem: float = 0.35,
    w_feat: float = 0.35,
    w_cross: float = 0.30,
    use_mock: bool = False
) -> List[CandidateRerankResult]:
    """
    Main entrypoint for Cross-Encoder Reranking layer (TICKET-08):
    1. Loads candidates_scored.json and ideal_portrait.json.
    2. Loads discovered candidate profiles for rich document texts.
    3. Computes raw BGE Cross-Encoder score for each candidate.
    4. Normalizes cross_encoder_score via Sigmoid into [0.0, 1.0].
    5. Recomputes composite_score = w_sem * semantic_similarity + w_feat * features_score + w_cross * cross_encoder_score.
    6. Exports candidates_reranked.json and top-N shortlist_raw.json.
    """
    logger.info("Starting Cross-Encoder Reranking phase (TICKET-08)...")

    # 1. Load ideal portrait
    p_ideal = Path(ideal_path)
    if not p_ideal.exists():
        logger.error(f"Ideal portrait not found at '{ideal_path}'. Aborting reranking.")
        return []
    try:
        with open(p_ideal, "r", encoding="utf-8") as f:
            ideal = IdealBloggerProfile.model_validate(json.load(f))
    except Exception as e:
        logger.error(f"Failed to load ideal portrait from '{ideal_path}': {e}")
        return []

    # 2. Load candidates_scored
    p_scored = Path(scored_path)
    if not p_scored.exists():
        logger.warning(f"Scored candidates file not found at '{scored_path}'. Writing empty outputs.")
        candidates_scored = []
    else:
        try:
            with open(p_scored, "r", encoding="utf-8") as f:
                raw_scored = json.load(f)
            candidates_scored = [CandidateRerankResult.model_validate(c) for c in raw_scored]
        except Exception as e:
            logger.error(f"Failed to load scored candidates from '{scored_path}': {e}")
            candidates_scored = []

    if not candidates_scored:
        logger.warning("No candidates to rerank. Writing empty outputs.")
        for p in [output_reranked_path, output_shortlist_raw_path]:
            out_p = Path(p)
            out_p.parent.mkdir(parents=True, exist_ok=True)
            with open(out_p, "w", encoding="utf-8") as f:
                json.dump([], f, ensure_ascii=False, indent=2)
        return []

    # 3. Load discovered candidate profiles for detailed document text formatting
    p_disc = Path(discovered_path)
    profiles_map: Dict[str, CandidateProfile] = {}
    if p_disc.exists():
        try:
            with open(p_disc, "r", encoding="utf-8") as f:
                raw_disc = json.load(f)
            for item in raw_disc:
                cp = CandidateProfile.model_validate(item)
                profiles_map[cp.username] = cp
        except Exception as e:
            logger.warning(f"Could not load discovered profiles from '{discovered_path}': {e}")

    # Build query text and document text array
    query_text = build_ideal_query_text(ideal)
    documents: List[str] = []
    for cand in candidates_scored:
        prof = profiles_map.get(cand.username)
        doc_text = build_candidate_document_text(cand, prof)
        documents.append(doc_text)

    # 4. Compute cross encoder scores
    if use_mock:
        logger.info("Using mock mode for cross-encoder reranking.")
        raw_scores = [0.5 + (0.1 * idx) for idx in range(len(candidates_scored))]
    else:
        try:
            reranker = LocalReranker()
            raw_scores = reranker.compute_scores(query_text, documents)
        except Exception as e:
            logger.warning(f"Failed to execute LocalReranker model: {e}. Falling back to mock scores.")
            raw_scores = [0.5 for _ in candidates_scored]

    # 5. Normalize scores and recompute composite_score
    reranked_results: List[CandidateRerankResult] = []
    for cand, raw_score in zip(candidates_scored, raw_scores):
        norm_score = sigmoid_normalize(raw_score)
        
        # Weighted composite score formula
        comp_score = round(
            w_sem * cand.semantic_similarity +
            w_feat * cand.features_score +
            w_cross * norm_score,
            4
        )

        updated_breakdown = dict(cand.similarity_breakdown) if cand.similarity_breakdown else {}
        updated_breakdown["raw_cross_encoder_score"] = float(raw_score)
        updated_breakdown["normalized_cross_encoder_score"] = norm_score
        updated_breakdown["rerank_weights"] = {"semantic": w_sem, "features": w_feat, "cross_encoder": w_cross}

        reranked_cand = CandidateRerankResult(
            username=cand.username,
            semantic_similarity=cand.semantic_similarity,
            features_score=cand.features_score,
            cross_encoder_score=norm_score,
            composite_score=comp_score,
            similarity_breakdown=updated_breakdown
        )
        reranked_results.append(reranked_cand)

    # Sort descending by composite_score
    reranked_results.sort(key=lambda x: x.composite_score, reverse=True)

    # 6. Save outputs
    # Save candidates_reranked.json
    p_out_reranked = Path(output_reranked_path)
    p_out_reranked.parent.mkdir(parents=True, exist_ok=True)
    with open(p_out_reranked, "w", encoding="utf-8") as f:
        json.dump([res.model_dump() for res in reranked_results], f, ensure_ascii=False, indent=2)
    logger.info(f"Saved {len(reranked_results)} reranked candidates to '{output_reranked_path}'.")

    # Save top-N shortlist_raw.json
    shortlist_raw = reranked_results[:top_n]
    p_out_shortlist = Path(output_shortlist_raw_path)
    p_out_shortlist.parent.mkdir(parents=True, exist_ok=True)
    with open(p_out_shortlist, "w", encoding="utf-8") as f:
        json.dump([res.model_dump() for res in shortlist_raw], f, ensure_ascii=False, indent=2)
    logger.info(f"Saved top {len(shortlist_raw)} candidates to '{output_shortlist_raw_path}'.")

    return reranked_results


if __name__ == "__main__":
    run_reranking()
