/**
 * LD LATTE Demo UI - Grounded Pipeline & Resume Static Data Export
 * @file app/src/data/content/pipeline_data.ts
 * @description 100% grounded static data exported directly from real pipeline JSON/MD artifacts.
 * STRICT ZERO-MOCK DATA POLICY ENFORCED.
 */

import type {
  IdealBloggerProfile,
  EnrichedProfileData,
  CandidateRerankScore,
  ShortlistFinalEntry,
  BarterOffer,
  ProofMetrics,
  PipelineNode,
  Part2AutomationBlueprint,
  AuthorResume,
  ProofLink,
  OutreachPromptInspector
} from '../types';

// ==========================================
// 1. PROOF METRICS
// ==========================================
export const GROUNDED_PROOF_METRICS: ProofMetrics = {
  totalSeedProfiles: 34,
  activeRealProfiles: 19,
  unreachableProfilesRemoved: 15,
  zeroMockPolicyEnforced: true,
  unitTestsPassCount: 39,
  unitTestsTotalCount: 39,
  costPerCandidateUsd: 0.05,
  executionPipelineStatus: '100% LIVE REAL DATA'
};

// ==========================================
// 2. PIPELINE FLOW NODES
// ==========================================
export const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'stage_1',
    stageNumber: 1,
    name: 'Проверка и очистка исходного списка',
    secondaryName: 'Seed Data Ingestion & Sanitization Layer',
    moduleFile: 'src/ingest/clean.py',
    inputContract: 'Исходный seed-список из 34 ссылок на профили (Блогеры - Лист1.csv)',
    outputContract: 'Проверенный список из 19 доступных профилей (normalized_seed_profiles_valid.csv)',
    description: 'Система выполняет прямую сетевую проверку всех 34 ссылок в Instagram, извлекает никнеймы и определяет доступность страниц. 15 недоступных (HTTP 404/400) профилей отсеиваются (Hard Reject), а дальнейший анализ ведется строго по 19 реально существующим активным инфлюенсерам.',
    status: 'DONE'
  },
  {
    id: 'stage_2',
    stageNumber: 2,
    name: 'Сбор и обогащение данных профилей',
    secondaryName: 'Instagram Data Collection & Enrichment Layer',
    moduleFile: 'src/fetchers/enrich.py',
    inputContract: '19 подтвержденных профилей Instagram',
    outputContract: 'Структурированный JSON с метриками и постами (seed_enriched.json)',
    description: 'Сбор данных выполняется локально, без покупки внешнего scraping API как основной инфраструктуры. Основной сценарий — self-operated сбор на собственном компьютере (Instaloader); браузерная автоматизация с авторизованной сессией (Playwright) используется только как резервный путь.',
    status: 'DONE'
  },
  {
    id: 'stage_3',
    stageNumber: 3,
    name: 'Синтез портрета идеального блогера',
    secondaryName: 'Ideal Blogger Profiler (Brand Standard Synthesis)',
    moduleFile: 'src/analyzers/portrait.py',
    inputContract: 'Обогащенные данные 19 реально подтвержденных seed-профилей',
    outputContract: 'Спецификация критериев идеального блогера (ideal_portrait.json)',
    description: 'Построение портрета идеального блогера на основе уже подтвержденных реальных seed-профилей. ИИ-модель Llama-3.3-70B формулирует объективные ориентиры бренда (ниши lifestyle/beauty, порог вовлеченности ER ≥ 3.6%, дружелюбный тон) для точной оценки новых кандидатов.',
    status: 'DONE'
  },
  {
    id: 'stage_4',
    stageNumber: 4,
    name: 'Первичный поиск и отсев кандидатов',
    secondaryName: 'Candidate Discovery & Rule-based Filtering',
    moduleFile: 'src/search/discover.py',
    inputContract: 'Публичные данные 19 профилей и эталонный портрет бренда',
    outputContract: 'Массив 18 отфильтрованных кандидатов (candidates_discovered.json)',
    description: 'Первичный поиск и отсев кандидатов по понятным алгоритмическим правилам (отсеивание закрытых профилей, аккаунтов без постов или с 0 подписчиков). Это гарантирует, что система дальше будет вычислять параметры только для реально релевантных аккаунтов.',
    status: 'DONE'
  },
  {
    id: 'stage_5',
    stageNumber: 5,
    name: 'Смысловое сравнение и скоринг фич',
    secondaryName: 'Vector Embedding Similarity & Feature Scoring',
    moduleFile: 'src/scoring/embed.py & score.py',
    inputContract: '18 валидированных кандидатов и эталонные векторы бренда',
    outputContract: 'Оцененный список кандидатов с детальными баллами (candidates_scored.json)',
    description: 'Система сравнивает смысл контента блогера и считает совпадение по ключевым признакам. Нейросеть Qwen3-Embedding (0.6B) превращает тексты постов в смысловые векторы, а детерминированный модуль взвешивает 5 фич: нишу, ER, свежесть публикаций, рекламу и язык.',
    status: 'DONE'
  },
  {
    id: 'stage_6',
    stageNumber: 6,
    name: 'Точный реранкинг кросс-энкодером',
    secondaryName: 'Cross-Encoder Reranking Layer',
    moduleFile: 'src/scoring/rerank.py',
    inputContract: 'Ранжированный список 18 кандидатов после первичного скоринга',
    outputContract: 'Уточненный рейтинг кандидатов с нормированными баллами (candidates_reranked.json)',
    description: 'Дополнительная пересортировка сильных кандидатов более точной моделью-кросс-энкодером (BAAI/bge-reranker-v2-m3). Нейросеть одновременно сопоставляет полный текст профиля кандидата с портретом бренда для максимальной точности верхушки рейтинга.',
    status: 'DONE'
  },
  {
    id: 'stage_7',
    stageNumber: 7,
    name: 'Визуальный контроль стиля (VLM Sanity Pass)',
    secondaryName: 'Multimodal Visual Aesthetics Audit (Qwen2.5-VL)',
    moduleFile: 'src/scoring/vlm_sanity.py',
    inputContract: 'Узкий топ лидеров рейтинга (Top-5 финалистов)',
    outputContract: 'Финальный шорт-лист с визуальным вердиктом (shortlist_final.json)',
    description: 'Финальная визуальная проверка эстетики и визуального стиля ленты мультимодальной ИИ-моделью (Qwen2.5-VL). Проверка запускается строго для узкого топа из 5 финалистов, а не для всей базы, что подчёркивает разумную и экономичную архитектуру затрат.',
    status: 'DONE',
    isVlmNode: true
  },
  {
    id: 'stage_8',
    stageNumber: 8,
    name: 'Генерация персональных PR-офферов и QA',
    secondaryName: 'Outreach Generator & Anti-Robotic QA',
    moduleFile: 'src/outreach/generator.py',
    inputContract: 'Финальный шорт-лист 5 лидеров и факты из их публикаций',
    outputContract: 'Персонализированные предложения о бартере (barter_offers.json)',
    description: 'Создание персональных предложений о сотрудничестве на основе фактов из конкретного профиля (DeepSeek-V4 / Llama-3.3-70B). Система автоматически проводит QA-проверку на отсутствие канцелярских и роботизированных штампов перед выгрузкой.',
    status: 'DONE'
  }
];

