# Состояние проекта (STATE.md)

В данном документе фиксируется текущий статус разработки, бэклог задач, ограничения и принятые стратегические решения.

---

## 1. Текущий статус проекта

* **Статус**: Выполнены этапы TICKET-01..TICKET-09 (очистка seed, согласованию документов, фрейминг стека, изоляция окружения, Instagram enrichment, идеальный портрет, Candidate Discovery, Embedding Similarity & Feature Scoring, Reranking & VLM Sanity Pass, Outreach Generator & QA). На очереди — сборка интерактивного сайта (TICKET-10).
* **Выполненные этапы**:
  * **TICKET-01**: Очистка Seed-данных полностью завершена. Разработан и запущен скрипт `src/ingest/clean.py`, сформирован очищенный файл `data/processed/normalized_seed_profiles_valid.csv` и подготовлен отчет `output/seed_cleanup_report.md`.
  * **TICKET-02**: Обновлены и заморожены базовые документы (`README.md`, `docs/ARCHITECTURE.md`, `docs/STATE.md`, `docs/AGENT_RULES.md`).
  * **TICKET-03**: Проведена фиксация стека и проверка клиентских модулей в `src/shared/`.
  * **TICKET-03A**: Выполнена изоляция окружения в `.venv`.
  * **TICKET-04**: Разработан Instagram Enrichment Layer (`src/fetchers/enrich.py`, `src/shared/models.py`, `tests/test_enrich_mock.py`). Данные профилей обогащены метриками и фактуальной классификацией LLM, результатом сформирован `data/processed/seed_enriched.json`.
  * **TICKET-05**: Создан Ideal Blogger Profiler (`src/analyzers/portrait.py`), синтезирующий идеальный портрет инфлюенсера в `data/processed/ideal_portrait.json`.
  * **TICKET-06**: Реализован модуль поиска и фильтрации кандидатов Candidate Discovery (`src/search/discover.py`), нормализующий raw-данные и применяющий rule-based фильтры с экспортом в `data/processed/candidates_discovered.json`.
  * **TICKET-07**: Реализован слой Embedding Similarity & Feature Scoring в `src/scoring/embed.py` и `src/scoring/score.py` (CLI entrypoints: `python -m src.scoring.embed` и `python -m src.scoring.score`). Расчитаны косинусное сходство векторов Qwen3-Embedding-0.6B и детерминированные фичевые оценки. Сформированы артефакты `data/processed/candidates_scored.json` и `output/embedding_debug_report.md`.
  * **TICKET-08**: Реализован слой Cross-Encoder Reranking (`src/scoring/rerank.py`, CLI: `python -m src.scoring.rerank`) с моделью `BAAI/bge-reranker-v2-m3` и сигмоидной нормализацией оценок, создающий `data/processed/candidates_reranked.json` и `data/processed/shortlist_raw.json`. Реализован VLM Visual Sanity Pass (`src/scoring/vlm_sanity.py`, CLI: `python -m src.scoring.vlm_sanity`) с поддержкой mock sandbox mode, создающий финальный шорт-лист `data/processed/shortlist_final.json` по Pydantic-контракту `FinalShortlistEntry`. Написаны тесты `tests/test_rerank_vlm.py`.
  * **TICKET-09**: Реализован Outreach Generator & QA (`src/outreach/generator.py`, CLI: `python -m src.outreach.generator`). Добавлена модель `OutreachDraft` в `src/shared/models.py`, промпт-шаблон `prompts/outreach_offer.md` и тесты `tests/test_outreach_generator.py`. Проведена оптимизация под DeepSeek-V4 / OpenRouter (с фолбеком на Groq Llama-3.3-70B), ликвидирован канцелярский/роботизированный жаргон, введена проверка anti-robotic QA и заземление в 100% реальных фактах с экспортом в `output/barter_offers.json`.

---

## 2. Утвержденные стратегические решения (Approved Decisions)


1. **Позиционирование**: Решение проектируется строго как **modular AI pipeline (agent-ready)** (модульный конвейер обработки данных), а не монолитный «AI-агент».
2. **Основной канал**: Instagram-first. Поддержка других платформ (Telegram, YouTube) перенесена во future extensions.
3. **Метод скрапинга**: Исключительно **self-operated скрапинг**.
   * Иерархия выполнения (execution order):
     1. *Primary*: Instaloader (автономный сбор метаданных).
     2. *Fallback*: Playwright с авторизованной сессией технического аккаунта (sacrificial account). Допускается ручное прохождение капч при необходимости.
     3. *Emergency Only*: Apify (внешний SaaS) используется только в случае полной блокировки локального окружения. Не является частью стандартного пайплайна.
