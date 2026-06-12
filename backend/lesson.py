import json
import re

from api import sophia_ask

SYSTEM_PROMPT = (
    "You are Sophia, an AI tutor that creates concise learning units. "
    "Always respond with valid JSON only, no markdown formatting."
)

USER_PROMPT_TEMPLATE = (
    'Create a learning unit for the concept "{node_title}" '
    'as part of the topic "{topic}". '
    "Return a JSON object with exactly three keys:\n"
    '- "explanation": a clear, concise explanation of the concept (2-4 sentences).\n'
    '- "code": a short Python code example that illustrates the concept.\n'
    '- "question": a single comprehension question to test understanding.\n'
    "Return ONLY the JSON object. No markdown, no code fences, no extra text."
)


def generate_lesson(topic: str, node_title: str) -> dict:
    """
    Generate a learning unit for a specific concept within a topic.

    Args:
        topic: The overall topic.
        node_title: The title of the specific concept to teach.

    Returns:
        A dictionary with keys "explanation", "code", and "question".

    Raises:
        ValueError: If the response cannot be parsed as valid JSON.
    """
    prompt = USER_PROMPT_TEMPLATE.format(topic=topic, node_title=node_title)
    raw = sophia_ask(prompt, system=SYSTEM_PROMPT, temperature=0.3)

    # Remove markdown code blocks if present
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Failed to parse JSON from API response.\n"
            f"Error: {e}\n"
            f"Raw response:\n{raw}"
        )

    return data
