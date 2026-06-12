"""
Provider abstraction layer for Sophia.

Supports multiple AI APIs:
  - DeepSeek (default, via OpenAI-compatible endpoint)
  - OpenAI
  - Anthropic (Claude)
  - Google Gemini

Each provider implements the same `ask(prompt, system, temperature) -> str` interface.
"""

import os
import json
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv("../.env")


# ---------------------------------------------------------------------------
# Abstract base
# ---------------------------------------------------------------------------

class AIProvider(ABC):
    """Abstract base for an AI provider."""

    @abstractmethod
    def ask(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        """Send a prompt and return the response text."""
        ...


# ---------------------------------------------------------------------------
# DeepSeek (OpenAI-compatible)
# ---------------------------------------------------------------------------

class DeepSeekProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

    def ask(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        if not self.api_key:
            raise Exception("DEEPSEEK_API_KEY not found in .env file.")

        import requests

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        response = requests.post(self.api_url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


# ---------------------------------------------------------------------------
# OpenAI
# ---------------------------------------------------------------------------

class OpenAIProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def ask(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        if not self.api_key:
            raise Exception("OPENAI_API_KEY not found in .env file.")

        from openai import OpenAI

        client = OpenAI(api_key=self.api_key)

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content


# ---------------------------------------------------------------------------
# Anthropic (Claude)
# ---------------------------------------------------------------------------

class AnthropicProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.model = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

    def ask(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        if not self.api_key:
            raise Exception("ANTHROPIC_API_KEY not found in .env file.")

        from anthropic import Anthropic

        client = Anthropic(api_key=self.api_key)

        message = client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=system or None,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
        )
        return message.content[0].text


# ---------------------------------------------------------------------------
# Google Gemini
# ---------------------------------------------------------------------------

class GeminiProvider(AIProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    def ask(self, prompt: str, system: str = "", temperature: float = 0.3) -> str:
        if not self.api_key:
            raise Exception("GEMINI_API_KEY not found in .env file.")

        import google.generativeai as genai

        genai.configure(api_key=self.api_key)

        generation_config = {
            "temperature": temperature,
        }

        model = genai.GenerativeModel(
            model_name=self.model,
            system_instruction=system or None,
            generation_config=generation_config,
        )

        response = model.generate_content(prompt)
        return response.text


# ---------------------------------------------------------------------------
# Provider registry
# ---------------------------------------------------------------------------

PROVIDER_REGISTRY: dict[str, type[AIProvider]] = {
    "deepseek": DeepSeekProvider,
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "gemini": GeminiProvider,
}

DEFAULT_PROVIDER = os.getenv("AI_PROVIDER", "deepseek")


def get_provider(name: str | None = None) -> AIProvider:
    """
    Factory: return an AIProvider instance by name.

    Args:
        name: One of "deepseek", "openai", "anthropic", "gemini".
              Falls back to the AI_PROVIDER env var, then "deepseek".

    Returns:
        An instance of the requested provider.

    Raises:
        ValueError: If the provider name is unknown.
    """
    provider_name = (name or DEFAULT_PROVIDER).lower()
    if provider_name not in PROVIDER_REGISTRY:
        raise ValueError(
            f"Unknown provider '{provider_name}'. "
            f"Available: {', '.join(PROVIDER_REGISTRY)}"
        )
    return PROVIDER_REGISTRY[provider_name]()
