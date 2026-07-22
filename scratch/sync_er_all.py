# -*- coding: utf-8 -*-
import json
from pathlib import Path
from src.scoring.score import run_feature_scoring
from src.scoring.rerank import run_reranking

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

# Update candidates_discovered.json
cands_path = Path("data/processed/candidates_discovered.json")
if cands_path.exists():
    with open(cands_path, "r", encoding="utf-8") as f:
        cands = json.load(f)
    for c in cands:
        u = c.get("username", "").lower()
        if u in er_map:
            c["engagement_rate"] = er_map[u]
    with open(cands_path, "w", encoding="utf-8") as f:
        json.dump(cands, f, ensure_ascii=False, indent=2)
    print("Updated candidates_discovered.json with real ER values.")

# Run scoring and reranking
run_feature_scoring()
run_reranking()

print("Re-scoring and reranking pipeline completed!")