4. **Векторный поиск**: В качестве модели эмбеддингов по умолчанию используется **Qwen3-Embedding-0.6B** (или 4B для качественного апгрейда). Модель `multilingual-e5-large` исключена из базового стека.
5. **Реранкер**: Кросс-энкодер **BAAI/bge-reranker-v2-m3** используется как обязательный шаг перед формированием шорт-листа.
6. **Роль VLM**: Модели Qwen2.5-VL / Qwen3-VL **не участвуют** в первичном поиске (retrieval layer). Они применяются точечно на этапе **sanity-check для финального шорт-листа из 3–5 кандидатов** для эстетического контроля.
7. **Провайдеры LLM**: Groq (основной, быстрый), OpenRouter (резервный, бесплатные модели).
8. **Финальная упаковка**: Обязательный интерактивный веб-сайт (Demo UI) в папке `app/` для демонстрации всех этапов пайплайна и сгенерированных писем.

---

## 3. Бэклог тикетов (Revised Backlog)

### 🧹 TICKET-01 — Очистка Seed-данных (Seed Data Cleanup)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Описание**: Очистка и нормализация 34 строк из исходника `Блогеры - Лист1.csv` с прямой сетевой проверкой доступности каждого профиля в Instagram без фейковых заглушек. Перепроверены 18 доступных профилей (`is_valid=True`) и 16 недоступных аккаунтов (`is_valid=False`, отмечены с ошибкой HTTP 404/400).

### 🏗 TICKET-02 — Базовые документы и согласование (Core Docs & Alignment)
* **Статус**: `DONE`
* **Описание**: Фиксация архитектуры, правил агента, политики качества данных (`docs/POLICY.md`) и статуса проекта в документах.

### 🔬 TICKET-03 — Консолидация исследований и фиксация стека (Research & Stack Lock)
* **Статус**: `DONE`
* **Приоритет**: Блокирующий
* **Описание**: Локальное тестирование вызовов Qwen3-Embedding и BGE-Reranker, настройка клиента Groq/OpenRouter. Создание базовых оберток в `src/shared`.
* **Done when**: Зафиксированы настройки подключения к API и локальные пути моделей в `.env`, написаны проверочные тесты.
* **Зависит от**: TICKET-02.

### 🐍 TICKET-03A — Изоляция окружения (Environment & .venv Alignment)
* **Статус**: `DONE`
* **Приоритет**: Средний
* **Описание**: Создание виртуального окружения `.venv`, перенос установленных зависимостей (включая CUDA PyTorch) в изолированную среду для финальной сдачи проекта.
* **Done when**: Зависимости успешно развернуты в изолированном `.venv`, smoke-тесты проходят внутри виртуального окружения.
* **Зависит от**: TICKET-03.

### 📡 TICKET-04 — Уровень сбора данных Instagram (Instagram Enrichment Layer)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Высокий
* **Описание**: Разработка `src/fetchers/enrich.py` с авторизацией по `sessionid` и SOCKS5-прокси (`socks5://127.0.0.1:2080`). Все фейковые mock-заглушки удалены. Спарсены **19 реально существующих активных профилей** из `Блогеры - Лист1.csv` и сохранены в `data/processed/seed_enriched.json`. Недоступные аккаунты отброшены без создания выдуманных данных.
* **Done when**: Пайплайн обогащает живые профили и сохраняет `data/processed/seed_enriched.json`.
* **Зависит от**: TICKET-03.

### 🔬 TICKET-04B — Исследование и экспериментальный hardened browser probe (Research Track)
* **Статус**: `DONE`
* **Приоритет**: Средний (Исследовательский сандбокс)
* **Описание**: Экспериментальное исследование и реализация прямого экспорта авторизованных куков (`sessionid` и `ds_user_id`), stealth-параметров CDP, маскировки `navigator.webdriver` и вызова системного Chrome. Реализован изолированный модуль `src/fetchers/browser_probe.py` и автоматический импорт сессии без вызова формы входа в `src/fetchers/session_bootstrap.py`.
* **Rationale**: Прямой перенос кук `sessionid` исключает триггер рекапчи и антифрод-системы Instagram при входе через браузер.
* **Done when**: Создан изолированный зонд `browser_probe.py`, реализован мгновенный экспорт сессии `session_bootstrap.py --session-id`, зафиксирована 100% стабильность сохранения кэша.
* **Зависит от**: TICKET-04.

