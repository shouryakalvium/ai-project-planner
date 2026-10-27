# Low-Level Design

## 1. Repository structure

```text
client/
  src/
    api/projects.js              REST request helpers
    components/AppLayout.jsx    Shared shell and navigation
    pages/ProjectsPage.jsx      Project list and project creation
    pages/ProjectDetailsPage.jsx Project workspace and child CRUD
    styles.css                  Responsive visual design

server/
  src/
    app.js                      Express composition
    server.js                   Server startup
    routes/                     HTTP route definitions
    controllers/                HTTP request/response handlers
    services/                   Validation and business rules
    data/                       In-memory data-access boundary
    middleware/                 Logging, 404, and error handling
```

## 2. Backend request flow

```text
HTTP request
  → route
  → controller
  → service
  → projectStore
  → controller response
```

Routes do not contain business rules. Controllers do not directly manipulate
the data array. Services are responsible for validation, ownership checks,
defaults, ID generation, and progress consistency.

## 3. Existing project API

| Method | Endpoint | Success response |
|---|---|---|
| `GET` | `/api/health` | `200 { "status": "ok" }` |
| `GET` | `/api/projects` | `200` with project array |
| `GET` | `/api/projects/:projectId` | `200` with project |
| `POST` | `/api/projects` | `201` with created project |

Project creation requires non-empty `name`, `description`, `status`, and
`dueDate`. Project IDs are generated from the normalized name and suffixed when
needed to remain unique.

## 4. Task API

| Method | Endpoint | Success response |
|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | `200` with task array |
| `POST` | `/api/projects/:projectId/tasks` | `201` with created task |
| `PATCH` | `/api/projects/:projectId/tasks/:taskId` | `200` with updated task |
| `DELETE` | `/api/projects/:projectId/tasks/:taskId` | `204` with no body |

Example task:

```json
{
  "id": "generated-uuid",
  "title": "Prepare release notes",
  "description": "Summarize the first release changes.",
  "status": "Todo",
  "priority": "Medium",
  "dueDate": "2026-12-01"
}
```

`POST` requires `title`. `PATCH` accepts any subset of editable fields, but a
provided title must not be empty. Dates must be empty or valid `YYYY-MM-DD`
strings. Task completion and reopening are both status updates:

```json
{ "status": "Complete" }
```

or:

```json
{ "status": "Todo" }
```

## 5. Milestone API

| Method | Endpoint | Success response |
|---|---|---|
| `GET` | `/api/projects/:projectId/milestones` | `200` with milestone array |
| `POST` | `/api/projects/:projectId/milestones` | `201` with created milestone |
| `PATCH` | `/api/projects/:projectId/milestones/:milestoneId` | `200` with updated milestone |
| `DELETE` | `/api/projects/:projectId/milestones/:milestoneId` | `204` with no body |

Example milestone:

```json
{
  "id": "generated-uuid",
  "title": "Beta release",
  "description": "Checkpoint for internal validation.",
  "targetDate": "2026-12-15",
  "status": "Planned"
}
```

`POST` requires `title`. `PATCH` accepts editable fields and validates status
and optional target date. Milestones do not affect task-based project progress.

## 6. Validation and status codes

- `200`: successful read or update.
- `201`: successful creation.
- `204`: successful deletion.
- `400`: invalid input or malformed JSON.
- `404`: unknown route, project, task, or milestone.
- `500`: unexpected error handled by `errorHandler.js`.

Child lookups always begin by resolving `projectId`, then searching that
project's own `tasks` or `milestones` array. This enforces parent-child
consistency without exposing a global child-resource lookup.

## 7. Frontend behavior

### Project list

`ProjectsPage` loads projects, displays progress and task completion counts,
and provides the existing project creation form. It shows loading, API error,
retry, and empty states.

### Project workspace

`ProjectDetailsPage`:

- Loads a project by route parameter.
- Displays derived progress and task completion totals.
- Opens shared modal forms for task and milestone creation/editing.
- Uses the task status control to complete or reopen a task.
- Confirms destructive deletes with `window.confirm`.
- Refreshes project data after successful mutations.
- Displays save and action errors without hiding the workspace.

`client/src/api/projects.js` encodes path parameters, sends JSON request
bodies, interprets non-2xx responses, and handles `204` deletion responses.

## 8. Storage boundary

`server/src/data/projectStore.js` currently wraps the in-memory project array
with operations for projects, tasks, and milestones. Services call this module
instead of changing arrays directly. This boundary is the replacement point
for a future persistent repository.

The current implementation has no database migrations, transactions,
authentication, or durable storage. All data is lost on server restart.

## 9. Future implementation sequence

1. Add automated API tests around the current contracts.
2. Introduce a persistent project/task/milestone repository.
3. Add authentication and authorization before multi-user access.
4. Add an explicit AI planning service and persisted generated-plan model.
5. Add user approval workflows before AI suggestions affect project data.
