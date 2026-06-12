import json
import os
import re

from api import sophia_ask

SYSTEM_PROMPT = (
    "You are Sophia, an AI that organizes learning paths into skill trees. "
    "Always respond with valid JSON only, no markdown formatting."
)

USER_PROMPT_TEMPLATE = (
    'Create a skill tree for the topic "{topic}". '
    "The skill tree should contain 5 to 8 core concepts (nodes), each with: "
    '"id" (integer), "title" (string), "description" (string), '
    'and "depends_on" (list of integer IDs of prerequisite nodes, empty list if none). '
    "Return ONLY a JSON object with a single key \"nodes\" containing the list of nodes. "
    "No markdown, no code fences, no extra text."
)


def generate_skill_tree(topic: str, provider: str | None = None) -> tuple:
    """
    Generate a skill tree for the given topic using the configured AI provider.

    Args:
        topic: The topic to generate a skill tree for.
        provider: Optional provider name (deepseek, openai, anthropic, gemini).

    Returns:
        A tuple (dict, str) where the dict has a "nodes" key containing the
        list of skill nodes, and the str is the filename the tree was saved to.

    Raises:
        ValueError: If the response cannot be parsed as valid JSON.
    """
    prompt = USER_PROMPT_TEMPLATE.format(topic=topic)
    raw = sophia_ask(prompt, system=SYSTEM_PROMPT, temperature=0.3, provider=provider)

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

    # Save to backend/data/skill_trees/{topic}_skilltree.json
    filename = f"{topic}_skilltree.json"
    save_path = os.path.join("data", "skill_trees", filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return data, filename
