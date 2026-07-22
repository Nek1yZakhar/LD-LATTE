import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    openrouter_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    
    # Local Model Configurations
    embedding_model_name: str = "Qwen/Qwen3-Embedding-0.6B"
    reranker_model_name: str = "BAAI/bge-reranker-v2-m3"
    local_models_cache_dir: str = "./models/cache"
    
    # LLM Client Model Configurations
    groq_default_model: str = "llama-3.1-8b-instant"
    openrouter_default_model: str = "qwen/qwen-2.5-7b-instruct"

    
    # Scraper Configurations
    scraper_api_key: Optional[str] = None
    scraper_provider: str = "instaloader"  # options: instaloader, playwright, mock
    scraper_proxy: Optional[str] = None
    instagram_username: Optional[str] = None
    instagram_password: Optional[str] = None
    instagram_session_id: Optional[str] = None
    instagram_session_path: str = "./data/instagram_session.json"
    cache_ttl_hours: int = 24

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate settings singleton
settings = Settings()
