# High-Level Design

## Current Architecture

The React frontend communicates over HTTP with the Node.js and Express backend.

The backend will use PostgreSQL for relational project and task data. MongoDB will later store saved AI-generated plans, and an LLM API will later generate structured project plans.

For this batch, only the React and Express foundation is implemented. No database connections or LLM integration are present yet.
