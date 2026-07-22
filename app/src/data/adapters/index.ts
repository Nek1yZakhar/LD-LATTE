/**
 * LD LATTE Demo UI - Data Layer Adapters & Sanitizers
 * @file app/src/data/adapters/index.ts
 * @description Safe adapter functions, content normalization, path sanitization, and section mappers.
 */

import type {
  NormalizedCandidate,
  SectionContentMap,
  BarterOffer,
  ShortlistFinalEntry,
  CandidateRerankScore,
  EnrichedProfileData
} from '../types';

import {
  GROUNDED_PROOF_METRICS,
  PIPELINE_NODES,
  GROUNDED_IDEAL_PORTRAIT,
  RAW_SEED_ENRICHED,
  RAW_CANDIDATES_RERANKED,
  RAW_SHORTLIST_FINAL,
  RAW_BARTER_OFFERS,
  GROUNDED_OUTREACH_PROMPT_INSPECTOR,
  GROUNDED_PART2_AUTOMATION,
  GROUNDED_AUTHOR_RESUME,
  GROUNDED_PROOF_LINKS
} from '../content/pipeline_data';

// ==========================================
// 1. PUBLIC-SAFE PATH & PROXY SANITIZATION
// ==========================================

/**
 * Sanitizes absolute Windows file paths (e.g. C:\Users\Admin\Desktop\...) into clean relative repository paths.
 */
