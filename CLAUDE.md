# Todo App - Hackathon II Project

## Project Overview
This is a spec-driven development project that evolves from a Python console app to a cloud-native AI chatbot. We follow the **Agentic Dev Stack** workflow where specifications drive all implementation decisions.

## Critical Development Principles

### Python & Package Management
- **Python Version**: Python 3.14 ONLY for all virtual environments
- **Package Manager**: UV exclusively - NO pip usage allowed
- **Architecture**: Monolithic approach (all phases in single repository structure)

### Spec-Driven Development Workflow
**MANDATORY ORDER**: constitution → Specify → Plan → Tasks → Implement

Never write code without a corresponding task. Never create tasks without a plan. Never plan without specifications and constitution.

## Project Structure

```
hackathon-todo/
├── .spec-kit/              # Spec-Kit configuration
│   └── config.yaml
├── specs/                  # ALL specifications (source of truth)
│   ├── constitution.md     # WHY: Principles & constraints
│   ├── overview.md         # Project overview
│   ├── architecture.md     # System architecture
│   ├── features/           # WHAT: Feature specifications
│   │   ├── task-crud.md
│   │   ├── authentication.md
│   │   └── chatbot.md
│   ├── api/                # HOW: API specifications
│   │   ├── rest-endpoints.md
│   │   └── mcp-tools.md
│   ├── database/           # Database specifications
│   │   └── schema.md
│   └── ui/                 # UI specifications
│       ├── components.md
│       └── pages.md
├── speckit.specify         # Requirements & acceptance criteria
├── speckit.plan           # Technical architecture & components
├── speckit.tasks          # Atomic, testable work units
├── CLAUDE.md              # This file
├── AGENTS.md              # Cross-agent instructions
├── phase1/                # Python console app
│   ├── src/
│   ├── tests/
│   └── pyproject.toml
├── phase2-3/              # Monolithic web + chatbot
│   ├── frontend/          # Next.js app
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   ├── backend/           # FastAPI + MCP server
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   ├── mcp/
│   │   └── pyproject.toml
│   └── docker-compose.yml
├── phase4-5/              # Kubernetes deployment
│   ├── k8s/
│   ├── helm/
│   └── dapr/
└── README.md
```

## Spec-Kit Hierarchy (Source of Truth)

### 1. Constitution (WHY - Principles)
**File**: `specs/constitution.md`

Defines non-negotiables:
- Python 3.14 requirement
- UV-only package management
- Monolithic architecture approach
- Security standards
- Performance expectations
- Code quality standards

**Agent Rule**: Check constitution before proposing any solution.

### 2. Specify (WHAT - Requirements)
**File**: `speckit.specify`

Contains:
- User stories and journeys
- Feature requirements
- Acceptance criteria
- Business constraints
- Domain rules

**Agent Rule**: Never infer missing requirements - request clarification or propose spec updates.

### 3. Plan (HOW - Architecture)
**File**: `speckit.plan`

Includes:
- Component breakdown
- API designs & schemas
- Service boundaries
- Data flow diagrams
- Technology choices

**Agent Rule**: All architectural decisions must be documented here.

### 4. Tasks (BREAKDOWN - Implementation Units)
**File**: `speckit.tasks`

Each task must contain:
- Unique Task ID (e.g., T-001)
- Clear description
- Preconditions
- Expected outputs
- Files to modify
- Links to Specify + Plan sections

**Agent Rule**: Only implement what tasks explicitly authorize.

## How to Use Specs

### Referencing Specs
Always reference specs when implementing:
```
[Task]: T-042
[From]: specs/features/task-crud.md §2.1, speckit.plan §3.4
[Phase]: Phase II
```

### Updating Specs
If requirements change:
1. Update `speckit.specify` (WHAT changed)
2. Update `speckit.plan` (HOW it affects architecture)
3. Update `speckit.tasks` (new implementation steps)
4. Then implement

## Python Development Guidelines

### Environment Setup
```bash
# Create virtual environment with Python 3.14
uv venv --python 3.14

# Activate environment
source .venv/bin/activate  # Unix/macOS
# or
.venv\Scripts\activate  # Windows

# Install dependencies
uv pip install -r requirements.txt

# Add new package
uv pip install <package-name>
uv pip freeze > requirements.txt
```

### Phase 1: Console App
**Stack**: Python 3.14, UV
**Location**: `/phase1`

