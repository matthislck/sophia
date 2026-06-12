import json
import os
from datetime import datetime, timezone
from pathlib import Path

from skill_tree import generate_skill_tree

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

DATA_DIR = Path(__file__).resolve().parent / "data"
SKILL_TREES_DIR = DATA_DIR / "skill_trees"
TOPICS_FILE = DATA_DIR / "topics.json"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
SKILL_TREES_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _derive_id(name: str) -> str:
    """Derive a topic ID from a name: lowercase, spaces → underscores."""
    return name.lower().replace(" ", "_")


def _now_iso() -> str:
    """Return current UTC datetime as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def load_topics() -> dict:
    """
    Load topics from topics.json.

    Returns:
        A dict mapping topic_id → topic object.

    Raises:
        FileNotFoundError: If topics.json does not exist.
        json.JSONDecodeError: If topics.json contains invalid JSON.
    """
    if not TOPICS_FILE.exists():
        return {}

    with open(TOPICS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Normalise: always work with a dict internally
    if isinstance(data, list):
        return {item["id"]: item for item in data}
    return data


def save_topics(topics: dict) -> None:
    """
    Save the topics dict to topics.json as a JSON array.

    Args:
        topics: A dict mapping topic_id → topic object.
    """
    # Sort by created_at for deterministic output
    items = sorted(topics.values(), key=lambda t: t.get("created_at", ""))
    with open(TOPICS_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


def list_topics() -> list:
    """
    Return a list of topic summaries, each with id, name, created_at,
    last_accessed, and progress_percent.
    """
    topics = load_topics()
    result = []
    for t in topics.values():
        progress = t.get("progress", {})
        total = len(progress)
        mastered = sum(1 for s in progress.values() if s == "mastered")
        progress_percent = round((mastered / total) * 100, 1) if total > 0 else 0.0

        result.append({
            "id": t["id"],
            "name": t["name"],
            "created_at": t["created_at"],
            "last_accessed": t["last_accessed"],
            "progress_percent": progress_percent,
        })
    return result


def create_topic(topic_name: str, provider: str | None = None) -> dict:
    """
    Create a new topic: generate its skill tree, persist it, and add an entry
    to topics.json.

    Args:
        topic_name: The human-readable name of the topic.
        provider: Optional AI provider name (deepseek, openai, anthropic, gemini).

    Returns:
        The newly created topic object (including the loaded skill tree).

    Raises:
        ValueError: If the topic already exists.
        Exception: If skill tree generation fails.
    """
    topic_id = _derive_id(topic_name)

    topics = load_topics()
    if topic_id in topics:
        raise ValueError(f"Topic '{topic_name}' already exists (id: {topic_id}).")

    # Generate the skill tree – this also saves it to disk
    skill_tree, _filename = generate_skill_tree(topic_name, provider=provider)

    # Build progress dict from the skill tree nodes
    nodes = skill_tree.get("nodes", [])
    progress = {str(node["id"]): "not_started" for node in nodes}

    now = _now_iso()
    topic_obj = {
        "id": topic_id,
        "name": topic_name,
        "created_at": now,
        "last_accessed": now,
        "progress": progress,
    }

    topics[topic_id] = topic_obj
    save_topics(topics)

    # Return the full topic object including the skill tree
    return {**topic_obj, "skill_tree": skill_tree}


def get_topic(topic_id: str) -> dict:
    """
    Retrieve a topic by its ID, including its loaded skill tree.

    Args:
        topic_id: The topic identifier.

    Returns:
        The topic object with an added "skill_tree" key.

    Raises:
        KeyError: If the topic does not exist.
        FileNotFoundError: If the skill tree file is missing.
    """
    topics = load_topics()
    if topic_id not in topics:
        raise KeyError(f"Topic '{topic_id}' not found.")

    topic = dict(topics[topic_id])  # shallow copy

    # Load the skill tree from disk
    skill_tree_file = SKILL_TREES_DIR / f"{topic['name']}_skilltree.json"
    if not skill_tree_file.exists():
        raise FileNotFoundError(
            f"Skill tree file not found: {skill_tree_file}"
        )

    with open(skill_tree_file, "r", encoding="utf-8") as f:
        topic["skill_tree"] = json.load(f)

    return topic


def delete_topic(topic_id: str) -> None:
    """
    Delete a topic: remove its entry from topics.json and delete its
    skill tree file.

    Args:
        topic_id: The topic identifier.

    Raises:
        KeyError: If the topic does not exist.
    """
    topics = load_topics()
    if topic_id not in topics:
        raise KeyError(f"Topic '{topic_id}' not found.")

    topic = topics.pop(topic_id)

    # Delete the skill tree file
    skill_tree_file = SKILL_TREES_DIR / f"{topic['name']}_skilltree.json"
    if skill_tree_file.exists():
        skill_tree_file.unlink()

    save_topics(topics)


def update_progress(topic_id: str, node_id: str, status: str) -> dict:
    """
    Update the progress status of a single node in a topic.

    Valid statuses: not_started, in_progress, mastered.

    Args:
        topic_id: The topic identifier.
        node_id: The node identifier (string or int – will be converted to str).
        status: One of "not_started", "in_progress", "mastered".

    Returns:
        The updated topic object (including skill tree).

    Raises:
        KeyError: If the topic does not exist.
        ValueError: If the status is invalid or the node_id is unknown.
    """
    valid_statuses = {"not_started", "in_progress", "mastered"}
    if status not in valid_statuses:
        raise ValueError(
            f"Invalid status '{status}'. Must be one of: {', '.join(sorted(valid_statuses))}."
        )

    topics = load_topics()
    if topic_id not in topics:
        raise KeyError(f"Topic '{topic_id}' not found.")

    topic = topics[topic_id]
    node_id_str = str(node_id)

    if node_id_str not in topic["progress"]:
        raise ValueError(
            f"Node '{node_id}' is not part of topic '{topic_id}'. "
            f"Valid nodes: {list(topic['progress'].keys())}"
        )

    # Update status and timestamp
    topic["progress"][node_id_str] = status
    topic["last_accessed"] = _now_iso()

    save_topics(topics)

    # Return the full topic with skill tree
    return get_topic(topic_id)
