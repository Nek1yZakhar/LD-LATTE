# 🧱 TICKET-10D — App Shell, Narrative Structure & Part 1/2/3 Layout Document

> **Статус артефакта**: `APPROVED / COMPLETED`  
> **Дата создания**: 2026-07-22  
> **Автор**: Antigravity AI Agent & Захар Матвейчук  
> **Назначение**: Описание спроектированного и собранного UI-каркаса (App Shell, Narrative Structure) для веб-приложения **LD Latte Demo UI** в папке `app/`. Служит мостом к этапу TICKET-10E (Interactive Evidence Views).

---

## 1. Overview & Purpose (Обзор и цели этапа)

**Главная задача TICKET-10D** — построить production-minded narrative app shell и макет секций в `app/`, объединяющий все 3 части тестового задания LD Latte по принципу **«ОДНА ссылка»**:
1. **Часть 1**: Инструмент поиска, 8-этапный AI-пайплайн, скоринг Qwen3 + BGE Reranker, VLM Visual Sanity и бартерные офферы.
2. **Часть 2**: Концепция сквозной автоматизации fashion e-commerce, SLA, антифрод и юнит-экономика.
3. **Часть 3**: Портфолио и резюме Захара Матвейчука с доказательным навигатором по исходному коду и документам.

---

## 2. File Architecture Created in `app/`

В рамках TICKET-10D создана следующая инженерная структура компонентов:

