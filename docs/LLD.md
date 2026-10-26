# Low-Level Design

## Initial Structure

The client contains a Vite-powered React entry point, React Router configuration, project list and detail pages, and a small API helper for loading project data.

The server contains an Express app, environment-based configuration, JSON parsing middleware, request logging middleware, the `GET /api/health` endpoint, project endpoints (`GET /api/projects`, `GET /api/projects/:projectId`, and `POST /api/projects`), a not-found handler, and centralized error handling.

Project data is currently held in an in-memory server module. Created projects are available to the running server but are lost on restart. PostgreSQL, MongoDB, task CRUD, and AI plan generation are intentionally not implemented yet.
