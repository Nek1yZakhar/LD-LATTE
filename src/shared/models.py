# -*- coding: utf-8 -*-
from typing import List, Optional
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
