# AI Engineering Playbook — Website (Next.js)

This directory contains the complete engineering standards for the **Website** project.

The Website is a standalone Next.js frontend. It has no database of its own and no direct
Prisma/ORM access — all content and structured data come from the **Payload CMS** backend
(separate repository) through its public REST API. Treat Payload as an external service.

Every AI agent MUST read this playbook before making implementation decisions.

## Reading Order

1. `core/AI_RULES.md`
2. `core/AI_BEHAVIOR.md`
3. `core/PROJECT_ARCHITECTURE.md`
4. Task-specific documents

## Task-Specific Reading

### Frontend / UI Task

- `frontend/NEXTJS.md`
- `frontend/REACT.md`
- `frontend/COMPONENTS.md`
- `frontend/SHADCN.md`
- `frontend/TAILWIND.md`
- `frontend/ICONS.md`
- `frontend/ACCESSIBILITY.md`

### Hooks / Client State Task

- `frontend/HOOKS.md`
- `state/ZUSTAND.md`

### Data Fetching / CMS Integration Task

- `backend/CMS_CLIENT.md` — how the Website talks to Payload's REST API
- `backend/SERVER_ACTIONS.md`
- `backend/ROUTE_HANDLERS.md`
- `backend/VALIDATION.md`
- `backend/SECURITY.md`

### Code Review / Review Artifacts

- `quality/CODE_REVIEW.md`
- `core/FOLDER_STRUCTURE.md` (Reviews Folder)
- `core/NAMING_CONVENTIONS.md` (Review document names)

### Testing Task

- `quality/TESTING.md`
- `quality/ERROR_HANDLING.md`

Always read only the documents relevant to the current task.

Never ignore an existing project pattern.
