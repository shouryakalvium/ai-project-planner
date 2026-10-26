const express = require('express');
const projects = require('./data/projects');

const app = express();
const allowedStatuses = new Set(['Planning', 'In progress', 'Complete']);

app.use(express.json());

app.use((request, response, next) => {
  console.log(`${request.method} ${request.originalUrl}`);
  next();
});

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.get('/api/projects', (request, response) => {
  response.status(200).json(projects);
});

app.post('/api/projects', (request, response, next) => {
  const { name, description, status, dueDate } = request.body || {};
  const fields = { name, description, status, dueDate };
  const missingField = Object.entries(fields).find(
    ([, value]) => typeof value !== 'string' || value.trim().length === 0,
  );

  if (missingField) {
    const error = new Error(`${missingField[0]} is required`);
    error.statusCode = 400;
    next(error);
    return;
  }

  if (!allowedStatuses.has(status)) {
    const error = new Error('status must be Planning, In progress, or Complete');
    error.statusCode = 400;
    next(error);
    return;
  }

  const idBase = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'project';
  let id = idBase;
  let suffix = 2;

  while (projects.some((project) => project.id === id)) {
    id = `${idBase}-${suffix}`;
    suffix += 1;
  }

  const project = {
    id,
    name: name.trim(),
    description: description.trim(),
    status,
    progress: 0,
    dueDate: dueDate.trim(),
    tasks: [],
    milestones: [],
  };

  projects.push(project);
  response.status(201).json(project);
});

app.get('/api/projects/:projectId', (request, response, next) => {
  const project = projects.find((item) => item.id === request.params.projectId);

  if (!project) {
    const error = new Error(`Project not found: ${request.params.projectId}`);
    error.statusCode = 404;
    next(error);
    return;
  }

  response.status(200).json(project);
});

app.use((request, response, next) => {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : error.message,
  });
});

module.exports = app;
