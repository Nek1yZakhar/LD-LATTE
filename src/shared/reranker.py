import os
import logging
from typing import List, Tuple, Union
import torch
from sentence_transformers import CrossEncoder
from src.shared.config import settings

logger = logging.getLogger(__name__)

class LocalReranker:
    def __init__(self):
        self._model: Optional[CrossEncoder] = None

    @property
    def model(self) -> CrossEncoder:
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
            logger.info(f"Loading reranker model '{settings.reranker_model_name}' on device '{device}'...")
            
            # Initialize CrossEncoder model
            self._model = CrossEncoder(
                settings.reranker_model_name,
                device=device,
                max_length=1024
            )
            logger.info("Reranker model loaded successfully.")
        return self._model

    def compute_scores(self, query: str, documents: List[str]) -> List[float]:
        """
        Compute relevance scores for a query against a list of documents.
        Returns a list of float scores. Higher score means higher relevance.
        """
        if not documents:
            return []
        
        logger.info(f"Computing reranker scores for query against {len(documents)} documents.")
        pairs = [[query, doc] for doc in documents]
        
        scores = self.model.predict(pairs)
        
        # Format return value to standard python float list
        if isinstance(scores, (float, int)):
            return [float(scores)]
        return [float(s) for s in scores]
