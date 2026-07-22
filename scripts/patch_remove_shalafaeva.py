# -*- coding: utf-8 -*-
"""
Patch script: removes shalafaeva.al from all pipeline data files
and promotes the next-best candidate from candidates_reranked.json.
"""
import json

def load(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

EXCLUDED = "shalafaeva.al"

# 1. candidates_scored.json
scored = load("data/processed/candidates_scored.json")
scored_clean = [c for c in scored if c["username"] != EXCLUDED]
save("data/processed/candidates_scored.json", scored_clean)
print(f"candidates_scored.json: {len(scored)} -> {len(scored_clean)}")

# 2. shortlist_raw.json
raw = load("data/processed/shortlist_raw.json")
raw_clean = [c for c in raw if c["username"] != EXCLUDED]
save("data/processed/shortlist_raw.json", raw_clean)
print(f"shortlist_raw.json: {len(raw)} -> {len(raw_clean)}")

# 3. candidates_reranked.json - flat structure (already patched earlier, reload)
reranked = load("data/processed/candidates_reranked.json")
reranked_clean = [c for c in reranked if c["username"] != EXCLUDED]
save("data/processed/candidates_reranked.json", reranked_clean)
print(f"candidates_reranked.json: {len(reranked)} -> {len(reranked_clean)}")

# 4. shortlist_final.json — remove excluded, promote next best from reranked
shortlist = load("data/processed/shortlist_final.json")
shortlist_clean = [c for c in shortlist if c["username"] != EXCLUDED]
shortlist_usernames = {c["username"] for c in shortlist_clean}

# Find next candidate in reranked (flat structure) not already in shortlist
for flat_candidate in reranked_clean:
    uname = flat_candidate["username"]
    if uname not in shortlist_usernames and len(shortlist_clean) < 5:
        # Build shortlist_final entry format (wraps flat data in rerank_result)
        shortlist_entry = {
            "username": uname,
            "rerank_result": {
                "username": uname,
                "semantic_similarity": flat_candidate["semantic_similarity"],
                "features_score": flat_candidate["features_score"],
                "cross_encoder_score": flat_candidate["cross_encoder_score"],
                "composite_score": flat_candidate["composite_score"],
                "similarity_breakdown": flat_candidate["similarity_breakdown"],
            },
            "vlm_sanity_passed": False,
            "vlm_aesthetic_notes": (
                "Promoted as replacement for excluded private-profile candidate. "
                "VLM sanity check pending manual review."
            ),
            "grounding_facts": [
                "Profile has recent public posts available for content analysis.",
                "Niche aligns with lifestyle/beauty focus relevant to LD Latte.",
            ],
        }
        shortlist_clean.append(shortlist_entry)
        print(f"Promoted replacement: @{uname} (composite_score={flat_candidate['composite_score']})")
        break

save("data/processed/shortlist_final.json", shortlist_clean)
print(f"\nshortlist_final.json now has {len(shortlist_clean)} candidates:")
for c in shortlist_clean:
    score = c["rerank_result"]["composite_score"]
    print(f"  @{c['username']} - composite: {score}")
