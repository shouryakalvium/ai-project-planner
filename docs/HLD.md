# High-Level Design

## 1. Purpose and scope

This design describes the current AI Project Planner foundation and the
extension points reserved for the product vision. The implementation is a
small full-stack web application: a React frontend communicates with a
Node.js/Express backend over HTTP.

The current release uses an in-memory store. No external database, AI service,
authentication provider, or user identity system is connected.

## 2. System architecture

```text
┌─────────────────────┐       HTTP / JSON       ┌──────────────────────────┐
│ React + Vite client │ ───────────────────────> │ Express REST API         │
│ Project workspace   │ <─────────────────────── │ Routes → Controllers     │
└─────────────────────┘                         │          → Services      │
                                                │          → Data access   │
                                                └─────────────┬────────────┘
                                                              │
                                                   In-memory project store
```

### Frontend

- Vite serves the React application.
- React Router provides the project list and project detail routes.
- The project API helper centralizes fetch requests and API error handling.
- `ProjectDetailsPage` provides interactive task and milestone management.
- CSS preserves the existing responsive visual language and panel layout.

### Backend

- `server.js` loads environment configuration and starts the HTTP server.
- `app.js` registers JSON parsing, request logging, API routes, not-found
  handling, and centralized error handling.
- Routes define resource paths and HTTP methods.
- Controllers translate HTTP requests into service calls and responses.
- Services validate inputs, enforce business rules, verify parent ownership,
  generate IDs, and calculate progress.
- Data access exposes the in-memory boundary without HTTP concerns.

## 3. Core domain model

### Project

A project contains identity and planning metadata plus child resources:

- `id`
- `name`
- `description`
- `status`: `Planning`, `In progress`, or `Complete`
- `dueDate`
- `progress`, derived from tasks
- `tasks`
- `milestones`

### Task

A task represents actionable work:

- `id`, generated with a unique UUID
- `title`, required
- `description`, optional
- `status`: `Todo`, `In progress`, or `Complete`
- `priority`: `Low`, `Medium`, or `High`
- `dueDate`, optional `YYYY-MM-DD`

### Milestone

A milestone represents a project checkpoint, not an actionable task:

- `id`, generated with a unique UUID
- `title`, required
- `description`, optional
- `targetDate`, optional `YYYY-MM-DD`
- `status`: `Planned`, `In progress`, or `Complete`

## 4. Progress calculation

The service calculates progress whenever a project is read or a task changes:

```text
completedTasks = tasks where status == "Complete"
progress = round(completedTasks / tasks.length * 100)
```

When `tasks.length` is zero, progress is `0`. The value is not independently
editable and is never hardcoded as a separate source of truth.

## 5. Error and ownership behavior

- Validation failures are client errors with HTTP `400`.
- Missing projects, tasks, and milestones return HTTP `404`.
- Child resources are looked up inside the requested parent project. Therefore,
  using a valid child ID with a different project cannot modify that child.
- Malformed JSON returns HTTP `400`.
- Unexpected failures pass through centralized middleware and return a generic
  HTTP `500` response.

## 6. Future architecture

The data-access boundary allows the in-memory implementation to be replaced by
a PostgreSQL-backed repository for transactional project data. A separate
future AI-plan persistence boundary may use MongoDB for generated plan
documents. An AI service should remain behind an explicit service boundary and
must not directly mutate project state without user confirmation.

## 7. Data lifetime and limitations

All current data is stored in process memory. Projects, tasks, milestones, and
updates are lost when the server restarts. This is intentional for the current
foundation and must be replaced with persistence before production use.
