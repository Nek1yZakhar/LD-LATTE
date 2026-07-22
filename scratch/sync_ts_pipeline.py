# -*- coding: utf-8 -*-
import json
from pathlib import Path

# Load candidates_reranked.json
reranked_path = Path("data/processed/candidates_reranked.json")
with open(reranked_path, "r", encoding="utf-8") as f:
    reranked_data = json.load(f)

# Build TS export string
ts_entries = []
for c in reranked_data:
    ps = c["similarity_breakdown"]["partial_scores"]
    fw = c["similarity_breakdown"]["feature_weights"]
    rw = c["similarity_breakdown"]["rerank_weights"]
    raw = c["similarity_breakdown"]["raw_cross_encoder_score"]
    norm = c["similarity_breakdown"]["normalized_cross_encoder_score"]
    
    entry = f"""  {{
    username: '{c['username']}',
    semantic_similarity: {c['semantic_similarity']},
    features_score: {c['features_score']},
    cross_encoder_score: {c['cross_encoder_score']},
    composite_score: {c['composite_score']},
    similarity_breakdown: {{
      partial_scores: {{ niche_match: {ps['niche_match']}, er_match: {ps['er_match']}, recency_match: {ps['recency_match']}, sponsorship_match: {ps['sponsorship_match']}, language_match: {ps['language_match']} }},
      feature_weights: {{ niche: {fw['niche']}, er: {fw['er']}, sponsorship: {fw['sponsorship']}, recency: {fw['recency']}, language: {fw['language']} }},
      alpha: 0.5,
      raw_cross_encoder_score: {raw},
      normalized_cross_encoder_score: {norm},
      rerank_weights: {{ semantic: {rw['semantic']}, features: {rw['features']}, cross_encoder: {rw['cross_encoder']} }}
    }}
  }}"""
    ts_entries.append(entry)

ts_code = "export const RAW_CANDIDATES_RERANKED: CandidateRerankScore[] = [\n" + ",\n".join(ts_entries) + "\n];"

# Replace RAW_CANDIDATES_RERANKED block in app/src/data/content/pipeline_data.ts
ts_file = Path("app/src/data/content/pipeline_data.ts")
content = ts_file.read_text(encoding="utf-8")

start_marker = "export const RAW_CANDIDATES_RERANKED: CandidateRerankScore[] = ["
end_marker = "export const RAW_SHORTLIST_FINAL: ShortlistFinalEntry[] = ["

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + ts_code + "\n\n// ==========================================\n// 6. SHORTLIST FINAL (shortlist_final.json)\n" + content[end_idx:]
    ts_file.write_text(new_content, encoding="utf-8")
    print("Successfully updated RAW_CANDIDATES_RERANKED in app/src/data/content/pipeline_data.ts!")
else:
    print(f"Error: Markers not found. start_idx={start_idx}, end_idx={end_idx}")
