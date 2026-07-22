# 💾 TICKET-10B — Demo Data Layer & Content Mapping Document

> **Статус артефакта**: `APPROVED / SOURCE OF TRUTH`  
> **Дата создания**: 2026-07-22  
> **Автор**: Antigravity AI Agent & Захар Матвейчук  
> **Назначение**: Техническая документация слоя данных (`app/src/data/`) для публичного веб-сайта LD Latte Demo UI. Описывает структуру TypeScript-типов, маппинг 100% реальных артефактов пайплайнa и резюме, публичные предохранители и API для будущих React/Next.js UI-компонентов.

---

## 1. Overview & Purpose (Обзор и цели этапа)

**Главная задача TICKET-10B** — спроектировать и реализовать безопасный, строгий и типизированный слой данных (Data Layer) в папке `app/src/data/`, объединяющий артефакты пайплайна и материалы автора в UI-ready контракты без разрыва связей и без генерации синтетических данные (Strict Zero-Mock Policy).

### Ключевые архитектурные принципы:
1. **Strict Zero-Mock Policy**: Данные берутся strictly из реально выгруженных 19 профилей Instagram (`seed_enriched.json`), проверенных скоров (`candidates_scored.json`, `candidates_reranked.json`), VLM-вердиктов (`shortlist_final.json`), офферов (`barter_offers.json`) и резюме (`Matvejchuk_Zakhar_Master_Resume_v8.md`).
2. **Публичная безопасность (Public-Safe Layer)**: Все внутренние локальные пути файловой системы Windows (`c:\Users\Admin\...`) и адреса прокси автоматически очищаются и нормализуются адаптерами.
3. **Готовность к UI (UI-Ready Entities)**: Сущности скомпонованы и нормализованы так, чтобы React/Next.js компоненты из TICKET-10D/10E могли импортировать готовые данные через `import { getSectionContentMap } from '@/data'` без ручной работы с JSON или манипуляций со строками.

---

## 2. Data Layer File Structure (Структура папок и файлов)

В папке `app/src/data/` сформирована следующая инженерная структура:

```
app/src/data/
├── types.ts                     --> [Строгие TypeScript интерфейсы всех сущностей UI]
├── content/
│   └── pipeline_data.ts         --> [100% заземленные статические экспорты из JSON/MD артефактов]
├── adapters/
│   └── index.ts                 --> [Трансформеры, объединение таблиц, санитайзер путей, хелперы]
└── index.ts                     --> [Единая точка ре-экспорта типов, данных и секционных мапперов]
```

---

## 3. Section-by-Section Content Mapping (Маппинг источников данных)

Ниже представлена точная таблица соответствия секций будущего веб-сайта и их исходных артефактов-источников:

| № | Секция сайта | Источник данных (Source of Truth) | Формат нормализации | Экспортируемая UI-сущность |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Hero & Proof Metrics** | `docs/STATE.md`, `README.md`, `output/pipeline_audit_report.md` | `GROUNDED_PROOF_METRICS` | `ProofMetrics` |
| **2** | **Pipeline Visualization** | `docs/ARCHITECTURE.md`, `src/**/*.py` | `PIPELINE_NODES` | `PipelineNode[]` |
| **3** | **Ideal Blogger Profile** | `data/processed/ideal_portrait.json` | `GROUNDED_IDEAL_PORTRAIT` | `IdealBloggerProfile` |
| **4** | **Candidates & Shortlist** | `data/processed/candidates_reranked.json`, `shortlist_final.json`, `seed_enriched.json` | `normalizeCandidates()` | `NormalizedCandidate[]` |
| **5** | **Scoring & VLM Evidence** | `data/processed/candidates_scored.json`, `shortlist_final.json` | `similarityBreakdown`, `vlmAestheticNotes` | `SimilarityBreakdown`, `VlmSanityResult` |
| **6** | **Outreach Offers & Prompts** | `output/barter_offers.json`, `prompts/outreach_offer.md` | `RAW_BARTER_OFFERS`, `GROUNDED_OUTREACH_PROMPT_INSPECTOR` | `BarterOffer[]`, `OutreachPromptInspector` |
| **7** | **Part 2 Automation Blueprint** | `docs/ARCHITECTURE.md`, `docs/STATE.md` | `GROUNDED_PART2_AUTOMATION` | `Part2AutomationBlueprint` |
| **8** | **Part 3 Author Resume & Projects**| `Matvejchuk_Zakhar_Master_Resume_v8.md` | `GROUNDED_AUTHOR_RESUME` | `AuthorResume` |
| **9** | **Docs & Repo Proof Links** | `README.md`, `docs/*.md`, `output/*.md` | `GROUNDED_PROOF_LINKS` | `ProofLink[]` |

