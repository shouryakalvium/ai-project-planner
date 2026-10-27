const projectStore = require('../data/projectStore');

const allowedStatuses = new Set(['Planning', 'In progress', 'Complete']);

function createClientError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateProjectInput(input) {
  const { name, description, status, dueDate } = input || {};
  const fields = { name, description, status, dueDate };
  const missingField = Object.entries(fields).find(
    ([, value]) => typeof value !== 'string' || value.trim().length === 0,
  );

  if (missingField) {
    throw createClientError(`${missingField[0]} is required`);
  }

  if (!allowedStatuses.has(status)) {
    throw createClientError('status must be Planning, In progress, or Complete');
  }

  return { name, description, status, dueDate };
}

function createProject(input) {
  const { name, description, status, dueDate } = validateProjectInput(input);
  const idBase = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'project';

  let id = idBase;
  let suffix = 2;
  while (projectStore.findProjectById(id)) {
    id = `${idBase}-${suffix}`;
    suffix += 1;
  }

  return projectStore.addProject({
    id,
    name: name.trim(),
    description: description.trim(),
    status,
    progress: 0,
    dueDate: dueDate.trim(),
    tasks: [],
    milestones: [],
  });
}

function getProjects() {
  return projectStore.listProjects();
}

function getProject(projectId) {
  const project = projectStore.findProjectById(projectId);
  if (!project) {
    throw createClientError(`Project not found: ${projectId}`, 404);
  }

  return project;
}

module.exports = {
  getProjects,
  getProject,
  createProject,
};
