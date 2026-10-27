# Low-Level Design

## Structure

The client contains a Vite-powered React entry point, React Router configuration, project list and detail pages, and a small API helper for loading project data.

The server is split into the following layers:

- `src/server.js` loads environment variables and starts the server using the configured port.
- `src/app.js` registers JSON parsing, request logging, API routes, not-found handling, and centralized error handling in that order.
- `src/routes/` defines health, project, and nested task/milestone paths.
- `src/controllers/` handles HTTP request and response concerns.
- `src/services/projectService.js` validates project input, enforces the allowed statuses (`Planning`, `In progress`, and `Complete`), generates unique IDs, and coordinates project operations.
- `src/data/projectStore.js` provides the small data-access boundary around the in-memory project array.
- `src/middleware/` contains request logging, not-found, and error-handling middleware. Malformed JSON is returned as HTTP 400, client errors preserve useful messages, and unexpected errors return a generic HTTP 500 response.
- `src/services/taskService.js` and `src/services/milestoneService.js` validate child resources, enforce allowed statuses and date formats, generate IDs, verify the parent project, and coordinate CRUD operations through `projectStore.js`.

## Resource endpoints

Nested resources must be accessed through their owning project. A missing project, task, or milestone returns 404; invalid input returns 400; successful creation returns 201 and deletion returns 204.

- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/projects/:projectId/tasks/:taskId`
- `DELETE /api/projects/:projectId/tasks/:taskId`
- `GET /api/projects/:projectId/milestones`
- `POST /api/projects/:projectId/milestones`
- `PATCH /api/projects/:projectId/milestones/:milestoneId`
- `DELETE /api/projects/:projectId/milestones/:milestoneId`

Task statuses are `Todo`, `In progress`, and `Complete`; priorities are `Low`, `Medium`, and `High`. Milestone statuses are `Planned`, `In progress`, and `Complete`. Task and milestone dates use optional `YYYY-MM-DD` values. The client uses the PATCH task status operation to complete and reopen tasks.

Project data is currently held in memory. Created projects and all task/milestone changes are available while the server is running but are lost on restart. PostgreSQL, MongoDB, and AI plan generation are intentionally not implemented.
