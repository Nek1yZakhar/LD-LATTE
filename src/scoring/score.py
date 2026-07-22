# -*- coding: utf-8 -*-
"""
Feature Scoring & Composite Ranking Layer for LD Latte pipeline (TICKET-07).

Calculates deterministic rule-based feature scores (CandidateFeatureScore),
combines them with Qwen3 semantic similarity scores into CandidateRerankResult objects,
and exports the result to data/processed/candidates_scored.json and output/embedding_debug_report.md.
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import (
    IdealBloggerProfile,
    CandidateProfile,
    CandidateFeatureScore,
    CandidateRerankResult
)
from src.scoring.embed import run_embedding_layer, compute_embeddings_and_similarity

logger = logging.getLogger("scoring_score")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Default weights for feature score components (must sum to 1.0)
DEFAULT_FEATURE_WEIGHTS = {
    "niche": 0.30,
    "er": 0.25,
    "sponsorship": 0.20,
    "recency": 0.15,
    "language": 0.10
}

# Saturation hierarchy
SATURATION_RANK = {
    "low": 1,
    "medium": 2,
    "high": 3
}

# Related fashion/lifestyle niches for partial matching
RELATED_NICHES = {
    "fashion": {"style", "beauty", "lifestyle", "outfit"},
    "lifestyle": {"fashion", "travel", "beauty", "home"},
    "beauty": {"fashion", "lifestyle", "skincare"}
}


def calculate_niche_score(cand_niche: str, target_niches: List[str]) -> float:
    """Calculates niche match score in range [0.0, 1.0]."""
    if not target_niches:
        return 1.0
    cand_lower = cand_niche.strip().lower()
    targets_lower = [t.strip().lower() for t in target_niches]

    # Direct match
    if cand_lower in targets_lower:
        return 1.0

    # Partial / related niche match
    for t in targets_lower:
        related = RELATED_NICHES.get(t, set())
        if cand_lower in related:
            return 0.5

    return 0.0


def calculate_er_score(cand_er: float, min_er: float) -> float:
    """Calculates ER match score in range [0.0, 1.0]."""
    if min_er <= 0.0:
        return 1.0
    if cand_er <= 0.0:
        return 0.0
    ratio = cand_er / min_er
    return max(0.0, min(1.0, float(ratio)))


def calculate_recency_score(recency_days: int, max_recency_days: int) -> float:
    """Calculates activity recency match score in range [0.0, 1.0]."""
    if max_recency_days <= 0:
        return 1.0 if recency_days == 0 else 0.0
    if recency_days <= max_recency_days:
        return 1.0
    # Decaying score for inactive periods beyond threshold
    overdue = recency_days - max_recency_days
    decay = max(0.0, 1.0 - (overdue / float(max_recency_days)))
    return round(decay, 4)


def calculate_sponsorship_score(cand_sat: str, max_sat: str) -> float:
    """Calculates sponsorship saturation score in range [0.0, 1.0]."""
    cand_rank = SATURATION_RANK.get(cand_sat.strip().lower(), 2)
    max_rank = SATURATION_RANK.get(max_sat.strip().lower(), 1)

    if cand_rank <= max_rank:
        return 1.0
    elif cand_rank == max_rank + 1:
        return 0.5
    else:
        return 0.0


def calculate_language_score(cand_lang: str, allowed_languages: Optional[List[str]] = None) -> float:
    """Calculates language match score in range [0.0, 1.0]."""
    if allowed_languages is None:
        allowed_languages = ["ru", "en"]
    allowed_lower = [lang.strip().lower() for lang in allowed_languages]
    return 1.0 if cand_lang.strip().lower() in allowed_lower else 0.0


def compute_candidate_feature_score(
    cand: CandidateProfile,
    ideal: IdealBloggerProfile,
    weights: Optional[Dict[str, float]] = None
) -> CandidateFeatureScore:
    """Computes CandidateFeatureScore model for a candidate."""
    n_score = calculate_niche_score(cand.niche, ideal.target_niches)
    er_score = calculate_er_score(cand.engagement_rate, ideal.estimated_er_min)
    r_score = calculate_recency_score(cand.activity_recency, ideal.activity_recency_max_days)
    s_score = calculate_sponsorship_score(cand.sponsorship_saturation, ideal.sponsorship_saturation_max)
    l_score = calculate_language_score(cand.language)

    return CandidateFeatureScore(
        username=cand.username,
        niche_match_score=round(n_score, 4),
        er_match_score=round(er_score, 4),
        recency_match_score=round(r_score, 4),
        sponsorship_match_score=round(s_score, 4),
        language_match_score=round(l_score, 4)
    )


def compute_aggregated_features_score(
    feat_score: CandidateFeatureScore,
    weights: Optional[Dict[str, float]] = None
) -> float:
    """Computes weighted aggregate features_score (0.0 to 1.0)."""
    if weights is None:
        weights = DEFAULT_FEATURE_WEIGHTS

    score = (
        weights.get("niche", 0.30) * feat_score.niche_match_score +
        weights.get("er", 0.25) * feat_score.er_match_score +
        weights.get("sponsorship", 0.20) * feat_score.sponsorship_match_score +
        weights.get("recency", 0.15) * feat_score.recency_match_score +
        weights.get("language", 0.10) * feat_score.language_match_score
    )
    return round(max(0.0, min(1.0, score)), 4)


def generate_debug_report(results: List[CandidateRerankResult], report_path: str = "output/embedding_debug_report.md") -> None:
    """Generates a human-readable markdown report summarizing similarity & scoring results."""
    p_report = Path(report_path)
    p_report.parent.mkdir(parents=True, exist_ok=True)

    lines = [
        "# Embedding Similarity & Feature Scoring Report (TICKET-07)",
        "",
        f"Total Candidates Evaluated: **{len(results)}**",
        "",
        "## Scored Candidates Summary",
        "",
        "| Rank | Username | Semantic Sim (Qwen3) | Features Score | Composite Score | Notes |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |"
    ]

    sorted_results = sorted(results, key=lambda x: x.composite_score, reverse=True)
    for idx, r in enumerate(sorted_results, 1):
        lines.append(
            f"| {idx} | @{r.username} | {r.semantic_similarity:.4f} | {r.features_score:.4f} | {r.composite_score:.4f} | cross_encoder=0.0 (pending TICKET-08) |"
        )

    lines.extend([
        "",
        "## Feature Breakdown Details",
        ""
    ])

    for r in sorted_results:
        breakdown = r.similarity_breakdown
        lines.append(f"### Candidate @{r.username}")
        lines.append(f"- **Composite Score**: {r.composite_score:.4f}")
        lines.append(f"- **Semantic Similarity (Qwen3)**: {r.semantic_similarity:.4f}")
        lines.append(f"- **Features Score**: {r.features_score:.4f}")
        if "partial_scores" in breakdown:
            ps = breakdown["partial_scores"]
            lines.append(f"  - Niche Match: {ps.get('niche_match', 0.0)}")
            lines.append(f"  - ER Match: {ps.get('er_match', 0.0)}")
            lines.append(f"  - Recency Match: {ps.get('recency_match', 0.0)}")
            lines.append(f"  - Sponsorship Match: {ps.get('sponsorship_match', 0.0)}")
            lines.append(f"  - Language Match: {ps.get('language_match', 0.0)}")
        lines.append("")

    try:
        with open(p_report, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        logger.info(f"Generated human-readable debug report at '{report_path}'.")
    except Exception as e:
        logger.error(f"Failed to write debug report to '{report_path}': {e}")


def run_feature_scoring(
    ideal_path: str = "data/processed/ideal_portrait.json",
    candidates_path: str = "data/processed/candidates_discovered.json",
    similarity_path: str = "data/processed/candidate_embeddings_similarity.json",
    output_path: str = "data/processed/candidates_scored.json",
    alpha: float = 0.5
) -> List[CandidateRerankResult]:
    """
    Main entrypoint for feature scoring and composite result generation:
    1. Loads ideal portrait and discovered candidates.
    2. Loads or computes candidate embedding similarity scores.
    3. Calculates CandidateFeatureScore & composite_score.
    4. Exports CandidateRerankResult array to data/processed/candidates_scored.json.
    5. Exports output/embedding_debug_report.md.
    """
    logger.info("Starting Feature & Composite Scoring phase (TICKET-07)...")

    # 1. Load ideal portrait
    p_ideal = Path(ideal_path)
    if not p_ideal.exists():
        logger.error(f"Ideal portrait file not found at '{ideal_path}'.")
        return []
    try:
        with open(p_ideal, "r", encoding="utf-8") as f:
            ideal = IdealBloggerProfile.model_validate(json.load(f))
    except Exception as e:
        logger.error(f"Failed to load ideal portrait: {e}")
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

    if not candidates:
        logger.warning("No candidates found to score. Writing empty candidates_scored.json.")
        results: List[CandidateRerankResult] = []
        p_out = Path(output_path)
        p_out.parent.mkdir(parents=True, exist_ok=True)
        with open(p_out, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        generate_debug_report(results)
        return []

    # 3. Load or compute embedding similarities
    p_sim = Path(similarity_path)
    sim_map: Dict[str, float] = {}
    if p_sim.exists():
        try:
            with open(p_sim, "r", encoding="utf-8") as f:
                sim_data = json.load(f)
            for item in sim_data:
                sim_map[item["username"]] = float(item["semantic_similarity"])
            logger.info(f"Loaded {len(sim_map)} similarity scores from '{similarity_path}'.")
        except Exception as e:
            logger.warning(f"Could not read similarity artifact '{similarity_path}': {e}")

    # Fallback to computing embeddings if similarity artifact missing/incomplete
    missing_usernames = [c.username for c in candidates if c.username not in sim_map]
    if missing_usernames:
        logger.info(f"Computing embeddings for {len(missing_usernames)} candidates missing similarity artifact...")
        computed_sims = compute_embeddings_and_similarity(ideal, candidates)
        for item in computed_sims:
            sim_map[item["username"]] = item["semantic_similarity"]

    # 4. Compute feature scores and aggregate
    results: List[CandidateRerankResult] = []
    for cand in candidates:
        feat_score_model = compute_candidate_feature_score(cand, ideal)
        agg_feat_score = compute_aggregated_features_score(feat_score_model)
        sem_sim = sim_map.get(cand.username, 0.0)

        # Composite score formula: alpha * semantic_sim + (1 - alpha) * features_score
        comp_score = round(alpha * sem_sim + (1.0 - alpha) * agg_feat_score, 4)

        breakdown = {
            "partial_scores": {
                "niche_match": feat_score_model.niche_match_score,
                "er_match": feat_score_model.er_match_score,
                "recency_match": feat_score_model.recency_match_score,
                "sponsorship_match": feat_score_model.sponsorship_match_score,
                "language_match": feat_score_model.language_match_score
            },
            "feature_weights": DEFAULT_FEATURE_WEIGHTS,
            "alpha": alpha,
            "note": "cross_encoder_score set to 0.0 pending TICKET-08 reranking"
        }

        result_item = CandidateRerankResult(
            username=cand.username,
            semantic_similarity=sem_sim,
            features_score=agg_feat_score,
            cross_encoder_score=0.0,  # Explicitly 0.0 until TICKET-08
            composite_score=comp_score,
            similarity_breakdown=breakdown
        )
        results.append(result_item)

    # Sort results by composite_score descending
    results.sort(key=lambda x: x.composite_score, reverse=True)

    # 5. Export candidates_scored.json
    p_out = Path(output_path)
    p_out.parent.mkdir(parents=True, exist_ok=True)
    try:
        export_data = [res.model_dump() for res in results]
        with open(p_out, "w", encoding="utf-8") as f:
            json.dump(export_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved {len(results)} scored candidates to '{output_path}'.")
    except Exception as e:
        logger.error(f"Failed to export scored candidates to '{output_path}': {e}")

    # 6. Generate human-readable markdown report
    generate_debug_report(results)

    return results


if __name__ == "__main__":
    run_feature_scoring()
