# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See the root [CLAUDE.md](../../CLAUDE.md) for overall project architecture, virtual layer rules, and design patterns.

## Backend Development Commands

All commands run from `apps/backend/`.

```bash
# Dependency management (uses uv, not pip)
uv sync                          # Install/sync all dependencies from uv.lock
uv add <package>                 # Add a new dependency
uv lock                          # Regenerate lock file after manual pyproject.toml edits

# Run the dev server
uv run uvicorn research_pal.api.main:app --reload

# Formatting & linting (Ruff)
uv run ruff format .             # Auto-format all Python files
uv run ruff format --check .     # Check formatting without changes (CI uses this)
uv run ruff check .              # Lint all Python files
uv run ruff check --fix .        # Lint and auto-fix where possible

# Type checking (Pyright)
uv run pyright

# Testing (pytest)
uv run pytest                    # Run all tests
uv run pytest tests/unit/        # Run only unit tests
uv run pytest tests/path/test_file.py::test_name  # Run a single test
uv run pytest -x                 # Stop on first failure

# Pre-commit hooks
uv run pre-commit run --all-files
```

## Ruff Lint Rules

The enabled rule sets in `pyproject.toml` (`select`):

| Code | Category |
|------|----------|
| E4, E7, E9 | Pycodestyle errors (subset) |
| F | Pyflakes |
| B | Bugbear (common pitfalls) |
| T20 | Print statements (flags `print()` usage) |
| N | PEP 8 naming conventions |
| ANN | Type annotation enforcement |
| ERA | Commented-out code detection |
| PERF | Performance anti-patterns |

`fix = false` by default — Ruff won't auto-fix unless you pass `--fix`.

## Python & Dependency Notes

- Python version is pinned to **exactly 3.12.10** (`==3.12.10` in pyproject.toml).
- Pyright excludes `tests/` directories from type checking.
- Pre-commit hooks run **gitleaks** (secret scanning) and **uv-lock** (lock file consistency).
- CI workflows check: ruff format, ruff lint, uv sync --frozen, and gitleaks.

## Source Layout

Backend source lives under `src/research_pal/` (currently a skeleton). Packages sit flat under this namespace following the virtual layer mapping defined in the root CLAUDE.md:

- **Domain**: `entities/`, `nodes/` — pure business logic, no external imports
- **Application**: `workflows/`, `use_cases/`, `builders/` — orchestration and DI
- **Infrastructure**: `llm/`, `vectorstore/`, `database/`, `storage/` — external system adapters
- **Serving**: `api/`, `schemas/` — FastAPI routes and request/response models
