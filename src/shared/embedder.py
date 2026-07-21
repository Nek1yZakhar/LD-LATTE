import os
import logging
from typing import List, Union
import torch
from sentence_transformers import SentenceTransformer
from src.shared.config import settings

logger = logging.getLogger(__name__)

class LocalEmbedder:
    def __init__(self):
        self._model: Optional[SentenceTransformer] = None

    @property
    def model(self) -> SentenceTransformer:
        if self._model is None:
            # Set cache directory variables before model download/load
            if settings.local_models_cache_dir:
                cache_dir = os.path.abspath(settings.local_models_cache_dir)
                os.makedirs(cache_dir, exist_ok=True)
                os.environ["HF_HOME"] = cache_dir
                os.environ["SENTENCE_TRANSFORMERS_HOME"] = cache_dir
                logger.info(f"Setting local HF cache directory to: {cache_dir}")
            else:
                cache_dir = None

            device = "cuda" if torch.cuda.is_available() else "cpu"
            logger.info(f"Loading embedding model '{settings.embedding_model_name}' on device '{device}'...")
            
            # Initialize sentence transformer model
            self._model = SentenceTransformer(
                settings.embedding_model_name,
                device=device,
                cache_folder=cache_dir
            )
            logger.info("Embedding model loaded successfully.")
        return self._model

    def get_embeddings(self, texts: Union[str, List[str]]) -> List[List[float]]:
        """
        Generate 1024-dimensional embeddings for the input text or list of texts.
        """
        if not texts:
            return []
        
        input_list = [texts] if isinstance(texts, str) else texts
        logger.info(f"Generating embeddings for {len(input_list)} text items.")
        
        embeddings = self.model.encode(input_list)
        # Convert numpy array to list of floats
        return embeddings.tolist()
