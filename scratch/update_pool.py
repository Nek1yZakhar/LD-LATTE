# -*- coding: utf-8 -*-
import json

with open("data/processed/seed_enriched.json", "r", encoding="utf-8") as f:
    seed_data = json.load(f)

print(f"Loaded {len(seed_data)} profiles from seed_enriched.json")

with open("data/raw/candidates_pool.json", "w", encoding="utf-8") as f:
    json.dump(seed_data, f, indent=2, ensure_ascii=False)

print(f"SUCCESS: Updated data/raw/candidates_pool.json with all {len(seed_data)} profiles.")
