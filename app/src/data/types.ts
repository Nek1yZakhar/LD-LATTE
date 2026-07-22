/**
 * LD LATTE Demo UI - Core Data Layer Types
 * @file app/src/data/types.ts
 * @description Strictly typed interfaces for all UI-ready entities in LD Latte Demo UI.
 * Grounded in real pipeline artifacts (data/processed/*, output/*, prompts/*, Matvejchuk_Zakhar_Master_Resume_v8.md).
 */

// ==========================================
// 1. HERO & PROOF METRICS
// ==========================================
export interface ProofMetrics {
  totalSeedProfiles: number;
  activeRealProfiles: number;
  unreachableProfilesRemoved: number;
  zeroMockPolicyEnforced: boolean;
  unitTestsPassCount: number;
  unitTestsTotalCount: number;
  costPerCandidateUsd: number;
  executionPipelineStatus: '100% LIVE REAL DATA';
}

// ==========================================
// 2. PIPELINE FLOW & NODES
// ==========================================
export interface PipelineNode {
  id: string;
  stageNumber: number;
  name: string;
  secondaryName?: string;
  moduleFile: string;
  inputContract: string;
  outputContract: string;
  description: string;
  status: 'DONE' | 'IN_PROGRESS' | 'PENDING';
  isVlmNode?: boolean;
}

// ==========================================
// 3. IDEAL BLOGGER PROFILE (portrait.json)
// ==========================================
export interface IdealBloggerProfile {
  target_niches: string[];
  estimated_er_min: number;
  key_themes: string[];
  preferred_tone_of_voice: string;
  sponsorship_saturation_max: string;
  activity_recency_max_days: number;
  rationale: string;
}

// ==========================================
// 4. CANDIDATES & SCORING BREAKDOWN
// ==========================================
export interface PartialScores {
  niche_match: number;
  er_match: number;
  recency_match: number;
  sponsorship_match: number;
  language_match: number;
}

export interface FeatureWeights {
  niche: number;
  er: number;
  sponsorship: number;
  recency: number;
  language: number;
}

export interface RerankWeights {
  semantic: number;
  features: number;
  cross_encoder: number;
}

export interface SimilarityBreakdown {
  partial_scores: PartialScores;
  feature_weights: FeatureWeights;
  alpha: number;
  note?: string;
  raw_cross_encoder_score?: number;
  normalized_cross_encoder_score?: number;
  rerank_weights?: RerankWeights;
}

export interface CandidateRerankScore {
  username: string;
  semantic_similarity: number;
  features_score: number;
  cross_encoder_score: number;
  composite_score: number;
  similarity_breakdown: SimilarityBreakdown;
}

export interface EnrichedProfileData {
  username: string;
  biography: string;
  followers_count: number;
  posts_count: number;
  engagement_rate: number;
  recent_posts: string[];
  activity_recency: number;
  language: string;
  niche: string;
  caption_tone: string;
  sponsorship_saturation: string;
  fetched_at: string;
}

export interface ShortlistFinalEntry {
  username: string;
  rerank_result: CandidateRerankScore;
  vlm_sanity_passed: boolean;
  vlm_aesthetic_notes: string;
  grounding_facts: string[];
}

/**
 * Merged UI-ready candidate entity combining raw enriched data, scores, VLM verdicts, and offers.
 */
export interface NormalizedCandidate {
  username: string;
  displayName: string; // Hydrated first name or username
  biography: string;
  followersCount: number;
  postsCount: number;
  engagementRate: number;
  niche: string;
  language: string;
  captionTone: string;
  sponsorshipSaturation: string;
  
  // Pipeline Scores
  semanticSimilarity: number;
  featuresScore: number;
  crossEncoderScore: number;
  compositeScore: number;
  similarityBreakdown: SimilarityBreakdown;
  
  // VLM & Shortlist Status
  isShortlist: boolean;
  vlmSanityPassed: boolean;
  vlmAestheticNotes: string;
  groundingFacts: string[];
  
  // Outreach Offer (if generated)
  barterOffer?: BarterOffer;
}

// ==========================================
// 5. BARTER OFFERS & PROMPT INSPECTOR
// ==========================================
export interface BarterOffer {
  username: string;
  subject: string;
  body: string;
  language: string;
  personalized_elements: string[];
  grounding_facts: string[];
}

export interface OutreachPromptInspector {
  promptFilePath: string;
  systemPromptTemplate: string;
  qaRules: {
    antiRoboticCheck: string;
    cyrillicMinCount: number;
    factGroundingEnforced: boolean;
    fallbackRule: string;
  };
}

// ==========================================
// 6. PART 2 — AUTOMATION BLUEPRINT
// ==========================================
export interface ScrapingHierarchyStep {
  level: number;
  technology: string;
  role: string;
  triggerCondition: string;
}

export interface CostCalculationItem {
  component: string;
  costPer1kCandidatesUsd: number;
  description: string;
}

export interface Part2AutomationBlueprint {
  title: string;
  summary: string;
  systemArchitectureNodes: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  scrapingHierarchy: ScrapingHierarchyStep[];
  proxyStrategy: {
    type: string;
    protocol: string;
    publicSafeDescription: string;
  };
  economics: {
    batchSize: number;
    totalCostUsd: number;
    items: CostCalculationItem[];
  };
  slaAndRisks: Array<{
    risk: string;
    mitigation: string;
  }>;
}

// ==========================================
// 7. PART 3 — AUTHOR RESUME & PROJECTS
// ==========================================
export interface ProjectCaseStudy {
  id: string;
  title: string;
  role: string;
  period: string;
  organization?: string;
  description: string;
  highlights: string[];
  results: string[];
  stack: string[];
  demoUrl?: string;
  repoUrl?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  details: string;
}

export interface AuthorResume {
  name: string;
  location: string;
  workFormat: string;
  githubUrl: string;
  portfolioUrls: string[];
  summary: string;
  targetRoles: string[];
  technicalStack: {
    languages: string[];
    infrastructure: string[];
    aiMlData: string[];
    backendApi: string[];
    parsingAutomation: string[];
  };
  education: EducationItem[];
  keyCaseStudies: ProjectCaseStudy[];
  methodology: string;
  publications: string[];
  achievements: string[];
  languages: string[];
}

// ==========================================
// 8. PROOF LINKS & DOCS NAVIGATOR
// ==========================================
export interface ProofLink {
  id: string;
  label: string;
  filePath: string;
  url?: string;
  category: 'architecture' | 'policy' | 'data' | 'report' | 'prompt' | 'repo' | 'spec';
  description: string;
  whyOpen?: string;
}

// ==========================================
// 9. SECTION CONTENT MAP REGISTRY
// ==========================================
export interface SectionContentMap {
  hero: {
    metrics: ProofMetrics;
    headline: string;
    subheadline: string;
  };
  pipeline: {
    nodes: PipelineNode[];
  };
  idealPortrait: IdealBloggerProfile;
  candidates: {
    all: NormalizedCandidate[];
    shortlist: NormalizedCandidate[];
  };
  offers: {
    items: BarterOffer[];
    promptInspector: OutreachPromptInspector;
  };
  part2Automation: Part2AutomationBlueprint;
  part3Resume: AuthorResume;
  proofLinks: ProofLink[];
}
