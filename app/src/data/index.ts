/**
 * LD LATTE Demo UI - Data Layer Central Entrypoint
 * @file app/src/data/index.ts
 * @description Single source of export for types, static raw content, adapters, and section content mapping.
 */

// Export all types & interfaces
export * from './types';

// Export grounded static datasets
export {
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
} from './content/pipeline_data';

// Export adapters, helpers, and section content mapper
export {
  sanitizeFilePath,
  formatDisplayName,
  normalizeCandidates,
  getShortlistCandidates,
  getCandidateByUsername,
  formatFollowersCount,
  formatPercentScore,
  getSectionContentMap
} from './adapters';