### 🧠 TICKET-05 — Создание идеального портрета (Ideal Blogger Profiler)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Высокий
* **Описание**: Синтез идеального портрета инфлюенсера Llama-3.3-70B на основе **19 реально спарсенных профилей** из Instagram. Сохранено в `data/processed/ideal_portrait.json`.
* **Done when**: Создается файл `data/processed/ideal_portrait.json` в соответствии со схемой `IdealBloggerProfile`.
* **Зависит от**: TICKET-04.

### 🔎 TICKET-06 — Модуль поиска кандидатов (Candidate Discovery)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Высокий
* **Описание**: Поиск и детерминированная фильтрация **18 кандидатов с аудиторией** из пула реальных профилей. Профиль `19.voron` зафиксирован как отфильтрованный из-за `followers_count = 0` (приватная карточка). Экспортировано в `data/processed/candidates_discovered.json`.
* **Done when**: Сформирован валидный массив `data/processed/candidates_discovered.json`.
* **Зависит от**: TICKET-05.

### 📊 TICKET-07 — Векторный поиск и скоринг фич (Embedding Similarity & Feature Scoring)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Высокий
* **Описание**: Расчет векторных представлений Qwen3-Embedding-0.6B на CUDA GPU для **18 реальных кандидатов** в `src/scoring/embed.py`. Детерминированный пофичевый скоринг в `src/scoring/score.py`. Сформированы `data/processed/candidates_scored.json` и `output/embedding_debug_report.md`.
* **Done when**: Скрипты рассчитывают оценки для кандидатов, проходя `pytest tests/test_scoring_basic.py -v` и создавая `data/processed/candidates_scored.json`.
* **Зависит от**: TICKET-06.

### ⚖️ TICKET-08 — Реранкинг и визуальный контроль (Reranking & VLM Sanity Pass)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Высокий
* **Описание**: Реранкинг кросс-энкодером `BAAI/bge-reranker-v2-m3` на CUDA GPU для 18 реальных кандидатов (`src/scoring/rerank.py`) и VLM Visual Sanity Pass (`src/scoring/vlm_sanity.py`) для топовых кандидатов. Итоговый шорт-лист сохранен в `data/processed/shortlist_final.json`.
* **Done when**: Сформирован итоговый шорт-лист `data/processed/shortlist_final.json` с визуальным вердиктом по Pydantic-контракту `FinalShortlistEntry`.
* **Зависит от**: TICKET-07.

### 🌐 TICKET-08A — Сбор реальных данных и живой прогон пайплайна (Real Data Acquisition & Live Pipeline Run)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Приоритет**: Блокирующий
* **Цель**: Выполнить live pipeline run на 100% реальных спарсенных данных без фейковых генераторов.
* **Deliverables**: Сформирован сводный отчет воронки отбора `output/pipeline_audit_report.md` и обновлены все 8 артефактов в `data/processed/`.
* **Verification**: Пройдены все 29 unit-тестов `pytest -v` и полное соответствие Pydantic-контрактам.
* **Зависит от**: TICKET-08.

### ✉️ TICKET-09 — Генерация barter-offers и QA (Outreach Generator & QA)
* **Статус**: `DONE` (Перепроверено на 100% реальных данных)
* **Описание**: Генерация персонализированных коммерческих предложений на русском/английском языке с опорой на факты из постов.
* **Done when**: Записан файл `output/barter_offers.json` со сгенерированными письмами.
* **Зависит от**: TICKET-08.

### 🌐 TICKET-10 — Сборка интерактивного сайта (Full Website Packaging)
* **Статус**: `PENDING`
* **Приоритет**: Высокий
* **Описание**: Разработка интерфейса в папке `app/` для презентации результатов пайплайна (схемы, портрет идеального блогера, шорт-лист, офферы).
* **Done when**: Сайт запускается локально, полностью интерактивен и наполнен реальными результатами запусков.
* **Зависит от**: TICKET-09.

### 📝 TICKET-11 — Теоретическое эссе и финальная сборка (Writeup & Submission)
* **Статус**: `PENDING`
* **Приоритет**: Средний
* **Описание**: Подготовка Части 2 задания (теоретический разбор сквозной автоматизации) и финальная проверка репозитория.
* **Done when**: Проект готов к сдаче в виде единого репозитория.
* **Зависит от**: TICKET-10.

---

## 4. Порядок выполнения (Implementation Order)

