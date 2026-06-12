import os
import requests
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
API_URL = "https://api.deepseek.com/v1/chat/completions"


def sophia_ask(prompt: str, system: str = "", temperature: float = 0.3) -> str:
    """
    Send a prompt to the DeepSeek API and return the response text.

    Args:
        prompt: The user prompt to send.
        system: Optional system message for context.
        temperature: Sampling temperature (default 0.3).

    Returns:
        The content string from the API response.

    Raises:
        Exception: If the API key is missing or the request fails.
    """
    if not DEEPSEEK_API_KEY:
        raise Exception("DEEPSEEK_API_KEY not found in .env file.")

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": temperature,
    }

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()

    data = response.json()
    return data["choices"][0]["message"]["content"]