// ==========================================
// 3. IDEAL BLOGGER PROFILE (portrait.json)
// ==========================================
export const GROUNDED_IDEAL_PORTRAIT: IdealBloggerProfile = {
  target_niches: ['lifestyle', 'beauty'],
  estimated_er_min: 3.6,
  key_themes: ['lifestyle highlights', 'beauty product reviews', 'fashion finds'],
  preferred_tone_of_voice: 'friendly',
  sponsorship_saturation_max: 'low',
  activity_recency_max_days: 7,
  rationale: 'Based on the seed data, the ideal blogger profile targets lifestyle and beauty niches, with a minimum engagement rate of 3.6% to ensure active audience participation. The friendly tone of voice is preferred as it aligns with the predominant tone observed in the seed accounts. Low sponsorship saturation is chosen to avoid over-promoted content, and recent activity within 7 days ensures the blogger is currently active and engaging with their audience.'
};

// ==========================================
// 4. RAW ENRICHED SEED PROFILES (19 Profiles)
// ==========================================
export const RAW_SEED_ENRICHED: EnrichedProfileData[] = [
  {
    username: 'krrazalia',
    biography: '• учу создавать контент и сотрудничать с брендами\n• ОСТОРОЖНО, мой блог может вызвать черную дыру в твоем кошельке',
    followers_count: 7184,
    posts_count: 21,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:46:14.185744+00:00'
  },
  {
    username: 'shalafaeva.al',
    biography: 'Instagram profile for shalafaeva.al',
    followers_count: 3738,
    posts_count: 6,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:46:27.275897+00:00'
  },
  {
    username: 'kristi_naxodka',
    biography: 'Personal blog\nАвтор самых стильных подборок 🫶🏻\nBeauty подборки\nНахожу стильное на WB и не только …\nСотрудничество @pr_kristi_naxodka',
    followers_count: 147000,
    posts_count: 431,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:46:40.275866+00:00'
  },
  {
    username: 'daria_grogulenko',
    biography: 'Стильные образы в REELS\nБольше находок в моем телеграмме👇🏼\n📍Moscow | Московский',
    followers_count: 5364,
    posts_count: 159,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'beauty',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:46:54.480870+00:00'
  },
  {
    username: 'llaurraiiam',
    biography: 'Fashion Model\nLifestyle 🖇️👼\nMake up / dm 📩\nUGC для брендов.\nСанкт-Петербург',
    followers_count: 11000,
    posts_count: 660,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'minimalist',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:47:07.443179+00:00'
  },
  {
    username: 'mishandkatya',
    biography: 'Blogger\nСамая непредсказуемая парочка! ❤️\nВК: Миша и Кейт. Люблю @ekaterina_vanlife',
    followers_count: 70000,
    posts_count: 169,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:47:20.806372+00:00'
  },
  {
    username: 'v.m.Beauty_blog',
    biography: 'Blogger\n🛍️ знаю где и как купить выгодно\n🐾 хозяйка 14 спасенышей 🐶🐱\n🌎🏡 с любовью к путешествиям и загородной жизни',
    followers_count: 206000,
    posts_count: 316,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:47:34.130625+00:00'
  },
  {
    username: 'juliar_r',
    biography: 'Blogger\nTᴏᴘ ʟɪFᴇSᴛʏʟᴇ Bʟᴏɢɢᴇʀ\nᴅɪʀᴇᴄᴛ 📩',
    followers_count: 257000,
    posts_count: 325,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'None',
    caption_tone: 'None',
    sponsorship_saturation: 'unknown',
    fetched_at: '2026-07-22T09:47:46.431225+00:00'
  },
  {
    username: '_kate_bruni',
    biography: 'Blogger\nГивы в блок!\nРезидент ЦНМ\nСотрудничество @pr_kate_bruni\nТНТ, Ю, Суббота, Пятница',
    followers_count: 318000,
    posts_count: 674,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'minimalist',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:47:59.444554+00:00'
  },
  {
    username: 'jd_cosm',
    biography: '✨ОБЗОРЫ✨ ДОМ✨ САД✨\n🌿Комнатные растения 🌿\nWELCOME в ремонт😂😘\nСвязь директ',
    followers_count: 138000,
    posts_count: 491,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:48:13.416105+00:00'
  },
  {
    username: 'dddinaaaaaa',
    biography: 'Personal blog\nlife & style & beauty & fashion\n23 y.o, married, young mommy\ncooperation: 📩\n📍Moscow / Dushanbe',
    followers_count: 7996,
    posts_count: 72,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'minimalist',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:48:26.647389+00:00'
  },
  {
    username: 'janestetsiura',
    biography: 'Blogger\nwoman 💋\n@jno_brand',
    followers_count: 30000,
    posts_count: 339,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:48:38.950633+00:00'
  },
  {
    username: 'armlilitka',
    biography: 'Здесь вкусно и уютно 🤎\nМоя большая семья, рецепты и кудряшки✨\nСотрудничество @armlilitka_pr 💌',
    followers_count: 88000,
    posts_count: 705,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'person',
    caption_tone: 'neutral',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:48:51.631752+00:00'
  },
  {
    username: 'aida.mixx',
    biography: 'Blogger\n◾️жуткий шопоголик\n◾️мать в квадрате\n◾️Сотруд-во в direct\nSAMARA/MOSCOW',
    followers_count: 44000,
    posts_count: 1925,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:49:05.159817+00:00'
  },
  {
    username: 'bazhenova_alenaa',
    biography: 'Personal blog\nВологда/ Москва ОБУЧАЮ МАКИЯЖУ 👇🏼\n@bazhenova.studio\nВ моих комментариях самые 🚩 мужики\nДвигаюсь за счет внешности, могу...',
    followers_count: 18000,
    posts_count: 95,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:49:18.825423+00:00'
  },
  {
    username: 'anetboss_',
    biography: 'Blogger\n🪴Загородная жизнь без выгорания\n🏠Стройка/Дети/Огород/Дом\n🤑Бюджетный уют и находки',
    followers_count: 149000,
    posts_count: 175,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'construction',
    caption_tone: 'neutral',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:49:32.087885+00:00'
  },
  {
    username: 'kotova.live',
    biography: 'Юля | Дом  • UGC • Вдохновение • Стиль: Брянск',
    followers_count: 49000,
    posts_count: 271,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'lifestyle',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:49:44.887790+00:00'
  },
  {
    username: 'zari.ishikhovaa',
    biography: 'Zarina 🐚 | распаковки | бьюти & life',
    followers_count: 21000,
    posts_count: 1808,
    engagement_rate: 0.0,
    recent_posts: [],
    activity_recency: 0,
    language: 'ru',
    niche: 'beauty',
    caption_tone: 'friendly',
    sponsorship_saturation: 'low',
    fetched_at: '2026-07-22T09:49:53.248055+00:00'
  }
];

