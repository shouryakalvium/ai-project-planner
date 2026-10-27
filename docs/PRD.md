# Product Requirements Document

## 1. Product summary

AI Project Planner is a project-planning workspace that helps users move from
an idea to an organized execution plan. The product vision combines
structured project tracking with future AI-assisted plan generation, while
keeping user control over project checkpoints and execution status.

The current release is the foundation of that vision: project CRUD, task and
milestone management, progress tracking, and a responsive workspace UI.

## 2. Goals

- Give users one place to view and organize projects.
- Make project execution visible through tasks, milestones, due dates, and
  progress.
- Keep tasks and milestones distinct:
  - A **task** is an actionable unit of work.
  - A **milestone** is a project checkpoint or outcome.
- Provide predictable validation and useful feedback for both API and UI
  users.
- Establish a layered backend that can replace in-memory storage later without
  changing the HTTP contract.
- Provide a clear foundation for future structured AI plan generation.

## 3. Current scope

### Projects

- List all projects.
- View project details.
- Create a project with:
  - Name
  - Description
  - Status
  - Due date
- Generate a unique URL-safe project ID from the name.

### Tasks

- Create a task under a project.
- Edit title, description, status, priority, and due date.
- Mark a task complete and reopen it.
- Delete a task after user confirmation in the UI.
- Required field: title.
- Status values: `Todo`, `In progress`, `Complete`.
- Priority values: `Low`, `Medium`, `High`.
- Defaults: `Todo`, `Medium`, empty description, and no due date.

### Milestones

- Create a milestone under a project.
- Edit title, description, status, and target date.
- Delete a milestone after user confirmation in the UI.
- Required field: title.
- Status values: `Planned`, `In progress`, `Complete`.
- A milestone is not automatically converted into a task and is not generated
  by AI.

### Progress

Progress is derived from task status:

```text
progress = round(completed task count / total task count * 100)
```

Projects with no tasks consistently report `0%`.

## 4. Non-functional requirements

- Preserve the layered route-controller-service-data-access architecture.
- Return `400` for invalid input and `404` for missing projects or child
  resources.
- Prevent a task or milestone from being changed through a project that does
  not own it.
- Route unexpected failures through centralized error middleware.
- Keep the workspace responsive and accessible:
  - Semantic headings and labels
  - Keyboard-operable controls
  - Visible loading and error feedback
  - Confirmation before destructive deletion
- Do not add authentication, external databases, or AI integration as part of
  the current release.

## 5. Future vision

The following capabilities are planned, but are not implemented in the current
release:

- Persistent PostgreSQL storage for projects, tasks, and milestones.
- MongoDB storage for generated plans or flexible AI output.
- LLM integration that produces structured project-plan suggestions.
- User authentication and project ownership across users.
- AI suggestions that users can review and explicitly accept.
- Richer filtering, sorting, reporting, and collaboration features.

Future AI features must preserve user control: generated suggestions should not
silently create milestones or change project execution data.

## 6. Out of scope for the current release

- PostgreSQL or MongoDB integration
- Authentication and authorization
- Payments, notifications, or collaboration
- Automatic milestone generation
- LLM calls or AI-generated task plans
- File uploads and third-party integrations
