import os
import sys
# Enable fast Rust-based Hugging Face downloader
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

import logging
from src.shared.config import settings
from src.shared.llm_client import LLMClient
from src.shared.embedder import LocalEmbedder
from src.shared.reranker import LocalReranker

# Setup basic logging to stdout
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def test_config():
    logger.info("=== STEP 1: Testing Configuration Loader ===")
    logger.info(f"Embedding Model: {settings.embedding_model_name}")
    logger.info(f"Reranker Model: {settings.reranker_model_name}")
    logger.info(f"Local Cache Dir: {settings.local_models_cache_dir}")
    logger.info(f"Groq API Key Configured: {'YES' if settings.groq_api_key else 'NO'}")
    logger.info(f"OpenRouter API Key Configured: {'YES' if settings.openrouter_api_key else 'NO'}")
    logger.info("Configuration loaded successfully.\n")
    return True

def test_llm_client():
    logger.info("=== STEP 2: Testing LLM Client Connection ===")
    if not settings.groq_api_key and not settings.openrouter_api_key:
        logger.warning("Skipping LLM test: neither GROQ_API_KEY nor OPENROUTER_API_KEY is configured in .env.")
        return True

    try:
        client = LLMClient()
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Respond with exactly the word: SUCCESS"}
        ]
        response = client.generate(messages=messages, temperature=0.1)
        response_clean = response.strip().upper()
        logger.info(f"LLM Response received: '{response_clean}'")
        if "SUCCESS" in response_clean:
            logger.info("LLM Client connection check: PASSED\n")
            return True
        else:
            logger.error(f"Unexpected response content: '{response}'")
            return False
    except Exception as e:
        logger.error(f"LLM Client connection check failed: {e}\n")
        return False

def test_embedder():
    logger.info("=== STEP 3: Testing Local Embedder ===")
    try:
        embedder = LocalEmbedder()
        sample_text = "Vintage leather jackets and minimalist aesthetics"
        embeddings = embedder.get_embeddings(sample_text)
        
        logger.info(f"Generated embedding count: {len(embeddings)}")
        if not embeddings:
            logger.error("No embeddings returned.")
            return False
            
        vector_len = len(embeddings[0])
        logger.info(f"Embedding vector dimension: {vector_len}")
        if vector_len == 1024:
            logger.info("Local Embedder check: PASSED\n")
            return True
        else:
            logger.error(f"Expected 1024 dimensions, got {vector_len}")
            return False
    except Exception as e:
        logger.error(f"Local Embedder check failed: {e}\n")
        return False

def test_reranker():
    logger.info("=== STEP 4: Testing Local Reranker ===")
    try:
        reranker = LocalReranker()
        query = "high end fashion designer"
        docs = [
            "A minimalist fashion wardrobe showing beige trench coats and premium leather accessories.",
            "A tutorial on how to install local database drivers on Linux servers."
        ]
        
        scores = reranker.compute_scores(query, docs)
        logger.info(f"Reranker scores: {scores}")
        
        if len(scores) != 2:
            logger.error(f"Expected 2 scores, got {len(scores)}")
            return False
            
        # The fashion doc should have a higher score than the database doc
        if scores[0] > scores[1]:
            logger.info(f"Relevance scoring sanity: {scores[0]} > {scores[1]} (PASSED)")
            logger.info("Local Reranker check: PASSED\n")
            return True
        else:
            logger.error(f"Sanity check failed: Fashion doc score {scores[0]} is not greater than Linux doc score {scores[1]}")
            return False
    except Exception as e:
        logger.error(f"Local Reranker check failed: {e}\n")
        return False

def main():
    logger.info("Starting TICKET-03 Smoke Tests...\n")
    
    results = {
        "Configuration": test_config(),
        "LLM Client": test_llm_client(),
        "Embedder": test_embedder(),
        "Reranker": test_reranker()
    }
    
    logger.info("=== SMOKE TEST SUMMARY ===")
    all_passed = True
    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        logger.info(f"{test_name}: {status}")
        if not passed:
            all_passed = False
            
    if all_passed:
        logger.info("\nALL CHECKS PASSED. Stack Lock verified successfully.")
        sys.exit(0)
    else:
        logger.error("\nSOME CHECKS FAILED. Please review the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