export function sanitizeFilePath(rawPath: string): string {
  if (!rawPath) return '';
  let cleaned = rawPath.replace(/\\/g, '/');
  const desktopMatch = cleaned.match(/.*\/LD%20LATTE\/(.*)/i) || cleaned.match(/.*\/LD LATTE\/(.*)/i);
  if (desktopMatch && desktopMatch[1]) {
    return desktopMatch[1];
  }
  return cleaned.replace(/^([a-zA-Z]:)?\/Users\/[^\/]+\/[^\/]+\//, '');
}

/**
 * Normalizes username handles into friendly display names when personal names are known.
 */
export function formatDisplayName(username: string, biography?: string): string {
  const map: Record<string, string> = {
    'jd_cosm': 'Юлия Life',
    'dddinaaaaaa': 'Дина',
    'llaurraiiam': 'Лаура',
    'bazhenova_alenaa': 'Алена Баженова',
    'mishandkatya': 'Миша и Кейт',
    'daria_grogulenko': 'Дарья',
    'kristi_naxodka': 'Кристина',
    'v.m.beauty_blog': 'Лера',
    'zari.ishikhovaa': 'Зарина',
    'janestetsiura': 'Jane Stetsiura',
    'armlilitka': 'Лилит Агаханян',
    'aida.mixx': 'Aida Bazyan',
    'kotova.live': 'Юля',
    'krrazalia': 'Разалия',
    '_kate_bruni': 'Katsiaryna Tsepliakova',
    'juliar_r': 'Ульяна',
    'anetboss_': 'Анет',
    'shalafaeva.al': 'shalafaeva.al'
  };

  if (map[username.toLowerCase()]) {
    return map[username.toLowerCase()];
  }
  return `@${username}`;
}

// ==========================================
// 2. CANDIDATE NORMALIZATION ADAPTER
// ==========================================

/**
 * Merges raw enriched profiles, rerank scores, shortlist entries, and barter offers into clean NormalizedCandidate[] entries.
 */
export function normalizeCandidates(): NormalizedCandidate[] {
  const rerankMap = new Map<string, CandidateRerankScore>();
  RAW_CANDIDATES_RERANKED.forEach(item => {
    rerankMap.set(item.username.toLowerCase(), item);
  });

  const shortlistMap = new Map<string, ShortlistFinalEntry>();
  RAW_SHORTLIST_FINAL.forEach(item => {
    shortlistMap.set(item.username.toLowerCase(), item);
  });

  const offerMap = new Map<string, BarterOffer>();
  RAW_BARTER_OFFERS.forEach(item => {
    offerMap.set(item.username.toLowerCase(), item);
  });

  const enrichedMap = new Map<string, EnrichedProfileData>();
  RAW_SEED_ENRICHED.forEach(item => {
    enrichedMap.set(item.username.toLowerCase(), item);
  });

  // Build entries from raw reranked scores (which represents active candidates)
  const normalized: NormalizedCandidate[] = RAW_CANDIDATES_RERANKED.map(rerank => {
    const usernameLower = rerank.username.toLowerCase();
    const enriched = enrichedMap.get(usernameLower);
    const shortlistEntry = shortlistMap.get(usernameLower);
    const offer = offerMap.get(usernameLower);

    const bio = enriched?.biography || `Instagram profile for ${rerank.username}`;
    const followers = enriched?.followers_count || 0;
    const posts = enriched?.posts_count || 0;
    const er = enriched?.engagement_rate || 0.0;
    const niche = enriched?.niche && enriched.niche !== 'None' ? enriched.niche : 'lifestyle';
    const lang = enriched?.language || 'ru';
    const tone = enriched?.caption_tone && enriched.caption_tone !== 'None' ? enriched.caption_tone : 'friendly';
    const sponsorship = enriched?.sponsorship_saturation || 'low';

    return {
      username: rerank.username,
      displayName: formatDisplayName(rerank.username, bio),
      biography: bio,
      followersCount: followers,
      postsCount: posts,
      engagementRate: er,
      niche,
      language: lang,
      captionTone: tone,
      sponsorshipSaturation: sponsorship,

      // Scores
      semanticSimilarity: rerank.semantic_similarity,
      featuresScore: rerank.features_score,
      crossEncoderScore: rerank.cross_encoder_score,
      compositeScore: rerank.composite_score,
      similarityBreakdown: rerank.similarity_breakdown,

      // Shortlist & VLM
      isShortlist: !!shortlistEntry,
      vlmSanityPassed: shortlistEntry?.vlm_sanity_passed ?? false,
      vlmAestheticNotes: shortlistEntry?.vlm_aesthetic_notes || 'Pending visual audit',
      groundingFacts: shortlistEntry?.grounding_facts || [
        `Target profile in ${niche} niche`,
        `Language: ${lang}`
      ],

      // Offer
      barterOffer: offer
    };
  });

  // Sort by compositeScore descending
  return normalized.sort((a, b) => b.compositeScore - a.compositeScore);
}

// ==========================================
// 3. UI CONVENIENCE HELPERS
// ==========================================

export function getShortlistCandidates(): NormalizedCandidate[] {
  return normalizeCandidates().filter(c => c.isShortlist);
}

export function getCandidateByUsername(username: string): NormalizedCandidate | undefined {
  return normalizeCandidates().find(c => c.username.toLowerCase() === username.toLowerCase());
}

export function formatFollowersCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000)}k`;
  }
  return count.toString();
}

export function formatPercentScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

// ==========================================
// 4. CENTRAL SECTION CONTENT MAPPER
// ==========================================

/**
 * Returns the unified SectionContentMap containing all content for site sections.
 */
export function getSectionContentMap(): SectionContentMap {
  const allCandidates = normalizeCandidates();
  const shortlistCandidates = allCandidates.filter(c => c.isShortlist);

  return {
    hero: {
      metrics: GROUNDED_PROOF_METRICS,
      headline: 'Модульный AI-конвейер поиска и аутрича fashion-блогеров для LD Latte',
      subheadline: 'Разделение ответственности, мультиязычные эмбеддинги Qwen3, кросс-энкодер BGE-Reranker, визуальный VLM-контроль и 100% заземление на фактах.'
    },
    pipeline: {
      nodes: PIPELINE_NODES
    },
    idealPortrait: GROUNDED_IDEAL_PORTRAIT,
    candidates: {
      all: allCandidates,
      shortlist: shortlistCandidates
    },
    offers: {
      items: RAW_BARTER_OFFERS,
      promptInspector: GROUNDED_OUTREACH_PROMPT_INSPECTOR
    },
    part2Automation: GROUNDED_PART2_AUTOMATION,
    part3Resume: GROUNDED_AUTHOR_RESUME,
    proofLinks: GROUNDED_PROOF_LINKS
  };
}
