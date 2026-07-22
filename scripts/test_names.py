from src.outreach.name_extractor import extract_first_name
tests = [("", "janestetsiura"), ("", "llaurraiiam"), ("", "juliar_r"), ("", "daria_grogulenko"), ("", "dddinaaaaaa")]
for bio, uname in tests:
    r = extract_first_name(bio, uname)
    esc = r.greeting_name.encode("unicode_escape").decode()
    print(f"@{uname} -> {esc} [{r.source}, {r.confidence}]")
