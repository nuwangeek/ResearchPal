# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResearchPal is an AI-powered system for curating arXiv research papers via a structured pipeline and enabling voice-based chat with selected papers.

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
