# AI Project Planner

AI Project Planner is a focused project workspace for planning, tracking, and
eventually generating structured project plans with AI.

The current application provides a React dashboard backed by a layered
Node.js/Express API. Users can create projects, manage tasks and milestones,
and monitor progress from the project workspace.

## Current functionality

- **Project management**
  - View all projects and open an individual project workspace.
  - Create projects with a name, description, status, and due date.
  - Use the supported project statuses: `Planning`, `In progress`, and `Complete`.
- **Task management**
  - Create, edit, complete, reopen, and delete tasks.
  - Track title, optional description, status, priority, and optional due date.
  - New tasks default to `Todo` status and `Medium` priority.
- **Milestone management**
  - Create, edit, and delete project checkpoints.
  - Track title, optional description, status, and optional target date.
  - Milestones are explicitly managed by the user and are not automatically
    generated as tasks or by AI.
- **Progress tracking**
  - Project progress is calculated from task completion:
    `completed tasks / total tasks * 100`.
  - A project with no tasks has `0%` progress.
- **Validation and feedback**
  - The API returns clear `400` validation errors and `404` resource errors.
  - The UI provides loading, empty, save, error, and delete-confirmation states.

## Technology stack

- **Frontend:** React 19, React Router, Vite, CSS
- **Backend:** Node.js, Express 5, dotenv
- **Storage:** In-memory JavaScript data store
- **Communication:** REST-style HTTP API under `/api`

PostgreSQL, MongoDB, authentication, and AI/LLM integration are future
capabilities. They are intentionally not part of the current implementation.
Because storage is in memory, projects, tasks, milestones, and changes are
lost when the server restarts.

## Repository structure

```text
client/   React and Vite frontend
server/   Express API and layered backend
docs/     Product and architecture documentation
```

The backend layers are:

1. **Routes** map HTTP methods and paths to controllers.
2. **Controllers** handle HTTP request and response concerns.
3. **Services** enforce validation and business rules.
4. **Data access** isolates the in-memory store from HTTP handling.
5. **Middleware** handles logging, unknown routes, and centralized errors.

## Running locally

Install dependencies once:

```bash
cd server
npm install

cd ../client
npm install
```

Start the backend in one terminal:

```bash
cd server
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The Vite development server proxies `/api` requests to the backend at
`http://localhost:5000`. The backend port can be changed with the `PORT`
environment variable.

## Verification

```bash
# Backend syntax checks
node --check server/src/app.js

# Frontend production build
cd client
npm run build
```

The backend also exposes `GET /api/health`, which returns
`{ "status": "ok" }` when the API is running.

## API overview

Project endpoints:

- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects`

Task endpoints:

- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/projects/:projectId/tasks/:taskId`
- `DELETE /api/projects/:projectId/tasks/:taskId`

Milestone endpoints:

- `GET /api/projects/:projectId/milestones`
- `POST /api/projects/:projectId/milestones`
- `PATCH /api/projects/:projectId/milestones/:milestoneId`
- `DELETE /api/projects/:projectId/milestones/:milestoneId`

See [docs/PRD.md](docs/PRD.md), [docs/HLD.md](docs/HLD.md), and
[docs/LLD.md](docs/LLD.md) for the product vision and implementation details.
