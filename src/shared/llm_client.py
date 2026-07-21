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
    ) -> str:
        """
        Generate chat completion text using primary Groq provider with fallback to OpenRouter.
        """
        # Try Groq first
        if settings.groq_api_key:
            try:
                logger.info(f"Attempting LLM generation via Groq using model: {settings.groq_default_model}")
                
                # Check for json mode compatibility
                extra_args = {}
                if response_format and response_format.get("type") == "json_object":
                    extra_args["response_format"] = response_format

                chat_completion = self.groq_client.chat.completions.create(
                    messages=messages,
                    model=settings.groq_default_model,
                    temperature=temperature,
                    **extra_args
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq API execution failed: {e}. Trying fallback to OpenRouter.")

        # Fallback to OpenRouter
        if settings.openrouter_api_key:
            try:
                logger.info(f"Attempting LLM generation via OpenRouter using model: {settings.openrouter_default_model}")
                
                extra_args = {}
                if response_format and response_format.get("type") == "json_object":
                    extra_args["response_format"] = response_format

                chat_completion = self.openrouter_client.chat.completions.create(
                    messages=messages,
                    model=settings.openrouter_default_model,
                    temperature=temperature,
                    **extra_args
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenRouter fallback API execution failed: {e}")
                raise RuntimeError(f"Both Groq and OpenRouter failed. Final exception: {e}")
        
        raise RuntimeError("No LLM providers available. Ensure either GROQ_API_KEY or OPENROUTER_API_KEY is configured.")