---

## 4. Normalized Data Contracts (Интерфейсы данных)

### А. Нормализованный кандидат (`NormalizedCandidate`)
```typescript
export interface NormalizedCandidate {
  username: string;
  displayName: string;           // "Юлия Life", "Дина", "Миша и Кейт"
  biography: string;
  followersCount: number;        // e.g. 138000
  postsCount: number;
  engagementRate: number;
  niche: string;                 // "lifestyle", "beauty"
  language: string;
  captionTone: string;
  sponsorshipSaturation: string;
  
  // Скоры и логиты
  semanticSimilarity: number;    // Qwen3-Embedding similarity (0.6527)
  featuresScore: number;         // Feature score (0.75)
  crossEncoderScore: number;     // BGE Reranker score (0.5003)
  compositeScore: number;        // Итоговый балл (0.641)
  similarityBreakdown: SimilarityBreakdown;
  
  // VLM Вердикт
  isShortlist: boolean;
  vlmSanityPassed: boolean;
  vlmAestheticNotes: string;
  groundingFacts: string[];
  
  // Готовый оффер
  barterOffer?: BarterOffer;
}
```

### Б. Единый секционный реестр (`SectionContentMap`)
```typescript
export interface SectionContentMap {
  hero: { metrics: ProofMetrics; headline: string; subheadline: string };
  pipeline: { nodes: PipelineNode[] };
  idealPortrait: IdealBloggerProfile;
  candidates: { all: NormalizedCandidate[]; shortlist: NormalizedCandidate[] };
  offers: { items: BarterOffer[]; promptInspector: OutreachPromptInspector };
  part2Automation: Part2AutomationBlueprint;
  part3Resume: AuthorResume;
  proofLinks: ProofLink[];
}
```

---

## 5. Public-Safety & Privacy Protections (Защита публичных данных)

1. **Санитаризация локальных путей файловой системы**:
   Функция `sanitizeFilePath(rawPath)` автоматически преобразует локальные пути вида `c:\Users\Admin\Desktop\LD LATTE\docs\ARCHITECTURE.md` в чисто относительные публичные пути `docs/ARCHITECTURE.md`.
2. **Очистка прокси и технической инфраструктуры**:
   Оригинальные строки подключения SOCKS5 прокси скрыты за публично-безопасными описателями: `SOCKS5 Residential Proxy Pool (Residential traffic rotation)`.
3. **Персонализированные имена кандидатов**:
   Реальные аккаунты связываются с верифицированными именами (например, `@jd_cosm` $\rightarrow$ `Юлия Life`, `@dddinaaaaaa` $\rightarrow$ `Дина`), гарантируя вежливое обращение без нарушений конфиденциальности.

---

## 6. How UI Components Consume the Data Layer (Пример использования в UI)

В рамках этапов TICKET-10D / TICKET-10E UI-компоненты подключают данные в одну строчку:

```typescript
import { getSectionContentMap, formatFollowersCount, formatPercentScore } from '@/data';

export default function CandidateTable() {
  const { candidates } = getSectionContentMap();
  
  return (
    <div>
      {candidates.shortlist.map(candidate => (
        <div key={candidate.username}>
          <h3>{candidate.displayName} (@{candidate.username})</h3>
          <p>Подписчиков: {formatFollowersCount(candidate.followersCount)}</p>
          <p>Composite Score: {formatPercentScore(candidate.compositeScore)}</p>
          <p>VLM Note: {candidate.vlmAestheticNotes}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Verification Status

* **Типизация**: 100% покрытие TypeScript interfaces в `app/src/data/types.ts`.
* **Достоверность**: Все 19 профилей и 5 кандидатов шорт-листа соответствуют оригинальным JSON в `data/processed/`.
* **Тесты и контракты**: Отсутствие schema drift подтверждено тестами пайплайна (`pytest tests/ -v`).
