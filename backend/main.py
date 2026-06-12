import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load .env from the project root (one level up from /backend)
load_dotenv("../.env")

from api import sophia_ask
from skill_tree import generate_skill_tree
from lesson import generate_lesson
from topic_manager import (
    list_topics,
    create_topic,
    get_topic,
    delete_topic,
    update_progress,
)

app = FastAPI(title="Sophia Backend", version="1.0.0")

# CORS – allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class SkillTreeRequest(BaseModel):
    topic: str
    provider: str | None = None  # optional: deepseek, openai, anthropic, gemini

class EvaluateRequest(BaseModel):
    topic: str
    node_title: str
    user_answer: str
    provider: str | None = None  # optional

class CreateTopicRequest(BaseModel):
    topic: str
    provider: str | None = None  # optional

class UpdateProgressRequest(BaseModel):
    node_id: str
    status: str

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-skilltree")
def generate_skilltree_endpoint(req: SkillTreeRequest):
    """
    Generate a skill tree for the given topic.
    Returns the skill-tree JSON (dict with a "nodes" key).
    """
    data, _filename = generate_skill_tree(req.topic, provider=req.provider)
    return data


@app.get("/api/lesson")
def lesson_endpoint(
    topic: str = Query(..., description="The overall topic"),
    node_title: str = Query(..., description="The specific concept to teach"),
    provider: str | None = Query(None, description="AI provider to use"),
):
    """
    Generate a learning unit for a specific concept within a topic.
    Returns a JSON object with keys "explanation", "code", and "question".
    """
    data = generate_lesson(topic, node_title, provider=provider)
    return data


@app.post("/api/evaluate")
def evaluate_endpoint(req: EvaluateRequest):
    """
    Evaluate a user's answer for a given concept.
    Returns JSON: { "feedback": "..." }
    """
    prompt = (
        f'You are an AI tutor. The user is learning about "{req.node_title}" '
        f'as part of the topic "{req.topic}".\n\n'
        f'User answer: "{req.user_answer}"\n\n'
        "Evaluate the answer. Provide constructive feedback, point out any "
        "misunderstandings, and suggest improvements. Keep it concise (2-4 sentences)."
    )
    feedback = sophia_ask(prompt, temperature=0.3, provider=req.provider)
    return {"feedback": feedback}


# ---------------------------------------------------------------------------
# Topic Management Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/topics")
def api_list_topics():
    """List all topics with their progress summaries."""
    return list_topics()


@app.post("/api/topics", status_code=201)
def api_create_topic(req: CreateTopicRequest):
    """
    Create a new topic: generates a skill tree and initialises progress tracking.
    Returns 409 if the topic already exists.
    """
    try:
        result = create_topic(req.topic, provider=req.provider)
        return result
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@app.get("/api/topics/{topic_id}")
def api_get_topic(topic_id: str):
    """
    Get a topic by its ID, including its skill tree and progress.
    Returns 404 if the topic does not exist.
    """
    try:
        return get_topic(topic_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.delete("/api/topics/{topic_id}", status_code=204)
def api_delete_topic(topic_id: str):
    """
    Delete a topic and its skill tree file.
    Returns 404 if the topic does not exist.
    """
    try:
        delete_topic(topic_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/topics/{topic_id}/progress")
def api_update_progress(topic_id: str, req: UpdateProgressRequest):
    """
    Update the progress status of a node in a topic.
    Body: { "node_id": "...", "status": "not_started|in_progress|mastered" }
    Returns 404 if the topic does not exist, 400 if the status is invalid.
    """
    try:
        result = update_progress(topic_id, req.node_id, req.status)
        return result
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
