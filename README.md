# ResearchPal
An AI-powered system for curating arXiv research papers via a structured pipeline and enabling voice-based chat with selected papers. Built using Claude Code and aligned with pragmatic clean architecture and modern engineering best practices.

## Architecture Overview

This project follows **Pragmatic Clean Architecture** - treating architectural layers as virtual concepts, not rigid folder structures. The goal is code that is easy to change, test, and understand.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 frontend using React 19, TypeScript, and Tailwind CSS v4 |
| Backend | Python 3.12+, FastAPI, Pydantic, uv |
| LLM | OpenAI / Anthropic / Azure OpenAI (swappable) |
| Vector DB | Qdrant (swappable) |
| Database | PostgreSQL |
| DataPipeline | Airflow
| Infrastructure | Docker, Docker Compose |


### Sample Repository Structure

```
.
├── apps/
│   ├── gui/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── research_pal/            # Next.js App Router pages
│   │   │   ├── components/     # React components (by feature)
│   │   │   ├── hooks/          # Custom hooks (use cases)
│   │   │   ├── lib/            # External integrations (API client)
│   │   │   ├── stores/         # State management (Zustand)
│   │   │   ├── types/          # TypeScript types (domain entities)
│   │   │   └── utils/          # Utility functions
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── api/                    # Python backend
│       ├── src/
│       │   └── research_pal/       # Main Python package
│       │       ├── entities/   # Domain: Pydantic models
│       │       ├── nodes/      # Domain: AI logic units
│       │       ├── workflows/  # Application: Orchestration
│       │       ├── use_cases/  # Application: Business logic
│       │       ├── builders/   # Application: Dependency injection
│       │       ├── llm/        # Infrastructure: LLM providers
│       │       ├── vectorstore/# Infrastructure: Vector DBs
│       │       ├── database/   # Infrastructure: PostgreSQL
│       │       ├── storage/    # Infrastructure: File storage
│       │       ├── api/        # Serving: FastAPI routes
│       │       └── schemas/    # Serving: API schemas
│       ├── tests/
│       ├── configs/
│       ├── pyproject.toml
│       └── Dockerfile
│
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## The Four Virtual Layers

### 1. Domain Layer (The "What")
Pure business logic with no external dependencies.

**Backend (`entities/`, `nodes/`):**
- Pydantic models representing business objects
- AI nodes: self-contained units with prompt + logic
- No imports from infrastructure or serving layers

**Frontend (`types/`):**
- TypeScript interfaces for domain entities
- Shared types across components

### 2. Application Layer (The "How")
Orchestrates domain elements into workflows.

**Backend (`workflows/`, `use_cases/`, `builders/`):**
- Workflow orchestration (LangGraph, etc.)
- Business use case implementations
- Dependency injection via factory pattern

**Frontend (`hooks/`, `stores/`):**
- Custom hooks encapsulating use cases
- State management coordinating UI logic

### 3. Infrastructure Layer (The "External Dependencies")
Concrete implementations of external systems.

**Backend (`llm/`, `vectorstore/`, `database/`, `storage/`):**
- LLM providers (OpenAI, Anthropic, Azure)
- Vector stores (Qdrant, Pinecone)
- Database repositories
- File storage (local, S3)
- All implement interfaces defined in inner layers

**Frontend (`lib/`):**
- API client with fetch wrapper
- Authentication provider
- Analytics integration

### 4. Serving Layer (The "Interface")
Exposes application to the outside world.

**Backend (`api/`, `schemas/`):**
- FastAPI routes and middleware
- Request/response schemas
- WebSocket handlers

**Frontend (`app/`, `components/`):**
- Next.js pages and layouts
- React components organized by feature

---

## Dependency Rule

```
Dependencies ALWAYS point inward:

Serving → Infrastructure → Application → Domain

✅ api/routes/chat.py imports from use_cases/chat.py
✅ use_cases/chat.py imports from entities/message.py
❌ entities/message.py NEVER imports from api/ or llm/
```

---

## Key Design Patterns

### 1. Interface-Based Dependency Injection

```python
# Define interface in application layer
class BaseLLM(ABC):
    @abstractmethod
    async def invoke(self, messages: list[Message]) -> Response: ...