```bash
# Run console app
cd phase1
uv run python src/main.py

# Run tests
uv run pytest tests/
```

**Code Standards**:
- Use type hints for all functions
- Follow PEP 8 style guide
- All functions must have docstrings
- Use dataclasses for data models
- Handle errors gracefully

### Phases 2-3: Backend (FastAPI)
**Stack**: Python 3.14, FastAPI, SQLModel, UV
**Location**: `/phase2-3/backend`

```bash
# Run backend
cd phase2-3/backend
uv run uvicorn main:app --reload --port 8000

# Run with MCP server
uv run python -m mcp.server
```

**Code Standards**:
- Async/await for all I/O operations
- Pydantic models for request/response
- SQLModel for database ORM
- JWT authentication via Better Auth
- Proper error handling with HTTPException

**Project Structure**:
```
backend/
├── main.py              # FastAPI app entry
├── models.py            # SQLModel database models
├── routes/              # API route handlers
│   ├── tasks.py
│   └── chat.py
├── mcp/                 # MCP server & tools
│   ├── server.py
│   └── tools.py
├── db.py                # Database connection
└── pyproject.toml       # UV dependencies
```

**API Conventions**:
- All routes under `/api/{user_id}/`
- Return JSON responses
- Use dependency injection for auth
- Filter all queries by authenticated user

## Frontend Development Guidelines

### Phases 2-3: Next.js Frontend
**Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS
**Location**: `/phase2-3/frontend`

```bash
# Run frontend
cd phase2-3/frontend
npm run dev
```

**Code Standards**:
- Use Server Components by default
- Client Components only for interactivity
- TypeScript for all files
- Tailwind CSS for styling (no inline styles)
- API calls through `/lib/api.ts`

**Component Structure**:
```
frontend/
├── app/                 # Pages and layouts
│   ├── page.tsx
│   └── layout.tsx
├── components/          # Reusable UI components
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── lib/                 # Utilities
│   └── api.ts          # API client
└── package.json
```

## Database Guidelines

**Provider**: Neon Serverless PostgreSQL
**ORM**: SQLModel

**Connection**:
- Use environment variable: `DATABASE_URL`
- Connection pooling enabled
- All queries must be async

**Models**:
```
backend/models.py contains:
- User (managed by Better Auth)
- Task
- Conversation
- Message
```

**Indexes**:
- Tasks: user_id, completed status
- Messages: conversation_id, created_at

## AI Chatbot Guidelines (Phase 3)

### OpenAI Agents SDK
**Architecture**: Stateless chat endpoint with database persistence

**Flow**:
1. Receive user message
2. Fetch conversation history from DB
3. Build message array (history + new message)
4. Store user message in DB
5. Run agent with MCP tools
6. Store assistant response in DB
7. Return response to client

### MCP Tools
**Required Tools**:
- `add_task`: Create new task
- `list_tasks`: Retrieve tasks
- `complete_task`: Mark task complete
- `delete_task`: Remove task
- `update_task`: Modify task

**Tool Pattern**:
```python
@mcp.tool()
async def add_task(user_id: str, title: str, description: str = None):
    """Create a new task for the user."""
    # Implementation with database
    return {"task_id": id, "status": "created", "title": title}
```

## Kubernetes & Cloud Deployment (Phases 4-5)

### Containerization
**Tool**: Docker + Docker AI Agent (Gordon)

```bash
# Using Gordon (if available)
docker ai "create dockerfile for python fastapi app"

# Standard approach
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

### Local Kubernetes (Phase 4)
**Stack**: Minikube, Helm, kubectl-ai, kagent

```bash
# Start Minikube
minikube start

# Deploy using kubectl-ai
kubectl-ai "deploy todo backend with 2 replicas"

# Deploy using Helm
helm install todo-app ./helm/todo-chart
```

### Cloud Deployment (Phase 5)
**Providers**: Azure AKS / Google GKE / Oracle OKE
**Additional**: Kafka (Redpanda/Strimzi), Dapr

**Dapr Components**:
- Pub/Sub: Kafka for events
- State: PostgreSQL for conversation state
- Bindings: Cron for scheduled reminders
- Secrets: Kubernetes secrets management

## Command Reference

### UV Commands (Use ONLY These)
```bash
# Create new project
uv init <project-name>

# Create virtual environment
uv venv --python 3.14

# Install package
uv pip install <package>

# Install from requirements
uv pip install -r requirements.txt

# Update requirements
uv pip freeze > requirements.txt

