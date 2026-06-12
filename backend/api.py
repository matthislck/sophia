"""
Sophia API – unified interface for all AI providers.

Usage:
    from api import sophia_ask
    response = sophia_ask("Hello", provider="openai")

The provider can be set via:
  - The `provider` argument
  - The `AI_PROVIDER` environment variable (deepseek | openai | anthropic | gemini)
  - Defaults to "deepseek"
"""

import os
from dotenv import load_dotenv
from providers import get_provider

load_dotenv("../.env")


def sophia_ask(
    prompt: str,
    system: str = "",
    temperature: float = 0.3,
    provider: str | None = None,
) -> str:
    """
    Send a prompt to the configured AI provider and return the response text.

    Args:
        prompt: The user prompt to send.
        system: Optional system message for context.
        temperature: Sampling temperature (default 0.3).
        provider: One of "deepseek", "openai", "anthropic", "gemini".
                  Falls back to AI_PROVIDER env var, then "deepseek".

    Returns:
        The content string from the API response.

    Raises:
        Exception: If the API key is missing or the request fails.
        ValueError: If the provider name is unknown.
    """
    instance = get_provider(provider)
    return instance.ask(prompt, system=system, temperature=temperature)
