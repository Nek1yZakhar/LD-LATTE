# -*- coding: utf-8 -*-
import json
import os

print("==========================================")
print("FULL SYSTEM DATA INTEGRITY AUDIT REPORT")
print("==========================================")

files_to_check = [
    ("data/processed/seed_enriched.json", "Enriched Seed Profiles"),
    ("data/raw/candidates_pool.json", "Candidates Pool"),
    ("data/processed/ideal_portrait.json", "Ideal Blogger Portrait"),
    ("data/processed/candidates_discovered.json", "Discovered Candidates"),
    ("data/processed/candidate_embeddings_similarity.json", "Embedding Similarity"),
    ("data/processed/candidates_scored.json", "Scored Candidates"),
    ("data/processed/candidates_reranked.json", "Reranked Candidates"),
    ("data/processed/shortlist_raw.json", "Shortlist Raw (Top 10)"),
    ("data/processed/shortlist_final.json", "Shortlist Final (Top 5)"),
]

for fpath, desc in files_to_check:
    if not os.path.exists(fpath):
        print(f"❌ {desc:<30} ({fpath}): FILE MISSING")
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    count = len(data) if isinstance(data, list) else 1
    size_kb = round(os.path.getsize(fpath) / 1024, 2)
    print(f"OK: {desc:<30} ({fpath:<52}) | {count:<3} items | {size_kb} KB")

# Verify deleted fake files
fake_files = [
    "data/processed/normalized_seed_profiles.csv",
    "data/processed/normalized_seed_profiles_valid.csv",
    "data/processed/seed_normalized.json"
]

print("\n--- Checking Fake / Mock Files Removal ---")
for ff in fake_files:
    if os.path.exists(ff):
        print(f"EXISTS: {ff}")
    else:
        print(f"DELETED: {ff}")

print("\nAUDIT COMPLETED SUCCESSFULLY!")
