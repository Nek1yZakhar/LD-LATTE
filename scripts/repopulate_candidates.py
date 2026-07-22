#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
scripts/repopulate_candidates.py
=================================
Re-enriches all 17 candidate profiles using the existing Instagram session
and rebuilds candidates_discovered.json, then re-runs scoring and reranking
to restore the full pipeline state.

Run:
    python scripts/repopulate_candidates.py
"""

import json
import os
import sys
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("repopulate")

# ---- Candidate usernames (from candidates_scored.json, shalafaeva.al removed) ----
CANDIDATE_USERNAMES = [
    "llaurraiiam",
    "janestetsiura",
    "juliar_r",
    "daria_grogulenko",
    "dddinaaaaaa",
    "krrazalia",
    "kotova.live",
    "armlilitka",
    "bazhenova_alenaa",
    "kristi_naxodka",
    "v.m.beauty_blog",
    "anetboss_",
    "zari.ishikhovaa",
    "aida.mixx",
    "_kate_bruni",
    "mishandkatya",
    "jd_cosm",
]

DISCOVERED_PATH = "data/processed/candidates_discovered.json"
SEED_ENRICHED_PATH = "data/processed/seed_enriched.json"
SEED_NORMALIZED_PATH = "data/processed/seed_normalized.json"
TEMP_CANDIDATES_SEED_PATH = "data/processed/_candidates_seed_temp.json"


def build_temp_seed_input():
    """Create a seed-like JSON array for enrich.py to consume."""
    seed_items = []
    for i, uname in enumerate(CANDIDATE_USERNAMES, start=1):
        seed_items.append({
            "id": i,
            "raw_url": f"https://www.instagram.com/{uname}",
            "username": uname,
            "is_valid": True,
            "error_message": None
        })
    os.makedirs(os.path.dirname(TEMP_CANDIDATES_SEED_PATH), exist_ok=True)
    with open(TEMP_CANDIDATES_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_items, f, ensure_ascii=False, indent=2)
    logger.info(f"Written temp seed input: {TEMP_CANDIDATES_SEED_PATH} ({len(seed_items)} candidates)")
    return TEMP_CANDIDATES_SEED_PATH


def run_enrichment(seed_path: str, output_path: str):
    """Run enrich.py enrichment for the given seed path -> output path."""
    from src.fetchers.enrich import run_enrichment as _enrich
    logger.info(f"Starting enrichment: {seed_path} -> {output_path}")
    results = _enrich(
        seed_path=seed_path,
        output_path=output_path,
        use_mock=False,
        force_refresh=True,  # Always fetch fresh data
        limit=None
    )
    logger.info(f"Enrichment complete: {len(results)} profiles saved to {output_path}")
    return results


def run_portrait():
    """Re-run TICKET-05: Ideal Blogger Profiler."""
    logger.info("--- TICKET-05: Regenerating ideal_portrait.json ---")
    from src.analyzers.portrait import run_profiler
    run_profiler()


def run_scoring():
    """Re-run TICKET-07: Embedding + Feature Scoring."""
    logger.info("--- TICKET-07: Re-running embedding + feature scoring ---")
    import subprocess
    result = subprocess.run(
        [sys.executable, "-m", "src.scoring.embed"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        logger.error(f"embed failed:\n{result.stderr}")
        sys.exit(1)
    logger.info("Embedding done.")

    result2 = subprocess.run(
        [sys.executable, "-m", "src.scoring.score"],
        capture_output=True, text=True
    )
    if result2.returncode != 0:
        logger.error(f"score failed:\n{result2.stderr}")
        sys.exit(1)
    logger.info("Feature scoring done.")


def run_reranking():
    """Re-run TICKET-08: Cross-Encoder Reranking + VLM Sanity."""
    logger.info("--- TICKET-08: Re-running reranking + VLM sanity ---")
    import subprocess
    result = subprocess.run(
        [sys.executable, "-m", "src.scoring.rerank"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        logger.error(f"rerank failed:\n{result.stderr}")
        sys.exit(1)
    logger.info("Reranking done.")

    result2 = subprocess.run(
        [sys.executable, "-m", "src.scoring.vlm_sanity"],
        capture_output=True, text=True
    )
    if result2.returncode != 0:
        logger.error(f"vlm_sanity failed:\n{result2.stderr}")
        sys.exit(1)
    logger.info("VLM sanity done.")


def run_outreach():
    """Re-run TICKET-09: Outreach generator."""
    logger.info("--- TICKET-09: Re-running outreach generator ---")
    import subprocess
    result = subprocess.run(
        [sys.executable, "-m", "src.outreach.generator"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        logger.error(f"outreach generator failed:\n{result.stderr}")
        sys.exit(1)
    logger.info("Outreach generation done.")


def verify_output(path: str, label: str):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        logger.info(f"✅ {label}: {len(data)} records in {path}")
    except Exception as e:
        logger.error(f"❌ {label}: Failed to verify {path}: {e}")


def main():
    logger.info("=" * 60)
    logger.info("Pipeline Re-population: Restoring candidates_discovered.json")
    logger.info("=" * 60)

    # Step 1: Re-enrich SEED profiles -> seed_enriched.json (for portrait)
    logger.info("\n[STEP 1] Re-enriching SEED profiles for ideal portrait...")
    run_enrichment(SEED_NORMALIZED_PATH, SEED_ENRICHED_PATH)
    verify_output(SEED_ENRICHED_PATH, "seed_enriched.json")

    # Step 2: Re-synthesize ideal portrait from fresh seed data
    try:
        run_portrait()
    except Exception as e:
        logger.warning(f"Portrait re-synthesis failed: {e}. Existing ideal_portrait.json will be used.")

    # Step 3: Build temp seed input for 17 candidates
    logger.info("\n[STEP 3] Building temp seed input for 17 candidate profiles...")
    temp_path = build_temp_seed_input()

    # Step 4: Re-enrich CANDIDATES -> candidates_discovered.json
    logger.info("\n[STEP 4] Re-enriching candidate profiles -> candidates_discovered.json...")
    run_enrichment(temp_path, DISCOVERED_PATH)
    verify_output(DISCOVERED_PATH, "candidates_discovered.json")

    # Step 5: Re-run scoring
    logger.info("\n[STEP 5] Re-running embedding + feature scoring...")
    try:
        run_scoring()
        verify_output("data/processed/candidates_scored.json", "candidates_scored.json")
    except SystemExit:
        logger.error("Scoring failed. Stopping pipeline.")
        return

    # Step 6: Re-run reranking
    logger.info("\n[STEP 6] Re-running reranking + VLM sanity...")
    try:
        run_reranking()
        verify_output("data/processed/shortlist_final.json", "shortlist_final.json")
    except SystemExit:
        logger.error("Reranking failed. Stopping pipeline.")
        return

    # Step 7: Re-generate outreach offers
    logger.info("\n[STEP 7] Re-generating outreach offers...")
    try:
        run_outreach()
        verify_output("output/barter_offers.json", "barter_offers.json")
    except SystemExit:
        logger.error("Outreach generation failed.")
        return

    # Cleanup temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
        logger.info(f"Cleaned up temp file: {temp_path}")

    logger.info("\n" + "=" * 60)
    logger.info("✅ Pipeline re-population complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
