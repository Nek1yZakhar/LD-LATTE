import json

def safe_str(s):
    if isinstance(s, str):
        return s.encode("unicode_escape").decode("ascii")
    return str(s)

print("=== candidates_discovered.json ===")
d = json.load(open("data/processed/candidates_discovered.json", encoding="utf-8"))
print(f"Count: {len(d)}")
for x in d:
    uname = x.get("username", "?")
    followers = x.get("followers_count", "?")
    posts = len(x.get("recent_posts", []))
    niche = x.get("niche", "?")
    lang = x.get("language", "?")
    bio = safe_str(x.get("biography", "")[:60])
    print(f"  @{uname} | followers={followers} | lang={lang} | niche={niche} | bio={bio}")

print("\n=== shortlist_final.json ===")
sf = json.load(open("data/processed/shortlist_final.json", encoding="utf-8"))
print(f"Count: {len(sf)}")
for x in sf:
    uname = x.get("username", "?")
    score = x.get("rerank_result", {}).get("composite_score", "?")
    print(f"  @{uname} | composite={score}")

print("\n=== barter_offers.json ===")
bo = json.load(open("output/barter_offers.json", encoding="utf-8"))
print(f"Count: {len(bo)}")
for x in bo:
    uname = x.get("username", "?")
    lang = x.get("language", "?")
    subj = safe_str(x.get("subject", ""))
    body_start = safe_str(x.get("body", "")[:100].replace("\n", " "))
    print(f"  @{uname} (lang={lang}):")
    print(f"    subj: {subj}")
    print(f"    body: {body_start}")
