# -*- coding: utf-8 -*-
import os
import json
from src.fetchers.enrich import run_enrichment
from src.shared.models import EnrichedSeedProfile

def test_enrichment_mock_mode(tmp_path):
    # Setup test input seed
    test_seed_path = tmp_path / "test_seed.json"
    test_output_path = tmp_path / "test_enriched.json"

    seed_data = [
        {"id": 1, "raw_url": "https://instagram.com/merklary_l", "username": "merklary_l", "is_valid": True, "error_message": None},
        {"id": 2, "raw_url": "https://instagram.com/curly.bloger", "username": "curly.bloger", "is_valid": True, "error_message": None},
        {"id": 3, "raw_url": "invalid_entry", "username": "", "is_valid": False, "error_message": "empty_value"}
    ]

    with open(test_seed_path, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)

    # Execute enrichment in mock mode
    results = run_enrichment(
        seed_path=str(test_seed_path),
        output_path=str(test_output_path),
        use_mock=True,
        force_refresh=True
    )

    # Verify results
    assert len(results) == 2, f"Expected 2 valid enriched profiles, got {len(results)}"
    assert os.path.exists(test_output_path), "Output JSON file was not created"

    # Verify profile structure
    profile_1 = results[0]
    assert isinstance(profile_1, EnrichedSeedProfile)
    assert profile_1.username == "merklary_l"
    assert profile_1.followers_count > 0
    assert len(profile_1.recent_posts) > 0
    assert profile_1.language in ["ru", "en"]
    assert profile_1.niche is not None
    assert profile_1.fetched_at is not None

    print("\n[SUCCESS] Smoke test test_enrichment_mock_mode passed successfully!")

if __name__ == "__main__":
    import sys
    from pathlib import Path
    temp_dir = Path("./data/processed/temp_test")
    temp_dir.mkdir(parents=True, exist_ok=True)
    try:
        test_enrichment_mock_mode(temp_dir)
    finally:
        import shutil
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
