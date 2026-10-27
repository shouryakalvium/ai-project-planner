# Low-Level Design

## Structure

The client contains a Vite-powered React entry point, React Router configuration, project list and detail pages, and a small API helper for loading project data.

The server is split into the following layers:

- `src/server.js` loads environment variables and starts the server using the configured port.
- `src/app.js` registers JSON parsing, request logging, API routes, not-found handling, and centralized error handling in that order.
- `src/routes/` defines health and project paths.
- `src/controllers/` handles HTTP request and response concerns.
- `src/services/projectService.js` validates project input, enforces the allowed statuses (`Planning`, `In progress`, and `Complete`), generates unique IDs, and coordinates project operations.
- `src/data/projectStore.js` provides the small data-access boundary around the in-memory project array.
- `src/middleware/` contains request logging, not-found, and error-handling middleware. Malformed JSON is returned as HTTP 400, client errors preserve useful messages, and unexpected errors return a generic HTTP 500 response.

Project data is currently held in memory. Created projects are available while the server is running but are lost on restart. PostgreSQL, MongoDB, task CRUD, and AI plan generation are intentionally not implemented yet.
