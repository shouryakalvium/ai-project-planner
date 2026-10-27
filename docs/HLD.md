# High-Level Design

## Architecture

The React frontend communicates over HTTP with the Node.js and Express backend.

The backend is organized into layers:

- `server.js` loads dotenv configuration and starts the HTTP server.
- `app.js` configures Express middleware and mounts the API routes.
- Routes map HTTP paths to controllers without containing business rules.
- Controllers translate requests into service calls and send HTTP responses.
- Services contain project validation, ID generation, project business logic, and task/milestone rules.
- The data-access module exposes the current in-memory project store.
- Middleware handles request logging, unknown routes, and centralized errors.

The dashboard reads and creates project data through Express over HTTP and manages tasks and milestones in each project workspace. Tasks have a unique ID, title, status, priority, and optional description/due date. New tasks default to `Todo` status and `Medium` priority. Milestones are independent project checkpoints with a title, status, and optional description/target date; they are never generated automatically.

Project progress is calculated as the rounded percentage of tasks whose status is `Complete`. A project with no tasks has 0% progress. Project, task, and milestone data remains in memory, so all created or changed data is lost when the server restarts. PostgreSQL, MongoDB, and LLM integrations are not connected or implemented yet.