1. Выполнить **TICKET-03** для фиксации API-подключений и локальной работы моделей эмбеддингов/реранкера.
2. Выполнить **TICKET-03A** для переноса зависимостей и настройки чистой изолированной среды в `.venv`.
3. Реализовать сборщик данных **TICKET-04** (Instagram Enrichment).
3. Создать модуль анализа **TICKET-05** для построения идеального портрета.
4. Последовательно реализовать поиск кандидатов (**TICKET-06**), скоринг эмбеддингов (**TICKET-07**) и реранкинг с VLM (**TICKET-08**).
5. Написать генератор писем (**TICKET-09**).
6. Собрать демонстрационный сайт (**TICKET-10**) и подготовить эссе (**TICKET-11**).

---

## 5. Что сохранить для будущих сессий (Handoff Truth)

* **Стек моделей**: Qwen3-Embedding (0.6B/4B), BGE-Reranker-v2-m3, Groq/OpenRouter API, Qwen2.5-VL.
* **Скрапинг**: Только self-operated скрапинг (Instaloader -> Playwright). Никаких сторонних SaaS в качестве основы.
* **VLM**: Исключительно для финальной визуальной валидации шорт-листа из 3–5 кандидатов (не участвует в первичном поиске).
* **Сайт**: Финальная презентация обязательно происходит через веб-интерфейс в `app/`.
* **Фрейминг**: Проект представляет собой модульный пайплайн (**modular AI pipeline (agent-ready)**), а не монолитный агент.

---

## 6. Известные технические проблемы и статус данных (Known Issues & Data Status Log)

1. **Полная ликвидация фейковых / синтетических данных (ЛИКВИДИРОВАНО И ОЧИЩЕНО)**:
   * *Контекст*: На ранних этапах разработки (`TICKET-01` – `TICKET-04`) скрипт `enrich.py` при столкновении с ошибками Instagram генерировал синтетические фейковые поля (mock fallback), что маскировало реальные ошибки сети и оставляло выдуманные данные в файлах.
   * *Решение и текущий статус*:
     - Все старые файлы с фейковыми заглушками (`normalized_seed_profiles.csv`, `normalized_seed_profiles_valid.csv`, `seed_normalized.json`) **ПОЛНОСТЬЮ УДАЛЕНЫ**.
     - Все генераторы mock-данных удалены из боевого кода. Введена политика **Strict Zero-Mock Data Policy** ([`docs/POLICY.md`](file:///c:/Users/Admin/Desktop/LD%20LATTE/docs/POLICY.md)).
     - Проведен ручной аудит всех 34 строк таблицы [`Блогеры - Лист1.csv`](file:///c:/Users/Admin/Desktop/LD%20LATTE/%D0%91%D0%BB%D0%BE%D0%B3%D0%B5%D1%80%D1%8B%20-%20%D0%9B%D0%B8%D1%81%D1%821.csv).

2. **Статус 100% живых спарсенных данных (19 Реальных профилей)**:
   * *Контекст*: Из 34 исходных записей таблицы `Блогеры - Лист1.csv` (индексы строк до ID 38 из-за пропусков) прямой скрапинг через SOCKS5-прокси и авторизованную сессию дал следующий результат:
     - **19 профилей являются 100% реальными, активными страницами Instagram**: `_kate_bruni` (319k), `juliar_r` (256k), `v.m.Beauty_blog` (205k), `anetboss_` (148k), `kristi_naxodka` (147k), `jd_cosm` (138k), `armlilitka` (87k), `mishandkatya` (69k), `kotova.live` (48k), `aida.mixx` (44k), `janestetsiura` (29k), `zari.ishikhovaa` (20k), `bazhenova_alenaa` (17k), `llaurraiiam` (11k), `dddinaaaaaa` (7k), `krrazalia` (7k), `daria_grogulenko` (5k), `shalafaeva.al` (3k), `19.voron`.
     - **15 профилей возвращают HTTP 404 / 400**: Страницы `merklary_l`, `curly.bloger`, `nev_pollyy`, `_crazy__unicorn__`, `demoiselle._.rie`, `yunglolaa`, `sha_obzor.wb`, `lv_yana_lv`, `miysta_fatt_`, `habakher`, `ri_vls`, `__aparina`, `rtini.a13`, `ninooochka2.0`, `irinatitovaaa_` удалены, переименованы или заблокированы в самом Instagram. Пользователь вручную подтвердил их отсутствие в Instagram.
   * *Реализованный статус*: Пайплайн работает строго на **19 реально спарсенных профилях**. Фейковые данные отсутствуют.

3. **Соблюдение контрактов при отсутствии schema drift**:
   * Все Pydantic-модели подходят и строго валидируют 19 реально выгруженных профилей. Сквозной аудит и 29 unit-тестов (`pytest -v`) подтверждают абсолютную валидность данных и отсутствие schema drift.

