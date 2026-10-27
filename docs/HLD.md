# High-Level Design

## Architecture

The React frontend communicates over HTTP with the Node.js and Express backend.

The backend is organized into layers:

- `server.js` loads dotenv configuration and starts the HTTP server.
- `app.js` configures Express middleware and mounts the API routes.
- Routes map HTTP paths to controllers without containing business rules.
- Controllers translate requests into service calls and send HTTP responses.
- Services contain project validation, ID generation, and project business logic.
- The data-access module exposes the current in-memory project store.
- Middleware handles request logging, unknown routes, and centralized errors.

The current dashboard reads and creates project data through Express over HTTP. Project data remains in memory, so created projects are lost when the server restarts. PostgreSQL, MongoDB, and LLM integrations are not connected or implemented yet.
