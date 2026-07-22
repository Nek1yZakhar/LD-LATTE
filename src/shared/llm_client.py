import logging
from typing import Optional, List, Dict, Any
from groq import Groq
from openai import OpenAI
from src.shared.config import settings

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self):
        self._groq_client: Optional[Groq] = None
        self._openrouter_client: Optional[OpenAI] = None

    @property
    def groq_client(self) -> Groq:
        if self._groq_client is None:
            if not settings.groq_api_key:
                raise ValueError("GROQ_API_KEY is not set in environment settings.")
            self._groq_client = Groq(api_key=settings.groq_api_key)
        return self._groq_client

    @property
    def openrouter_client(self) -> OpenAI:
        if self._openrouter_client is None:
            if not settings.openrouter_api_key:
                raise ValueError("OPENROUTER_API_KEY is not set in environment settings.")
            self._openrouter_client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.openrouter_api_key,
            )
        return self._openrouter_client

    def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        response_format: Optional[Dict[str, Any]] = None,
        groq_model: Optional[str] = None,
        openrouter_models: Optional[List[str]] = None,
    ) -> str:
        """
        Generate chat completion text using primary Groq provider with fallback to OpenRouter models.
        """
        target_groq_model = groq_model or settings.groq_default_model
        fallback_models = openrouter_models or [settings.openrouter_default_model]

        # Try Groq first
        if settings.groq_api_key:
            try:
                logger.info(f"Attempting LLM generation via Groq using model: {target_groq_model}")
                
                # Check for json mode compatibility
                extra_args = {}
                if response_format and response_format.get("type") == "json_object":
                    extra_args["response_format"] = response_format

                chat_completion = self.groq_client.chat.completions.create(
                    messages=messages,
                    model=target_groq_model,
                    temperature=temperature,
                    **extra_args
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq API execution failed ({target_groq_model}): {e}. Trying fallback to OpenRouter.")

        # Fallback to OpenRouter
        if settings.openrouter_api_key:
            last_err = None
            for model_name in fallback_models:
                try:
                    logger.info(f"Attempting LLM generation via OpenRouter using model: {model_name}")
                    
                    extra_args = {}
                    if response_format and response_format.get("type") == "json_object":
                        extra_args["response_format"] = response_format

                    chat_completion = self.openrouter_client.chat.completions.create(
                        messages=messages,
                        model=model_name,
                        temperature=temperature,
                        **extra_args
                    )
                    return chat_completion.choices[0].message.content
                except Exception as e:
                    logger.warning(f"OpenRouter model {model_name} failed: {e}")
                    last_err = e
            
            raise RuntimeError(f"Both Groq and OpenRouter models failed. Last exception: {last_err}")
        
        raise RuntimeError("No LLM providers available. Ensure either GROQ_API_KEY or OPENROUTER_API_KEY is configured.")