# Implement in infrastructure layer
class OpenAIModel(BaseLLM):
    async def invoke(self, messages: list[Message]) -> Response: ...

# Inject via factory
class ComponentFactory:
    def create_llm(self) -> BaseLLM:
        return OpenAIModel() if config.provider == "openai" else AnthropicModel()
```

### 2. Organize by Feature (Actionability)

```
# ✅ Good: Related code together
nodes/
├── retriever/
│   ├── prompts.py
│   └── node.py
├── generator/
│   ├── prompts.py
│   └── node.py

# ❌ Bad: Scattered by type
prompts/
├── retriever.py
├── generator.py
nodes/
├── retriever.py
├── generator.py
```

### 3. Flat Hierarchy (No Rigid Layer Folders)

```
# ✅ Good: Flat, clear purpose
src/app_name/
├── entities/
├── nodes/
├── workflows/
├── llm/
├── api/

# ❌ Bad: Rigid layer folders
src/app_name/
├── domain/
│   ├── entities/
│   └── nodes/
├── application/
├── infrastructure/
```

---

## Development Commands

```bash
# Installation
make install              # Install all dependencies

# Development
make dev                  # Start all services (API + Web + DB)
make dev-api              # Start only Python backend
make dev-web              # Start only Next.js frontend

# Testing
make test                 # Run all tests
make test-api             # Run Python tests
make test-web             # Run frontend tests

# Code Quality
make lint                 # Lint all code
make format               # Format all code
make typecheck            # Run type checking

# Docker
make docker-build         # Build all images
make docker-up            # Start with Docker Compose
make docker-down          # Stop all containers

# Database
make db-migrate           # Run migrations
make db-reset             # Reset database
```

---

## API Communication Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| REST | CRUD operations | `POST /api/documents` |
| SSE | LLM streaming | `POST /api/chat/stream` |
| WebSocket | Real-time updates | `ws://api/ws` |

---

## Configuration

### Environment Variables

**Backend (`apps/api/.env`):**
```bash
APP_ENV=development
LLM_PROVIDER=openai          # openai | anthropic | azure
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
QDRANT_URL=http://localhost:6333
```

**Frontend (`apps/web/.env`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Config Files

- `apps/api/configs/default.yaml` - Default configuration
- `apps/api/configs/development.yaml` - Dev overrides
- `apps/api/configs/production.yaml` - Production settings

---

## Testing Strategy

| Layer | Test Type | Location |
|-------|-----------|----------|
| Domain | Unit tests | `tests/unit/` |
| Application | Integration tests | `tests/integration/` |
| Infrastructure | Integration tests | `tests/integration/` |
| Serving | E2E tests | `tests/e2e/` |

```bash
# Run specific test categories
make test-unit
make test-integration
make test-e2e
```

---

## Code Style Guidelines

### Python (Backend)
- **Formatter:** Ruff
- **Linter:** Ruff
- **Type Checker:** Pyright
- **Style:** Google docstrings, 88 char line length

### TypeScript (Frontend)
- **Formatter:** Prettier
- **Linter:** ESLint
- **Style:** Functional components, named exports

### General
- Prefer composition over inheritance
- Keep functions small and focused
- Write self-documenting code with clear names
- Add comments only for "why", not "what"

---

## Common Tasks

### Adding a New LLM Provider

1. Create `apps/api/src/app_name/llm/new_provider.py`
2. Implement `BaseLLM` interface
3. Add to `ComponentFactory` in `builders/factory.py`
4. Add config option in `configs/`

### Adding a New API Endpoint

1. Create route in `apps/api/src/app_name/api/routes/`
2. Define schemas in `schemas/`
3. Implement use case in `use_cases/`
4. Register route in `api/main.py`

### Adding a New Frontend Feature

1. Create types in `apps/web/src/types/`
2. Add API methods in `lib/api/`
3. Create hook in `hooks/`
4. Build components in `components/feature_name/`
5. Add page in `app/`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Import errors | Ensure `src/` layout, run `uv pip install -e .` |
| Type errors | Run `make typecheck`, check interface implementations |
| Docker issues | Run `make docker-down && make docker-up` |
| DB connection | Check `DATABASE_URL`, ensure container is running |

---