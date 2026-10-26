# High-Level Design

## Current Architecture

The React frontend communicates over HTTP with the Node.js and Express backend.

The backend will use PostgreSQL for relational project and task data. MongoDB will later store saved AI-generated plans, and an LLM API will later generate structured project plans.

The current dashboard reads and creates project data through Express over HTTP. The API uses in-memory data until the PostgreSQL data layer is implemented, so new projects last only for the lifetime of the server process. No database connections or LLM integration are present yet.
