# LD LATTE — Evaluator & Reviewer Quickstart Navigator (START.md)

> **Назначение документа**: Быстрый проводник для проверяющего эксперта/команды LD Latte. Позволяет за 1–2 минуты понять структуру репозитория, запустить интерактивный веб-сайт локально или найти любой доказательный артефакт в один клик.

---

## 1. Обзор проекта и Концепция «ОДНА ссылка»

Проект **LD Latte Influencer Discovery Pipeline** представляет собой модульный конвейер обработки данных (**modular AI pipeline (agent-ready)**) для поиска, векторного анализа, скоринга и генерации персональных коммерческих предложений fashion-инфлюенсерам в Instagram.

Все результаты работы пайплайна сведены в единый публичный веб-интерфейс **Demo UI** (папка `app/`), поддерживающий принцип **One-Link Submission**:
* **Часть 1**: Инструмент поиска, промпты, воронка скоринга Qwen3 + BGE Reranker, VLM эстетический аудит Qwen2.5-VL и генерация писем.
* **Часть 2**: Промышленная архитектурная схема автоматизации, экономика $14.50 / 1k инфлюенсеров и матрица рисков.
* **Часть 3**: Портфолио автора, квалификация и единый навигатор по всем 13 файлам репозитория.

---

## 2. Карта репозитория (Repository Map)

| Направление | Расположение | Назначение и заслуживающие внимания файлы |
| :--- | :--- | :--- |
| **Публичный Demo UI** | [`app/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/app) | Vite + React + TypeScript + TailwindCSS одностраничная витрина |
| **Ядро пайплайна** | [`src/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/src) | Python-модули: `ingest`, `fetchers`, `analyzers`, `search`, `scoring`, `outreach` |
| **Системные промпты** | [`prompts/outreach_offer.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/prompts/outreach_offer.md) | Шаблоны генерации писем с anti-robotic QA контролем |
| **Proof-отчеты** | [`output/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/output) | `pipeline_audit_report.md`, `embedding_debug_report.md`, `seed_cleanup_report.md`, `barter_offers.json` |
| **Данные пайплайна** | [`data/processed/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/data/processed) | 100% реальные спарсенные JSON-артефакты 8 этапов |
| **Документация** | [`docs/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs) | `ARCHITECTURE.md`, `STATE.md`, `POLICY.md`, тикеты 10A..10F |
| **Тесты** | [`tests/`](file:///c:/Users/Admin/Desktop/LD%20LATTE/tests) | 39 unit- и интеграционных тестов Pytest |

---

## 3. Быстрый запуск (Quick Start za 1 минуту)

### Запуск Demo UI (Веб-витрина)
```bash
# 1. Перейдите в папку веб-приложения
cd app

# 2. Установите зависимости (при первом запуске)
npm install

# 3. Запустите локальный сервер разработки
npm run dev
```
Приложение откроется по адресу `http://localhost:5173`.

---

### Запуск Python-пайплайна и тестов

```bash
# 1. Активация виртуального окружения (PowerShell)
.venv\Scripts\Activate.ps1

# 2. Запуск полного набора юнит-тестов (39 PASS)
pytest tests/ -v

# 3. Перепрогон этапов пайплайна (CLI entrypoints)
python -m src.ingest.clean
python -m src.fetchers.enrich
python -m src.analyzers.portrait
python -m src.search.discover
python -m src.scoring.embed
python -m src.scoring.score
python -m src.scoring.rerank
python -m src.scoring.vlm_sanity
python -m src.outreach.generator
```

---

## 4. Реестр Ключевых Файлов и Доказательств (Evidence Inventory)

| Файл | Категория | Зачем открывать проверяющему |
| :--- | :--- | :--- |
| [`README.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/README.md) | Ядро | Главный инженерный навигатор по стеку, установке и архитектурным решениям. |
| [`docs/ARCHITECTURE.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/ARCHITECTURE.md) | Архитектура | Схема пайплайна, Pydantic-контракты, стратегия скрапинга и векторного поиска. |
| [`docs/STATE.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/STATE.md) | Статус | Полный бэклог тикетов, история выполнения и лог 100% реальных профилей. |
| [`docs/POLICY.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/POLICY.md) | Политика | Strict Zero-Mock Policy — запрет выдуманных/синтетических данных в коде. |
| [`docs/TICKET_10A_RESEARCH_AND_IA.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/TICKET_10A_RESEARCH_AND_IA.md) | Спецификация | Исследование информационной архитектуры, CJW и концепция витрины. |
| [`docs/TICKET_10B_DATA_LAYER.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/TICKET_10B_DATA_LAYER.md) | Спецификация | Устройство `app/src/data/`, связи JSON -> TypeScript и адаптеры UI. |
| [`docs/TICKET_10C_VISUAL_SYSTEM.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/TICKET_10C_VISUAL_SYSTEM.md) | Спецификация | Дизайн-система Warm Editorial Tech, типографика и токены стилей. |
| [`docs/TICKET_10D_APP_SHELL.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/TICKET_10D_APP_SHELL.md) | Спецификация | Конструкция AppShell, повествовательный каркас и адаптивность. |
| [`docs/TICKET_10E_EVIDENCE_VIEWS.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/TICKET_10E_EVIDENCE_VIEWS.md) | Спецификация | Интерактивные студии: инспектор промптов, BGE-логиты, Qwen2.5-VL аудит. |
| [`prompts/outreach_offer.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/prompts/outreach_offer.md) | Промпт / QA | Системный промпт генерации PR-писем с anti-robotic QA правилами. |
| [`output/pipeline_audit_report.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/output/pipeline_audit_report.md) | Proof-Отчет | Сводный аудит воронки: от 34 seed-запросов к 19 профилям и 5 топам. |
| [`output/embedding_debug_report.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/output/embedding_debug_report.md) | Proof-Отчет | Дебаг косинусных расстояний Qwen3-Embedding-0.6B векторов. |
| [`output/seed_cleanup_report.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/output/seed_cleanup_report.md) | Proof-Отчет | Разбор очистки CSV: 15 недоступных (HTTP 404/400) отсеяно, 19 живых верифицировано. |

---

## 5. Гарантии Качества и Статус Сборки

* **0% Synthetic Mock Data**: Все результаты построены на 100% реальных данных Instagram.
* **39/39 Pytest PASS**: Все юнит- и интеграционные тесты проходят без ошибок.
* **TypeScript & Vite Build PASS**: `npm run build` завершается с нулевым кодом ошибки.