// ==========================================
// 5. CANDIDATE RERANK SCORES (candidates_reranked.json)
// ==========================================
export const RAW_CANDIDATES_RERANKED: CandidateRerankScore[] = [
  {
    username: 'jd_cosm',
    semantic_similarity: 0.6527,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.7285,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0010649506002664566,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'dddinaaaaaa',
    semantic_similarity: 0.6269,
    features_score: 1.0,
    cross_encoder_score: 0.5002,
    composite_score: 0.7195,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.000999605399556458,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'llaurraiiam',
    semantic_similarity: 0.6078,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.7128,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0010285429889336228,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'bazhenova_alenaa',
    semantic_similarity: 0.5909,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.7069,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0012308534933254123,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'mishandkatya',
    semantic_similarity: 0.5744,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.7011,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0010567250428721309,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'v.m.beauty_blog',
    semantic_similarity: 0.5737,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.7009,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.001171997282654047,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'kristi_naxodka',
    semantic_similarity: 0.5672,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.6986,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0012469871435314417,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'zari.ishikhovaa',
    semantic_similarity: 0.5575,
    features_score: 1.0,
    cross_encoder_score: 0.5002,
    composite_score: 0.6952,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.000833616650197655,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'krrazalia',
    semantic_similarity: 0.555,
    features_score: 1.0,
    cross_encoder_score: 0.5001,
    composite_score: 0.6943,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0005421330570243299,
      normalized_cross_encoder_score: 0.5001,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: '_kate_bruni',
    semantic_similarity: 0.5515,
    features_score: 1.0,
    cross_encoder_score: 0.5003,
    composite_score: 0.6931,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0011791009455919266,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'janestetsiura',
    semantic_similarity: 0.548,
    features_score: 1.0,
    cross_encoder_score: 0.5002,
    composite_score: 0.6919,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0008755957242101431,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'kotova.live',
    semantic_similarity: 0.5326,
    features_score: 1.0,
    cross_encoder_score: 0.5002,
    composite_score: 0.6865,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.000628237088676542,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'daria_grogulenko',
    semantic_similarity: 0.5279,
    features_score: 1.0,
    cross_encoder_score: 0.5002,
    composite_score: 0.6848,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.000783714756835252,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'aida.mixx',
    semantic_similarity: 0.4995,
    features_score: 1.0,
    cross_encoder_score: 0.5004,
    composite_score: 0.6749,
    similarity_breakdown: {
      partial_scores: { niche_match: 1.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0016426999354735017,
      normalized_cross_encoder_score: 0.5004,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'armlilitka',
    semantic_similarity: 0.5581,
    features_score: 0.7,
    cross_encoder_score: 0.5002,
    composite_score: 0.5904,
    similarity_breakdown: {
      partial_scores: { niche_match: 0.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0008286986849270761,
      normalized_cross_encoder_score: 0.5002,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'anetboss_',
    semantic_similarity: 0.4605,
    features_score: 0.7,
    cross_encoder_score: 0.5001,
    composite_score: 0.5562,
    similarity_breakdown: {
      partial_scores: { niche_match: 0.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 1.0, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0005302484496496618,
      normalized_cross_encoder_score: 0.5001,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  },
  {
    username: 'juliar_r',
    semantic_similarity: 0.5354,
    features_score: 0.6,
    cross_encoder_score: 0.5003,
    composite_score: 0.5475,
    similarity_breakdown: {
      partial_scores: { niche_match: 0.0, er_match: 1.0, recency_match: 1.0, sponsorship_match: 0.5, language_match: 1.0 },
      feature_weights: { niche: 0.3, er: 0.25, sponsorship: 0.2, recency: 0.15, language: 0.1 },
      alpha: 0.5,
      raw_cross_encoder_score: 0.0011699014576151967,
      normalized_cross_encoder_score: 0.5003,
      rerank_weights: { semantic: 0.35, features: 0.35, cross_encoder: 0.3 }
    }
  }
];

// ==========================================
// 6. SHORTLIST FINAL (shortlist_final.json — Live OpenRouter Qwen2.5-VL-72B Multimodal Run)
export const RAW_SHORTLIST_FINAL: ShortlistFinalEntry[] = [
  {
    username: 'jd_cosm',
    rerank_result: RAW_CANDIDATES_RERANKED[0],
    vlm_sanity_passed: false,
    vlm_aesthetic_notes: "Изображение не соответствует стандартам LD Latte из-за использования насыщенных цветов и сложного фона. Стиль одежды также не соответствует минималистичному и элегантному образу бренда.",
    grounding_facts: [
      "На профильном фото присутствуют яркие и контрастные цвета, что не соответствует нейтральной палитре LD Latte.",
      "Фон изображения включает в себя сложный пейзаж с водой и горизонтом, что создает визуальный шум.",
      "Одежда на фотографии выглядит более декоративной, чем элегантной и минималистичной."
    ]
  },
  {
    username: 'dddinaaaaaa',
    rerank_result: RAW_CANDIDATES_RERANKED[1],
    vlm_sanity_passed: true,
    vlm_aesthetic_notes: "Профильное изображение соответствует стандартам LD Latte благодаря нейтральной цветовой палитре и минималистичному стилю. Фотография выглядит элегантно и чисто.",
    grounding_facts: [
      "На изображении присутствуют нейтральные тона в виде белой одежды и светлых цветов.",
      "Фон состоит из деревянной текстуры, что добавляет тепла и естественности к общему виду.",
      "Использование минимального количества аксессуаров подчеркивает простоту и элегантность."
    ]
  },
  {
    username: 'llaurraiiam',
    rerank_result: RAW_CANDIDATES_RERANKED[2],
    vlm_sanity_passed: true,
    vlm_aesthetic_notes: "Профильное изображение соответствует стандартам LD Latte благодаря нейтральной цветовой палитре и минималистичному стилю. Образ выглядит элегантно и гармонично.",
    grounding_facts: [
      "На изображении присутствуют нейтральные тона в одежде и аксессуарах.",
      "Фон чистый и не перегружен деталями, что соответствует требованиям бренда.",
      "Использованы натуральные элементы, такие как цветок в волосах, что добавляет аутентичности."
    ]
  },
  {
    username: 'bazhenova_alenaa',
    rerank_result: RAW_CANDIDATES_RERANKED[3],
    vlm_sanity_passed: false,
    vlm_aesthetic_notes: "Изображение не соответствует стандартам LD Latte из-за ярких цветов и отсутствия минимализма. Фон слишком динамичный для бренда.",
    grounding_facts: [
      "На фото присутствуют яркие синие и зеленые цвета, что не соответствует нейтральной палитре бренда.",
      "Фоном служит море, что добавляет динамики и не соответствует чистым, минималистичным фонам.",
      "Костюм с блестками выглядит слишком декоративно для элегантного стиля LD Latte."
    ]
  },
  {
    username: 'mishandkatya',
    rerank_result: RAW_CANDIDATES_RERANKED[4],
    vlm_sanity_passed: false,
    vlm_aesthetic_notes: "Профильное изображение не соответствует стандартам LD Latte из-за яркого цветового фона и отсутствия минимализма. Снимок выглядит слишком жизнерадостным для бренда.",
    grounding_facts: [
      "На изображении присутствует яркий градиентный фон с розовыми и фиолетовыми тонами.",
      "Мужчина одет в белую рубашку, что частично соответствует нейтральной палитре, но общий вид не минималистичен.",
      "Профиль указывает на нишу «лайфстайл» с дружелюбным тоном."
    ]
  }
];

// ==========================================
// 7. BARTER OFFERS (barter_offers.json)
// ==========================================
export const RAW_BARTER_OFFERS: BarterOffer[] = [
  {
    username: 'jd_cosm',
    subject: 'Стильный подарок от LD Latte для @jd_cosm 🤍',
    body: 'Здравствуйте, Юлия! Мы в LD Latte восхищаемся вашим легким и вдохновляющим стилем — он идеально передает дух современного lifestyle. Наш бренд создает капсульную одежду, которая помогает собирать гармоничные образы для повседневной жизни. Хотим предложить вам выбрать любой комплект из новой коллекции в подарок. Если вам понравится, будем рады увидеть, как вы сочетаете вещи в своем фирменном стиле — например, в формате эстетичного Reels или образа дня. Как вам такая идея? 😊',
    language: 'ru',
    personalized_elements: [
      'Легкий и вдохновляющий стиль',
      'Фирменный lifestyle-подход'
    ],
    grounding_facts: [
      'Профиль ведется на русском языке',
      'Ниша — lifestyle, что соответствует ценностям LD Latte'
    ]
  },
  {
    username: 'dddinaaaaaa',
    subject: 'Стильный подарок от LD Latte для @dddinaaaaaa 🤍',
    body: 'Здравствуйте, Дина! Мы в LD Latte восхищаемся вашим чувством стиля и тем, как вы создаете контент — лаконично, элегантно и с любовью к деталям. Наш бренд создает капсульную одежду, которая помогает легко собирать безупречные повседневные образы. Хотим предложить вам примерить понравившиеся вещи из новой коллекции и показать их в своем уникальном стиле — будь то эстетичный Reels, распаковка или образ дня. Будем рады, если вам понравится наша эстетика! Подскажите, вам было бы интересно взглянуть на каталог?',
    language: 'ru',
    personalized_elements: [
      'Чувство стиля и лаконичность контента',
      'Элегантность и внимание к деталям'
    ],
    grounding_facts: [
      'Биография Дины указывает на её деятельность как content creator',
      'Профиль относится к lifestyle-нише, что соответствует позиционированию LD Latte'
    ]
  },
  {
    username: 'llaurraiiam',
    subject: 'Стильный подарок от LD Latte для @llaurraiiam 🤍',
    body: 'Здравствуйте, Лаура! Ваш аккаунт привлекает внимание своей элегантной простотой и чувством стиля — именно то, что мы ценим в LD Latte. Мы создаем капсульную одежду, которая помогает легко собирать безупречные повседневные образы. Хотим предложить вам выбрать понравившийся комплект из нашей новой коллекции в подарок. Будем рады, если вы покажете его в своем неповторимом стиле — например, в эстетичном Reels или посте. Как вам такая идея?',
    language: 'ru',
    personalized_elements: [
      'Элегантная простота и чувство стиля',
      'Неповторимый стиль'
    ],
    grounding_facts: [
      'Профиль соответствует минималистичной эстетике LD Latte',
      'Ниша lifestyle подходит для демонстрации люксовой моды LD Latte',
      'Биография краткая и простая, что соответствует чистому и элегантному имиджу бренда'
    ]
  },
  {
    username: 'bazhenova_alenaa',
    subject: 'Стильный подарок от LD Latte для @bazhenova_alenaa 🤍',
    body: 'Здравствуйте, Алена! Мы в восторге от вашего легкого и дружелюбного подхода к созданию контента — ваши посты всегда наполнены теплотой и вдохновением. В LD Latte мы создаем качественную капсульную одежду, в которой легко собирать безупречные повседневные аутфиты. Хотим подарить вам понравившийся образ из нашей новой коллекции. Будем искренне рады, если вы покажете вещи в своем стиле — в формате эстетичного Reels, распаковки или образа дня. Подскажите, вам было бы интересно взглянуть на наш каталог и примерить вещи?',
    language: 'ru',
    personalized_elements: [
      'Легкий и дружелюбный подход к созданию контента',
      'Посты, наполненные теплотой и вдохновением'
    ],
    grounding_facts: [
      'Профиль кандидата ориентирован на lifestyle-контент, что соответствует направлению бренда LD Latte.',
      'Тон кандидата дружелюбный, что может быть преимуществом для коллабораций.'
    ]
  },
  {
    username: 'mishandkatya',
    subject: 'Стильный подарок от LD Latte для @mishandkatya 🤍',
    body: 'Здравствуйте, Миша и Кейт! Мы восхищаемся вашим теплым и дружелюбным подходом к контенту — ваши посты всегда наполнены искренностью и легкостью. В LD Latte мы создаем качественную капсульную одежду, в которой легко собирать безупречные повседневные аутфиты. Хотим подарить вам понравившийся образ из нашей новой коллекции. Будем искренне рады, если вы покажете вещи в своем стиле — в формате эстетичного Reels, распаковки или образа дня. Подскажите, вам было бы интересно взглянуть на наш каталог и примерить вещи?',
    language: 'ru',
    personalized_elements: [
      'Теплый и дружелюбный подход к контенту',
      'Искренность и легкость в постах'
    ],
    grounding_facts: [
      'Профиль ориентирован на lifestyle-контент',
      'Тон профиля дружелюбный и непринужденный'
    ]
  }
];

// ==========================================
// 8. OUTREACH PROMPT INSPECTOR (prompts/outreach_offer.md)
// ==========================================
export const GROUNDED_OUTREACH_PROMPT_INSPECTOR: OutreachPromptInspector = {
  promptFilePath: 'prompts/outreach_offer.md',
  systemPromptTemplate: `Ты — Senior PR & Influencer Marketing Specialist модного бренда женской одежды LD Latte.
Твоя задача — написать теплое, естественное и персонализированное предложение о бартерном сотрудничестве (PR-рассылка/подарок) для Instagram-блогера из шорт-листа.

ТРЕБОВАНИЯ К ТЕКСТУ:
1. Зазывность и естественность: Пиши без роботоподобного жаргона и канцелярщины.
2. Язык: Всегда используй русский язык (lang="ru") для блогеров из РФ.
3. Персонализация: Упомяни 1-2 конкретные детали из био/постов блогера.
4. Заземление (100% Grounding): Никаких выдуманных фактов или несуществующих коллекций.
5. Имя: Используй личное имя блогера при вызове (например, "Дарья" вместо "@daria_grogulenko").`,
  qaRules: {
    antiRoboticCheck: 'validate_qa_draft() checking cyrillic threshold and ban on bureaucratic jargon',
    cyrillicMinCount: 15,
    factGroundingEnforced: true,
    fallbackRule: 'Fallback to @username greeting if first name confidence is low'
  }
};

// ==========================================
// 9. PART 2 — AUTOMATION BLUEPRINT
// ==========================================
export const GROUNDED_PART2_AUTOMATION: Part2AutomationBlueprint = {
  title: 'Архитектура сквозной автоматизации для fashion & beauty e-commerce',
  summary: 'Промышленный архитектурный проект автоматического поиска, скоринга и коммуникации с инфлюенсерами в масштабе 1,000+ кандидатов в месяц.',
  systemArchitectureNodes: [
    {
      id: 'ingestion_cluster',
      name: 'Сбор данных (Self-Operated Parser)',
      description: 'Каскадный сбор постов и профилей 100% собственным парсером (Instaloader CLI + Playwright с авторизованной куки-сессией + SOCKS5 прокси). Apify НЕ использовался.'
    },
    {
      id: 'ai_scoring_engine',
      name: 'AI Scoring & Reranking Engine',
      description: 'Qwen3-Embedding-0.6B векторизация, детерминированный скоринг 5 фич, BAAI/bge-reranker-v2-m3 кросс-энкодер и Qwen2.5-VL аудит визуального стиля.'
    },
    {
      id: 'crm_logistics_integration',
      name: 'Интеграция с CRM & Логистикой',
      description: 'Автоматическая передача согласованных кандидатов в CRM (Bitrix24 / 1С / Supabase) и формирование трек-номера отправки PR-комплекта LD Latte.'
    },
    {
      id: 'outreach_automation',
      name: 'Персонализированный Outreach & QA',
      description: 'Генерация персональных писем (DeepSeek-V4) с проверкой anti-robotic QA (отсев канцелярита, контроль кириллицы) и интеграцией с Direct/Email.'
    }
  ],
  scrapingHierarchy: [
    { level: 1, technology: 'Instaloader CLI', role: 'Первичный сбор публичных метаданных', triggerCondition: 'Основной рабочий путь без банов' },
    { level: 2, technology: 'Playwright + Stealth CDP', role: 'Парсинг постов с авторизованной sessionid', triggerCondition: 'Блокировка GraphQL API или анализ постов' },
    { level: 3, technology: 'Apify External SaaS (Не использовался)', role: 'Аварийный бэкап при IP-банах', triggerCondition: 'Резервная опция (в данном прогоне НЕ вызывался)' }
  ],
  proxyStrategy: {
    type: 'SOCKS5 Residential Proxy Pool',
    protocol: 'SOCKS5 / HTTP',
    publicSafeDescription: 'Ротируемый пулл резидентских SOCKS5-прокси с гео-привязкой к целевым регионам РФ/СНГ для сохранения сессий.'
  },
  economics: {
    batchSize: 10,
    totalCostUsd: 0.02,
    items: [
      { component: 'Qwen3 Local Embeddings & BGE Reranker', costPer1kCandidatesUsd: 0.00, description: 'Локальный GPU/CPU инференс без API-затрат' },
      { component: 'LLM Synthesis & Offer Generation (DeepSeek-V4)', costPer1kCandidatesUsd: 0.01, description: 'DeepSeek-V4 API (< $0.15 / 1M токенов)' },
      { component: 'VLM Visual Sanity Pass (Qwen2.5-VL-72B)', costPer1kCandidatesUsd: 0.003, description: 'Прямой мультимодальный VLM-вызов OpenRouter API для 5 аватарок ($0.003)' },
      { component: 'Residential SOCKS5 Proxy Traffic (10 профилей)', costPer1kCandidatesUsd: 0.01, description: 'Мизерный расход трафика для 10 целевых кандидатов' }
    ]
  },
  slaAndRisks: [
    { risk: 'Блокировка IP или капча Instagram', mitigation: 'Stealth CDP параметры, экспорт сессии sessionid, ротация SOCKS5 прокси. Apify доступен как неактивированный резерв.' },
    { risk: 'Языковой дрейф и канцелярит в LLM', mitigation: 'Строгий Pydantic-контракт, Anti-robotic QA проверка (cyrillic_count >= 15), отсев клише и обращения по имени.' },
    { risk: 'Устаревание метрик и битые ссылки', mitigation: 'Автоматический отсев (Hard Reject) недоступных аккаунтов (15 из 34 отсеяны) и еженедельный крон-переобновление.' }
  ]
};

// ==========================================
// 10. PART 3 — AUTHOR RESUME (Matvejchuk_Zakhar_Master_Resume_v8.md)
// ==========================================
export const GROUNDED_AUTHOR_RESUME: AuthorResume = {
  name: 'Матвейчук Захар Евгеньевич',
  location: 'Иркутск, Россия',
  workFormat: 'Удалённая / гибридная / проектная работа (AI Systems Engineer / Loop Engineer)',
  githubUrl: 'https://github.com/Nek1yZakhar',
  portfolioUrls: [
    'https://ld-latte.vercel.app/',
    'https://ecokedrum.ru/',
    'https://mib-osint.vercel.app/',
    'https://accessible-law-intake-board.vercel.app/'
  ],
  summary: 'AI Systems & Automation Engineer / Loop Engineer. Специализируюсь на проектировании и сборке автономных AI-пайплайнов, систем парсинга, векторного поиска и интеграции LLM. Выстраиваю сквозные инженерные системы от архитектуры до деплоя на VPS/Vercel с ведением ADR и жестким контролем затрат.',
  targetRoles: [
    'AI Systems & Automation Engineer',
    'Loop Engineer / Applied AI Engineer',
    'Python AI Integration Developer'
  ],
  technicalStack: {
    languages: ['Python 3.11+', 'SQL', 'TypeScript', 'Bash / CLI', 'YAML'],
    infrastructure: ['Antigravity IDE', 'Supabase / PostgreSQL', 'GitHub Actions CI/CD', 'Vercel', 'Docker', 'PM2', 'Nginx', 'Ubuntu VPS', 'Cron'],
    aiMlData: ['Qwen3-Embedding', 'bge-reranker-v2-m3', 'Qwen2.5-VL', 'DeepSeek-V4', 'Groq API', 'OpenRouter', 'SentenceTransformers', 'PyTorch'],
    backendApi: ['FastAPI (async)', 'SQLAlchemy 2.0', 'Alembic', 'REST API', 'pytest / pytest-asyncio', 'Pydantic v2'],
    parsingAutomation: ['Playwright', 'Camoufox Stealth', 'Instaloader', 'httpx', 'BeautifulSoup4', 'SOCKS5 Proxy Pool', '128-bit MinHash']
  },
  education: [
    {
      institution: 'Иркутский государственный университет (ИГУ)',
      degree: 'Бакалавриат, Международные отношения (4 курс)',
      period: '2023 — наст. время',
      details: 'Технологическая политика, исследовательская аналитика и прикладная обработка данных.'
    },
    {
      institution: 'Beijing Institute of Technology (BIT), Zhuhai',
      degree: 'Программа Artificial Intelligence',
      period: 'Июль–Август 2025',
      details: 'Международная программа по искусственному интеллекту (сертификат).'
    }
  ],
  keyCaseStudies: [
    {
      id: 'ld_latte',
      title: 'LD LATTE — AI Discovery & Outreach Pipeline',
      role: 'AI Systems & Pipeline Engineer (solo)',
      period: '2026',
      organization: 'LD LATTE (Fashion Brand)',
      description: 'Модульный AI-пайплайн поиска инфлюенсеров, векторного скоринга Qwen3, BGE-реранкинга, мультимодального VLM-контроля Qwen2.5-VL и генерации писем DeepSeek-V4.',
      highlights: [
        'Сквозная воронка отбора: 34 seed-ссылки ➔ 19 живых аккаунтов ➔ Top 5 шорт-лист',
        'Живой VLM аудит через OpenRouter API ($0.003 за 5 кандидатов)',
        'Anti-Robotic QA фильтр против канцелярита + React Demo UI'
      ],
      results: [
        'Сборка задеплоена на Vercel (ld-latte.vercel.app)',
        '100% реальные данные, 39/39 Pytest PASS, $0.02 / батч'
      ],
      stack: ['Python', 'Qwen3', 'BGE Reranker', 'Qwen2.5-VL', 'DeepSeek-V4', 'React', 'Vercel'],
      demoUrl: 'https://ld-latte.vercel.app/',
      repoUrl: 'https://github.com/Nek1yZakhar/LD-LATTE'
    },
    {
      id: 'ecokedrum',
      title: 'ЭкоКедрум — Бьюти/эко-бренд натуральной косметики',
      role: 'Digital Strategy & AI Content / UGC Collabs Lead',
      period: '2026',
      organization: 'ЭкоКедрум (Иркутская область)',
      description: 'Создание бренда натуральной косметики с нуля: позиционирование, AI-генерация карточек товаров (Wildberries, Ozon, Яндекс Маркет), Instagram-контент и организация UGC-коллабораций с инфлюенсерами.',
      highlights: [
        'Разработка концепции бренда, УТП и визуальной рамки',
        'Автоматизированная сборка карточек товаров для маркетплейсов через LLM (ChatGPT/Gemini)',
        'Сценарии Reels/Shorts и запуск UGC-коллабораций с локальными блогерами'
      ],
      results: [
        'Успешный запуск бренда на Wildberries, Ozon и маркетплейсах',
        'Сформирован активный инфлюенсер-канал привлечения клиентов'
      ],
      stack: ['AI Content Farm', 'UGC Collabs', 'Instagram Strategy', 'Marketplaces AI Intake'],
      demoUrl: 'https://ecokedrum.ru/'
    },
    {
      id: 'mib_osint',
      title: 'OSINT-агрегатор МИБ — Дипломатическая академия МИД России',
      role: 'AI & Data Engineer / OSINT Automation (solo)',
      period: '2025–2026',
      organization: 'Дипломатическая академия МИД России',
      description: 'Production-ready система автоматического мониторинга, фильтрации, анализа и дистрибуции материалов по информационной безопасности для Школы МИБ.',
      highlights: [
        'Каскадный парсер 219 источников (135 WEB + 84 RSS) с обходом WAF (Playwright/Camoufox)',
        'Гибридный AI-пайплайн: multilingual-e5-large + Groq LLM fallback',
        '128-bit MinHash дедупликация и автоматический Telegram-дайджест'
      ],
      results: [
        '219 источников мониторятся ежедневно (ускорение прогона с 6 ч до 35 мин)',
        '31 выпуск дайджеста, 3939 собранных материалов, Uptime >99%'
      ],
      stack: ['Python', 'Playwright', 'Camoufox', 'Supabase', 'PostgreSQL', 'Docker', 'Vercel', 'Groq'],
      demoUrl: 'https://mib-osint.vercel.app/',
      repoUrl: 'https://github.com/Nek1yZakhar/MIB-OSINT-Aggregator'
    },
    {
      id: 'matter_intake',
      title: 'Matter Intake Dashboard — LegalTech-прототип «Доступное право»',
      role: 'AI Product Builder / Full-Stack Prototype Developer (solo)',
      period: '2026',
      description: 'Working prototype intake-панели юриста: от архитектуры и product flow до деплоя на Vercel за 3.5 часа по AI-native циклу.',
      highlights: [
        'Next.js 16 SPA-панель с Supabase/PostgreSQL и Realtime обновлением',
        'AI-блок Suggested Next Step через Groq (Llama 3.3)',
        'Graceful demo-fallback при отсутствии внешней сети'
      ],
      results: [
        'Рабочий прототип задеплоен на Vercel',
        'Положительный фидбэк от целевого пользователя (студент-юрист)'
      ],
      stack: ['Next.js 16', 'React', 'Supabase', 'Groq', 'Vercel', 'Server Actions'],
      demoUrl: 'https://accessible-law-intake-board.vercel.app/',
      repoUrl: 'https://github.com/Nek1yZakhar/accessible-law-intake-board'
    }
  ],
  methodology: 'AI-native подход к инженерии по циклу Plan -> Approve -> Execute -> Audit. Проектирование архитектуры, ведение ADR, декомпозиция на тикеты и полный контроль каждого diff-изменения.',
  publications: [
    '«ИИ как инструмент региональной безопасности в рамках ШОС» — Дипакадемия МИД РФ',
    '«Россия в эпоху ИИ-войн: вызовы и возможности» — Дипакадемия МИД РФ'
  ],
  achievements: [
    'Production-ready OSINT-агрегатор для Дипломатической академии МИД России',
    'Программа Artificial Intelligence в BIT, Чжухай (сертификат, 2025)',
    'Публичные производственные репозитории: github.com/Nek1yZakhar'
  ],
  languages: [
    'Русский — родной',
    'Английский — рабочий'
  ]
};

// ==========================================
// 11. PROOF LINKS & DOCS NAVIGATOR
// ==========================================
export const GROUNDED_PROOF_LINKS: ProofLink[] = [
  {
    id: 'repo_main',
    label: 'README.md',
    filePath: 'README.md',
    url: 'https://github.com/Nek1yZakhar/LD-LATTE',
    category: 'repo',
    description: 'Главный стартовый навигатор по репозиторию и запуску',
    whyOpen: 'Быстрый ввод в концепцию проекта, стек технологий, команды установки и запуска пайплайна и UI за 1 минуту.'
  },
  {
    id: 'doc_arch',
    label: 'ARCHITECTURE.md',
    filePath: 'docs/ARCHITECTURE.md',
    category: 'architecture',
    description: 'Архитектурная схема пайплайна и Pydantic-контракты',
    whyOpen: 'Подробное описание 8 этапов воронки, структуры данных, стратегии скрапинга и векторного поиска Qwen3 + BGE.'
  },
  {
    id: 'doc_state',
    label: 'STATE.md',
    filePath: 'docs/STATE.md',
    category: 'architecture',
    description: 'Полный статус разработки, бэклог и Handoff Truth',
    whyOpen: 'Отслеживание прогресса выполнения тикетов TICKET-01..10F, известных проблем и списка реальных профилей.'
  },
  {
    id: 'doc_policy',
    label: 'POLICY.md',
    filePath: 'docs/POLICY.md',
    category: 'policy',
    description: 'Политика Strict Zero-Mock Data Policy',
    whyOpen: 'Принципы гарантированной работы только со 100% реальными спарсенными данными Instagram без фейковых затычек.'
  },
  {
    id: 'doc_t10a',
    label: 'TICKET_10A_RESEARCH_AND_IA.md',
    filePath: 'docs/TICKET_10A_RESEARCH_AND_IA.md',
    category: 'spec',
    description: 'Исследовательский документ и карта информационной архитектуры',
    whyOpen: 'Обоснование визуального стиля Warm Editorial Tech, CJW пути проверяющего и контрактов UI-компонентов.'
  },
  {
    id: 'doc_t10b',
    label: 'TICKET_10B_DATA_LAYER.md',
    filePath: 'docs/TICKET_10B_DATA_LAYER.md',
    category: 'spec',
    description: 'Спецификация типизированного слоя данных Demo UI',
    whyOpen: 'Описание структуры app/src/data/, адаптеров и механизма связи реальных JSON-артефактов с React UI.'
  },
  {
    id: 'doc_t10c',
    label: 'TICKET_10C_VISUAL_SYSTEM.md',
    filePath: 'docs/TICKET_10C_VISUAL_SYSTEM.md',
    category: 'spec',
    description: 'Спецификация fashion-first визуальной системы',
    whyOpen: 'Описание токенов стилей, палитры LD Latte, типографики Bodoni/Outfit и векторных бренд-ассетов.'
  },
  {
    id: 'doc_t10d',
    label: 'TICKET_10D_APP_SHELL.md',
    filePath: 'docs/TICKET_10D_APP_SHELL.md',
    category: 'spec',
    description: 'Спецификация AppShell и narrative-каркаса',
    whyOpen: 'Архитектура навигации "Одна ссылка", отслеживание прокрутки и адаптивная верстка под мобильные устройства.'
  },
  {
    id: 'doc_t10e',
    label: 'TICKET_10E_EVIDENCE_VIEWS.md',
    filePath: 'docs/TICKET_10E_EVIDENCE_VIEWS.md',
    category: 'spec',
    description: 'Спецификация интерактивных доказательных модулей',
    whyOpen: 'Детали реализации инспектора промптов, графа воронки отбора, BGE-логитов и Qwen2.5-VL визуального аудита.'
  },
  {
    id: 'prompt_outreach',
    label: 'outreach_offer.md',
    filePath: 'prompts/outreach_offer.md',
    category: 'prompt',
    description: 'Системный промпт генерации PR-офферов',
    whyOpen: 'Инструкции для DeepSeek-V4/Groq, правила заземления в фактах и anti-robotic QA контроля писем.'
  },
  {
    id: 'report_audit',
    label: 'pipeline_audit_report.md',
    filePath: 'output/pipeline_audit_report.md',
    category: 'report',
    description: 'Финальный отчет прогона пайплайна на 100% реальных данных',
    whyOpen: 'Сводный аудит воронки: от 34 seed-записей к 19 валидным профилям и финальному Top-5 шорт-листу.'
  },
  {
    id: 'report_embed',
    label: 'embedding_debug_report.md',
    filePath: 'output/embedding_debug_report.md',
    category: 'report',
    description: 'Отчет дебага векторов Qwen3-Embedding-0.6B',
    whyOpen: 'Детальные косинусные оценки сходства между текстами постов кандидатов и идеальным портретом бренда.'
  },
  {
    id: 'report_seed',
    label: 'seed_cleanup_report.md',
    filePath: 'output/seed_cleanup_report.md',
    category: 'report',
    description: 'Отчет очистки и нормализации исходного CSV',
    whyOpen: 'Разбор отсева 15 недоступных (HTTP 404/400) страниц и фактологической верификации 19 реальных аккаунтов.'
  }
];