# Run script
uv run python <script.py>

# Run with module
uv run -m pytest
```

### Spec-Kit Commands (via MCP)
```bash
# Initialize Spec-Kit
uv run specifyplus init <project_name>

# Use through MCP prompts in Claude Code:
# - /specify - Create specifications
# - /plan - Generate technical plan
# - /tasks - Break into atomic tasks
# - /implement - Execute implementation
```

### Development Commands
```bash
# Backend
cd phase2-3/backend
uv run uvicorn main:app --reload

# Frontend
cd phase2-3/frontend
npm run dev

# Both (via docker-compose)
docker-compose up

# Tests
uv run pytest
npm test
```

## Agent Behavior Rules

### ✅ Agents MUST:
- Read CLAUDE.md and AGENTS.md before every session
- Reference Task IDs in all code comments
- Follow the Constitution principles
- Update specs before changing architecture
- Request clarification for underspecified features
- Use UV exclusively for Python packages
- Use Python 3.14 for all environments
- Follow monolithic architecture patterns

### ❌ Agents MUST NOT:
- Use pip instead of UV
- Use Python versions other than 3.14
- Write code without corresponding tasks
- Create features not in specifications
- Modify architecture without updating plans
- Generate missing requirements
- Add endpoints/fields not in specs
- Use separate repos (must be monolithic)
- Install packages outside UV

## Error Handling

### When Specs are Missing:
```
⛔ STOP - Missing specification for feature X
✅ ACTION: Request spec update in speckit.specify
```

### When Architecture Changes:
```
⛔ STOP - Architecture change requires plan update
✅ ACTION: Update speckit.plan with proposed changes
```

### When Tasks are Unclear:
```
⛔ STOP - Task T-042 lacks clear acceptance criteria
✅ ACTION: Request task clarification in speckit.tasks
```

## Development Workflow Summary

1. **Read Specs**: Always start by reading relevant specs
   - `@specs/features/[feature].md`
   - `@specs/api/[endpoint].md`
   - `@speckit.plan`

2. **Verify Task**: Confirm task exists and is clear
   - Check `@speckit.tasks` for Task ID
   - Verify preconditions met

3. **Implement**: Write code following standards
   - Reference Task ID in comments
   - Follow Constitution principles
   - Use UV for all Python packages
   - Use Python 3.14 environments

4. **Test**: Verify implementation
   - Run tests: `uv run pytest`
   - Check acceptance criteria met

5. **Document**: Update if needed
   - Update specs if behavior changed
   - Update README for new features

## Submission Requirements

Each phase requires:
1. ✅ Public GitHub repository
2. ✅ All specs in `/specs` folder
3. ✅ Working implementation
4. ✅ README with setup instructions
5. ✅ Demo video (max 90 seconds)

## Key Reminders

- 🔴 **CRITICAL**: Python 3.14 + UV only, NO pip
- 🔴 **CRITICAL**: Monolithic repository structure
- 🔴 **CRITICAL**: Spec-Driven Development (no vibe coding)
- 🟡 **IMPORTANT**: Every code file references Task ID
- 🟡 **IMPORTANT**: Update specs before implementing changes
- 🟢 **BEST PRACTICE**: Use MCP tools for all agent interactions

---

## Quick Start Commands

```bash
# Phase 1: Console App
uv venv --python 3.14
source .venv/bin/activate
uv pip install -r requirements.txt
uv run python src/main.py

# Phase 2-3: Full Stack
cd phase2-3/backend && uv run uvicorn main:app --reload
cd phase2-3/frontend && npm run dev

# Phase 4: Local Kubernetes
minikube start
kubectl-ai "deploy todo app"

# Phase 5: Cloud
helm install todo ./helm/todo-chart
```

---

**Remember**: Specifications are the single source of truth. When in doubt, check the specs. When specs are unclear, request updates. Never improvise.

## Active Technologies
- Python 3.14 (as per constitution) + Tesseract OCR engine, OpenCV for image preprocessing, FastAPI for API endpoints, Pydantic for data validation (002-ocr-functionality)
- PostgreSQL via SQLModel (Neon serverless DB as per constitution), file storage for temporary image processing (002-ocr-functionality)

## Recent Changes
- 002-ocr-functionality: Added Python 3.14 (as per constitution) + Tesseract OCR engine, OpenCV for image preprocessing, FastAPI for API endpoints, Pydantic for data validation
