# -*- coding: utf-8 -*-
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SeedProfile(BaseModel):
    """Normalized profile entry from seed CSV / JSON."""
    id: int
    raw_url: str
    username: str
    is_valid: bool = True
    error_message: Optional[str] = None

class PostInfo(BaseModel):
    """Basic structure for a recent social media post."""
    caption: str = ""
    date: str = ""
    likes: int = 0
    comments: int = 0

class EnrichedSeedProfile(BaseModel):
    """Enriched Instagram seed profile data contract matching ARCHITECTURE.md."""
    username: str
    biography: str = ""
    followers_count: int = 0
    posts_count: int = 0
    engagement_rate: float = 0.0
    recent_posts: List[PostInfo] = Field(default_factory=list)
    activity_recency: int = 0  # Days since last post
    language: str = "ru"
    niche: str = "fashion"
    caption_tone: str = "friendly"
    sponsorship_saturation: str = "low"  # low, medium, high
    fetched_at: Optional[str] = None  # ISO format timestamp for snapshot cache TTL

class IdealBloggerProfile(BaseModel):
    """Synthetic machine-readable portrait of the ideal influencer for LD Latte."""
    target_niches: List[str] = Field(default_factory=list)
    estimated_er_min: float = Field(default=0.0)
    key_themes: List[str] = Field(default_factory=list)
    preferred_tone_of_voice: str = Field(default="friendly")
    sponsorship_saturation_max: str = Field(default="low")
    activity_recency_max_days: int = Field(default=30)
    rationale: str = Field(default="")

class CandidateProfile(BaseModel):
    """Candidate profile data contract matching ARCHITECTURE.md for Discovery and downstream scoring."""
    username: str
    biography: str = ""
    followers_count: int = 0
    engagement_rate: float = 0.0
    recent_posts: List[PostInfo] = Field(default_factory=list)
    language: str = "ru"
    niche: str = "fashion"
    caption_tone: str = "friendly"
    product_talk_style: str = "outfit_breakdown"
    sponsorship_saturation: str = "low"  # low, medium, high
    activity_recency: int = 0  # Days since last post
    contact_info: Optional[str] = None

class CandidateFeatureScore(BaseModel):
    """Candidate profile score based on deterministic feature rules matching ARCHITECTURE.md."""
    username: str
    niche_match_score: float = Field(default=0.0, ge=0.0, le=1.0)
    er_match_score: float = Field(default=0.0, ge=0.0, le=1.0)
    recency_match_score: float = Field(default=0.0, ge=0.0, le=1.0)
    sponsorship_match_score: float = Field(default=0.0, ge=0.0, le=1.0)
    language_match_score: float = Field(default=0.0, ge=0.0, le=1.0)

class CandidateRerankResult(BaseModel):
    """Embedding similarity and combined scoring result for a candidate matching ARCHITECTURE.md."""
    username: str
    semantic_similarity: float = Field(default=0.0)
    features_score: float = Field(default=0.0)
    cross_encoder_score: float = Field(default=0.0)  # Explicitly 0.0 until TICKET-08 reranking
    composite_score: float = Field(default=0.0)
    similarity_breakdown: Dict[str, Any] = Field(default_factory=dict)

class FinalShortlistEntry(BaseModel):
    """Final shortlist entry with visual sanity verification matching ARCHITECTURE.md."""
    username: str
    rerank_result: CandidateRerankResult
    vlm_sanity_passed: bool = Field(default=True)
    vlm_aesthetic_notes: str = Field(default="")
    grounding_facts: List[str] = Field(default_factory=list)