```
app/
├── package.json                   --> [Зависимости React 18, Vite 5, Lucide-react, TypeScript]
├── vite.config.ts                 --> [Vite сборщик с alias resolution `@/*` -> `src/*`]
├── tsconfig.json                  --> [Настройки компилятора TypeScript (strict mode)]
├── index.html                     --> [HTML-точка монтирования с подгрузкой шрифтов Google Fonts]
├── src/
│   ├── main.tsx                   --> [React entrypoint с подключением tokens.css и globals.css]
│   ├── App.tsx                    --> [Главное SPA-приложение, объединяющее AppShell и 4 секции]
│   ├── components/
│   │   ├── shell/
│   │   │   ├── AppShell.tsx       --> [Макет-обертка с отслеживанием прокрутки через IntersectionObserver]
│   │   │   ├── Header.tsx         --> [Фиксированная шапка с брендингом, 3-частным переключателем и GitHub]
│   │   │   ├── ProofRail.tsx      --> [Информационная полоса ключевых инженерных метрик (19 Real Profiles, 0% Mock)]
│   │   │   ├── SectionNav.tsx     --> [Sticky-навигатор по подсекциям внутри активной части]
│   │   │   └── Footer.tsx         --> [Нижний футер с навигатором по документации и метаданными автора]
│   │   └── sections/
│   │       ├── HeroSection.tsx    --> [Обзорный рекламный блок бренда LD Latte & Modular AI Pipeline]
│   │       ├── Part1Section.tsx   --> [Shell-контейнер Части 1 с ячейками под интерактивные виджеты TICKET-10E]
│   │       ├── Part2Section.tsx   --> [Shell-контейнер Части 2 с интеграционной архитектурой и экономикой]
│   │       └── Part3Section.tsx   --> [Shell-контейнер Части 3 с резюме, кейсами и навигатором по коду]
```

---

## 3. Navigation & Anchor Routing Strategy (Гибридный навигатор)

### А. Принцип «ОДНА ссылка» (Single Unified Navigator)
Приложение собрано как единый одностраничный веб-сайт (SPA). Проверяющий получает ровно одну ссылку и имеет бесшовный доступ ко всем материалам без переходов между несвязанными вкладками.

### Б. Система глобальных якорей:
- `#hero` — Главная страница, метрики-доказательства и 4 ключевых тезиса.
- `#part-1` — Часть 1: AI-Пайплайн Studio, 8 модулей, шорт-лист и офферы.
- `#part-2` — Часть 2: Архитектура сквозной автоматизации fashion e-commerce.
- `#part-3` — Часть 3: Резюме Захара Матвейчука, OSINT МИД РФ, LegalTech и навигатор по документации.

### В. Динамический отслеживатель скролла (Active Section Tracking)
В `AppShell.tsx` реализован слушатель прокрутки страницы, который автоматически подсвечивает активный раздел в фиксированной шапке (`Header.tsx`) и динамически обновляет поднавигационные якоря (`SectionNav.tsx`).

---

## 4. Section Shell Layouts Overview & Brand Alignment

1. **`HeroSection.tsx`**:
   - Главный заголовок в 100% согласовании с брендом LD LATTE (`Outfit` bold + `Bodoni Moda` serif italic в винном тоне `#48121A`).
   - Метрики: `19/19 Real Profiles`, `0% Mock Data`, `39 Pytest PASS`.
   - Прямые вызовы действий: `[Часть 1: AI-Пайплайн Studio]`, `[Часть 2: Схема]`, `[Часть 3: Автор]`.

2. **`Part1Section.tsx`**:
   - Контейнеры 5 ключевых модулей: `1.1 Схема конвейера`, `1.2 Портрет`, `1.3 Таблица кандидатов`, `1.4 Шорт-лист & VLM`, `1.5 Офферы`.
   - Подготовлены открытые ячейки (slots) под глубокую интерактивность TICKET-10E.

3. **`Part2Section.tsx`**:
   - Карточки 4 этапов интеграции с CRM/1С.
   - Иерархия скрапинга T1/T2/T3.
   - Юнит-экономика ($12–15 на 1,000 кандидатов).

4. **`Part3Section.tsx`**:
   - Резюме Захара Матвейчука (ИГУ, BIT Чжухай).
   - Кейсы: OSINT МИД РФ, LegalTech Intake Dashboard, Approval Service.
   - AI-Native Workflow карточка с контрастным стилем `#E8A990` на темном фоне `#161210`.
   - Кликабельный навигатор по 100% реальным файлам проекта.

---

## 5. Brand Identity & Contrast Polish

В рамках TICKET-10D выполнена точечная доработка визуальной системы под **100% официальный логотип LD LATTE**:
* **Официальный векторный логотип**: Переведен из изображения в растре в векторные SVG-артефакты [`app/public/logo-mark.svg`](file:///c:/Users/Admin/Desktop/LD%20LATTE/app/public/logo-mark.svg) и [`app/public/favicon.svg`](file:///c:/Users/Admin/Desktop/LD%20LATTE/app/public/favicon.svg).
* **Фирменный оттенок**: Введен глубокий винный / бургундский цвет **`#48121A`** как основной акцент бренда.
* **Шрифтовая пара бренда**: Подключен шрифт **`Bodoni Moda`** для засечного акцентного начертания наименования бренда LD LATTE.
* **Контрастность на темных блоках**: Устранены проблемы с читаемостью текста на темных элементах (`Footer.tsx` и плашка `AI-Native Workflow` в `Part3Section.tsx`). Все заголовки переведены на оттенок `#E8A990`, ссылки — на `#FAF7F2` с интерактивной подсветкой.
* **Выделение текста (Selection)**: Настроен высококонтрастный глобальный режим выделения `::selection` (`background: #48121A`, `color: #FAF7F2`).

---

## 6. Build Verification Results

Проведена успешная компиляция production-бандла Vite (`npm run build`):
- **TypeScript**: 0 ошибок компиляции (`tsc` passed).
- **Vite Build**: Сформирован чистый бандл `dist/assets/index-CQvsjnwz.js` (232 kB, gzip: 70 kB).
- **Style Bundle**: `dist/assets/index-BSi8YI0X.css` (34 kB).

---

## 6. Next Step Alignment (Переход к TICKET-10E)

Каркас **TICKET-10D** полностью готов. Следующий этап — **TICKET-10E (Interactive Evidence Views)**, в рамках которого готовые shell-контейнеры Части 1 будут наполнены интерактивными виджетами:
1. Интерактивным графом узлов пайплайна с открытием Pydantic-контрактов.
2. Фильтруемой таблицей скоринга кандидатов (Qwen3 Embeddings, BGE Reranker logits, VLM notes).
3. Модальными окнами глубокого анализа кандидатов (Candidate Deep-Dive Drawer).
4. Инспектором системных промптов и генератором писем.
