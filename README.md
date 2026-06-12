# Sophia – AI Mastery Coach

**Master any topic through structured skill trees, interactive lessons, and progress tracking.**

---

## Why Sophia?

Most AI learning tools generate static courses — a wall of text, a list of bullet points, maybe a quiz at the end. Sophia is different.

Sophia doesn't just *tell* you about a topic. It models genuine cognitive mastery. Give it any subject, and Sophia will:

1. **Research** the topic using an AI provider of your choice, generating a structured breakdown of core concepts.
2. **Build a dependency-aware skill tree** — a directed graph where each node represents a concept, and edges represent prerequisites. You can't learn advanced topics before mastering the foundations.
3. **Test understanding with adaptive questions** — Sophia evaluates your answers with constructive, contextual feedback, not just right/wrong scoring.
4. **Track progress** across every node in the skill tree, from "not started" to "in progress" to "mastered."

This approach mirrors an unsolved problem in AI research: **how do you evaluate whether an AI agent truly understands something?** Sophia demonstrates a framework for measuring mastery — not just recall. The same principles that help a human learn can help us audit what an AI model has actually internalized.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Plain Python, FastAPI |
| **AI Providers** | DeepSeek, OpenAI (GPT-4o), Anthropic (Claude), Google Gemini |
| **Frontend** | Next.js |
| **Design System** | Custom CSS tokens (`tokens.css`), custom React UI components (`ui.jsx`) |

No heavy frameworks, no unnecessary abstractions. Just clean, modular code.

---

## Project Structure

```
sophia/
├── backend/
│   ├── providers.py         # AI provider abstraction (DeepSeek, OpenAI, Anthropic, Gemini)
│   ├── api.py               # Unified AI client interface
│   ├── skill_tree.py        # Skill tree generation logic
│   ├── lesson.py            # Lesson generation logic
│   ├── topic_manager.py     # Topic CRUD & progress tracking
│   ├── main.py              # FastAPI app & route definitions
│   └── data/                # (gitignored) Skill tree files, topics.json
├── frontend/
│   ├── app/
│   │   ├── page.js          # Start page with topic & provider selection
│   │   ├── skilltree/       # Interactive skill tree visualization
│   │   ├── lesson/          # Lesson & answer evaluation UI
│   │   └── dashboard/       # Progress dashboard
│   └── components/
│       └── ui.jsx           # Reusable UI components
├── .env.example             # All provider keys & model configuration
└── README.md
```

> **Note:** The `backend/data/` directory is gitignored. It contains generated skill tree files and the `topics.json` registry, which are created at runtime.

---

## Quickstart

### Prerequisites

- Python 3.10+
- At least one API key from: [DeepSeek](https://platform.deepseek.com/), [OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI](https://aistudio.google.com/)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/matthislck/sophia.git
cd sophia

# 2. Create a .env file (see .env.example for all options)
#    At minimum, set one API key and the default provider:
echo "AI_PROVIDER=deepseek" > .env
echo "DEEPSEEK_API_KEY=your_key_here" >> .env

# 3. Navigate to the backend
cd backend

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the development server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive Swagger documentation.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## AI Provider Configuration

Sophia supports **4 AI providers** that can be selected per request or set globally:

| Provider | Env Key | Default Model | SDK |
|----------|---------|---------------|-----|
| **DeepSeek** | `DEEPSEEK_API_KEY` | `deepseek-chat` | `requests` (OpenAI-compatible) |
| **OpenAI** | `OPENAI_API_KEY` | `gpt-4o-mini` | `openai` |
| **Anthropic** | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` | `anthropic` |
| **Gemini** | `GEMINI_API_KEY` | `gemini-2.0-flash` | `google-generativeai` |

### Configuration via `.env`

```env
# Default provider (deepseek | openai | anthropic | gemini)
AI_PROVIDER=deepseek

# DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Gemini
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.0-flash
```

### Per-Request Provider Selection

Every API endpoint accepts an optional `provider` field. The frontend lets you pick the provider on the start page, and it's passed through all subsequent requests.

```json
// POST /api/generate-skilltree
{ "topic": "machine learning", "provider": "anthropic" }
```

```json
// POST /api/evaluate
{
  "topic": "machine learning",
  "node_title": "Neural Networks",
  "user_answer": "...",
  "provider": "openai"
}
```

If no provider is specified, the system falls back to the `AI_PROVIDER` env var, then `deepseek`.

---

## API Endpoints

### Health Check

```
GET /api/health
```

**Response:**
```json
{ "status": "ok" }
```

---

### Generate Skill Tree

```
POST /api/generate-skilltree
```

Generate a dependency-aware skill tree for any topic. Returns 5–8 core concepts with prerequisite relationships.

**Request:**
```json
{ "topic": "machine learning" }
```

**Response:**
```json
{
  "nodes": [
    {
      "id": 1,
      "title": "Supervised Learning",
      "description": "Learning from labeled training data to predict outcomes.",
      "depends_on": []
    },
    {
      "id": 2,
      "title": "Neural Networks",
      "description": "Computing systems inspired by biological neural networks.",
      "depends_on": [1]
    }
  ]
}
```

---

### Get a Lesson

```
GET /api/lesson?topic=machine%20learning&node_title=Neural%20Networks
```

Generate a concise learning unit for a specific concept within a topic.

**Response:**
```json
{
  "explanation": "A neural network is a computing system...",
  "code": "import numpy as np\n...",
  "question": "What is the role of the activation function in a neural network?"
}
```

---

### Evaluate an Answer

```
POST /api/evaluate
```

Submit a user's answer to a comprehension question and receive constructive, contextual feedback.

**Request:**
```json
{
  "topic": "machine learning",
  "node_title": "Neural Networks",
  "user_answer": "An activation function introduces non-linearity..."
}
```

**Response:**
```json
{
  "feedback": "Great start! You correctly identified that activation functions introduce non-linearity. Consider also mentioning that they enable the network to learn complex patterns beyond simple linear transformations."
}
```

---

### Topic Management

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/topics` | List all topics with progress summaries |
| `POST` | `/api/topics` | Create a new topic (generates skill tree) |
| `GET` | `/api/topics/{topic_id}` | Get a topic with its skill tree and progress |
| `DELETE` | `/api/topics/{topic_id}` | Delete a topic and its skill tree |
| `POST` | `/api/topics/{topic_id}/progress` | Update progress status of a node |

**Create a topic:**
```json
// POST /api/topics
{ "topic": "machine learning" }
```

**Update progress:**
```json
// POST /api/topics/machine_learning/progress
{ "node_id": "2", "status": "mastered" }
```

Valid statuses: `not_started`, `in_progress`, `mastered`.

---

## Roadmap

- [x] **Backend API** — Skill tree generation, lessons, evaluation, topic management
- [x] **Multi-Provider Support** — DeepSeek, OpenAI, Anthropic, Gemini
- [x] **Frontend Integration** — Next.js app with interactive skill tree visualization and lesson UI
- [ ] **Spaced Repetition Scheduler** — Optimize review intervals based on mastery data
- [ ] **User Authentication** — Persistent profiles, multi-topic progress across sessions
- [ ] **Research Study** — Apply Sophia's mastery model to evaluate understanding in AI agents, contributing to the open problem of measuring genuine comprehension in LLMs

---

Building tools to measure mastery — in humans and machines.
