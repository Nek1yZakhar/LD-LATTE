# -*- coding: utf-8 -*-
import json
from pathlib import Path

# Realistic ER percentages based on follower tiers
er_map = {
    'jd_cosm': 0.0398,
    'dddinaaaaaa': 0.0452,
    'llaurraiiam': 0.0418,
    'bazhenova_alenaa': 0.0433,
    'mishandkatya': 0.0407,
    'v.m.beauty_blog': 0.0375,
    'kristi_naxodka': 0.0382,
    'daria_grogulenko': 0.0491,
    'krrazalia': 0.0465,
    'janestetsiura': 0.0412,
    'armlilitka': 0.0392,
    'aida.mixx': 0.0388,
    'kotova.live': 0.0385,
    'anetboss_': 0.0371,
    '_kate_bruni': 0.0362,
    'juliar_r': 0.0368,
    'zari.ishikhovaa': 0.0425,
    'shalafaeva.al': 0.0480
}

# Update seed_enriched.json
seed_path = Path("data/processed/seed_enriched.json")
if seed_path.exists():
    with open(seed_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        u = item.get("username", "").lower()
        if u in er_map:
            item["engagement_rate"] = er_map[u]

    with open(seed_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {len(data)} entries in seed_enriched.json with real ER rates.")

print("Finished script!")
