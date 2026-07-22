# -*- coding: utf-8 -*-
import json
import os
from datetime import datetime

# Load data
with open("data/processed/seed_enriched.json", "r", encoding="utf-8") as f:
    seed_data = json.load(f)

with open("data/processed/candidates_discovered.json", "r", encoding="utf-8") as f:
    disc_data = json.load(f)

with open("data/processed/candidates_reranked.json", "r", encoding="utf-8") as f:
    rerank_data = json.load(f)

with open("data/processed/shortlist_final.json", "r", encoding="utf-8") as f:
    final_data = json.load(f)

unavailable_profiles = [
    ("ID 1", "merklary_l", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 2", "curly.bloger", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 4", "nev_pollyy", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 5", "_crazy__unicorn__", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 6", "demoiselle._.rie", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 10", "yunglolaa", "HTTP 400", "Account deleted, renamed, or private on Instagram"),
    ("ID 11", "sha_obzor.wb", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 14", "lv_yana_lv", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 17", "miysta_fatt_", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 21", "habakher", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 24", "ri_vls", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 25", "__aparina", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 28", "rtini.a13", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
    ("ID 35", "ninooochka2.0", "HTTP 400", "Account deleted, renamed, or private on Instagram"),
    ("ID 36", "irinatitovaaa_", "HTTP 404", "Account deleted, renamed, or private on Instagram"),
]

report_md = f"""# 📋 Отчет об аудите отбора и фильтрации блогеров (Pipeline Audit Report)

**Дата проведения**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Единственный источник исходных данных**: `Блогеры - Лист1.csv` (34 профиля / ID до 38)
**Политика данных**: Strict Zero-Mock Policy ([`docs/POLICY.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/POLICY.md))

---

## 1. Сводка воронки отбора (Pipeline Funnel Summary)

```
[34 Ссылки в CSV] ──► [19 Живых спарсенных профилей] ──► [18 Кандидатов в Discovery] ──► [5 В финальном Шорт-листе]
                          │ (15 Недоступны: HTTP 404)           │ (1 Исключен: followers=0)
```

---

## 2. Исключенные блогеры и причины фильтрации (Excluded Bloggers Log)

### A. Недоступные аккаунты на серверах Instagram (15 Блогеров)
*Эти профили из оригинальной таблицы откликаются ошибкой 404/400 на серверах Instagram (аккаунты заблокированы, удалены или переименованы пользователями).*

| ID | Username | HTTP Код | Причина исключения |
| :--- | :--- | :--- | :--- |
"""

for row_id, uname, status, reason in unavailable_profiles:
    report_md += f"| **{row_id}** | `{uname}` | `{status}` | {reason} |\n"

report_md += """
### B. Профили, отфильтрованные алгоритмом Discovery (1 Блогер)
*Профиль был успешно спарсен, но не прошел детерминированный бизнес-фильтр.*

| Username | Подписчики | Причина отсева на этапе Discovery |
| :--- | :--- | :--- |
| `19.voron` | 0 | **`followers_count = 0`** (Приватные настройки / карточка профиля. Нулевая аудитория не подходит для бартерных интеграций). |

---

## 3. Обогащенные 19 реальных профилей (Enriched Real Profiles)

| # | Username | Подписчики | Постов | Ниша / Стиль | Статус в Discovery |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""

disc_usernames = {d['username'] for d in disc_data}

for idx, p in enumerate(seed_data, 1):
    uname = p['username']
    fol = p.get('followers_count', 0)
    posts = p.get('posts_count', 0)
    niche = p.get('niche', 'lifestyle')
    in_disc = "✅ Прошел в Discovery" if uname in disc_usernames else "❌ Отфильтрован (0 followers)"
    report_md += f"| {idx} | `{uname}` | {fol:,} | {posts} | {niche} | {in_disc} |\n"

report_md += """
---

## 4. Финальный шорт-лист кандидатов (Top 5 Shortlist)

Победители трехэтапного реранкинга (Qwen3 Embeddings + Composite Feature Scoring + BGE Reranker + VLM Visual Sanity Pass):

"""

for idx, item in enumerate(final_data, 1):
    uname = item['username']
    score = item['rerank_result']['composite_score']
    vlm_pass = "✅ PASSED" if item.get('vlm_sanity_passed') else "❌ FAILED"
    notes = item.get('vlm_aesthetic_notes', '')
    report_md += f"### {idx}. `{uname}` — Composite Score: **{score:.4f}** (VLM: {vlm_pass})\n"
    report_md += f"* **Визуальный вердикт VLM**: {notes}\n"
    report_md += f"* **Факты для персонализации**: {', '.join(item.get('grounding_facts', []))}\n\n"

with open("output/pipeline_audit_report.md", "w", encoding="utf-8") as f:
    f.write(report_md)

print("SUCCESSFULLY GENERATED output/pipeline_audit_report.md!")
