# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResearchPal is an AI-powered system for curating arXiv research papers via a structured pipeline and enabling voice-based chat with selected papers.


## Workflow Orchestration
    
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don’t keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user, update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until the mistake rate drops
- Review lessons at the session start for the relevant project

### 4. Verification Bef ore Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: “Would a staff engineer approve this?”
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask, “Is there a more elegant way?”
- If a fix feels hacky: “Knowing everything I know now, implement the elegant solution.”
- Skip this for simple, obvious fixes — don’t over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don’t ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching is required from the user
- Go fix failing CI tests without being told how

## Task Management
- Plan First: Write a plan for tasks/todo.md with checkable items
- Verify Plan: Check in before starting implementation
- Track Progress: Mark items complete as you go
- Explain Changes: High-level summary at each step
- Document Results: Add review section to tasks/todo.md
- Capture Lessons: Update tasks/lessons.md after corrections

## Core Principles
- Simplicity First: Make every change as simple as possible. Impact minimal code.
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.
- Minimal Impact: Changes should only touch what’s necessary. Avoid introducing bugs.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Python 3.12+, FastAPI, Pydantic, uv |
| LLM | OpenAI / Anthropic / Azure OpenAI (swappable) |
| Vector DB | Qdrant (swappable) |
| Database | PostgreSQL |
| Data Pipeline | Airflow |
| Infrastructure | Docker, Docker Compose |

## Architecture

Monorepo with two apps under `apps/`. Follows **Pragmatic Clean Architecture** — layers are virtual concepts, not rigid folder structures.

### GUI (`apps/gui/src/research_pal/`)

Next.js App Router frontend. Path alias `@/*` maps to the project root.

```bash
# Run from apps/gui/src/research_pal/
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint (eslint-config-next with core-web-vitals + typescript)
```

### Backend (`apps/backend/src/research_pal/`)

Python FastAPI backend (not yet implemented). Will use uv for dependency management.

## Four Virtual Layers & Dependency Rule

Dependencies always point inward: **Serving → Infrastructure → Application → Domain**

| Layer | Purpose | Backend packages | Frontend dirs |
|-------|---------|-----------------|---------------|
| Domain | Pure business logic, no external deps | `entities/`, `nodes/` | `types/` |
| Application | Orchestrates domain into workflows | `workflows/`, `use_cases/`, `builders/` | `hooks/`, `stores/` |
| Infrastructure | External system implementations | `llm/`, `vectorstore/`, `database/`, `storage/` | `lib/` |
| Serving | Exposes app to outside world | `api/`, `schemas/` | `app/`, `components/` |

Inner layers must never import from outer layers (e.g., `entities/` never imports from `api/` or `llm/`).

## Key Design Patterns

- **Interface-based DI**: Define abstract base classes in the application layer, implement in infrastructure, inject via factory pattern in `builders/`
- **Organize by feature**: Co-locate related code (e.g., `nodes/retriever/` contains both `prompts.py` and `node.py`) rather than scattering by file type
- **Flat hierarchy**: No rigid `domain/`, `application/`, `infrastructure/` wrapper folders — packages sit directly under `src/research_pal/`

## API Communication Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| REST | CRUD operations | `POST /api/documents` |
| SSE | LLM streaming | `POST /api/chat/stream` |
| WebSocket | Real-time updates | `ws://api/ws` |

## Code Style

- **Python**: Ruff (formatter + linter), Pyright, Google docstrings, 88 char line length
- **TypeScript**: ESLint + Prettier, functional components, named exports
- Prefer composition over inheritance
