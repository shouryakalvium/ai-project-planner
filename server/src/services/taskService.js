const { randomUUID } = require('node:crypto');
const projectStore = require('../data/projectStore');
const projectService = require('./projectService');

const allowedStatuses = new Set(['Todo', 'In progress', 'Complete']);
const allowedPriorities = new Set(['Low', 'Medium', 'High']);

function validateDate(value, fieldName) {
  if (value === undefined || value === '') return '';
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw projectService.createClientError(`${fieldName} must be a valid date in YYYY-MM-DD format`);
  }
  return value;
}

function validateTaskInput(input, partial = false) {
  const task = input || {};
  if (!partial && (typeof task.title !== 'string' || task.title.trim().length === 0)) {
    throw projectService.createClientError('title is required');
  }
  if (task.title !== undefined && (typeof task.title !== 'string' || task.title.trim().length === 0)) {
    throw projectService.createClientError('title is required');
  }
  if (task.description !== undefined && typeof task.description !== 'string') {
    throw projectService.createClientError('description must be a string');
  }
  if (task.status !== undefined && !allowedStatuses.has(task.status)) {
    throw projectService.createClientError('status must be Todo, In progress, or Complete');
  }
  if (task.priority !== undefined && !allowedPriorities.has(task.priority)) {
    throw projectService.createClientError('priority must be Low, Medium, or High');
  }
  return {
    ...(task.title === undefined ? {} : { title: task.title.trim() }),
    ...(task.description === undefined ? {} : { description: task.description.trim() }),
    ...(task.status === undefined ? {} : { status: task.status }),
    ...(task.priority === undefined ? {} : { priority: task.priority }),
    ...(task.dueDate === undefined ? {} : { dueDate: validateDate(task.dueDate, 'dueDate') }),
  };
}

function getProject(projectId) {
  return projectService.getProject(projectId);
}

function listTasks(projectId) {
  return getProject(projectId).tasks;
}

function getTask(projectId, taskId) {
  const project = getProject(projectId);
  const task = projectStore.findTaskById(project, taskId);
  if (!task) throw projectService.createClientError(`Task not found: ${taskId}`, 404);
  return task;
}

function createTask(projectId, input) {
  const project = getProject(projectId);
  const values = validateTaskInput(input);
  const task = {
    id: randomUUID(),
    title: values.title,
    description: values.description || '',
    status: values.status || 'Todo',
    priority: values.priority || 'Medium',
    dueDate: values.dueDate || '',
  };
  projectStore.addTask(project, task);
  projectService.withProgress(project);
  return task;
}

function updateTask(projectId, taskId, input) {
  const project = getProject(projectId);
  const task = projectStore.findTaskById(project, taskId);
  if (!task) throw projectService.createClientError(`Task not found: ${taskId}`, 404);
  const values = validateTaskInput(input, true);
  Object.assign(task, values);
  projectService.withProgress(project);
  return task;
}

function deleteTask(projectId, taskId) {
  const project = getProject(projectId);
  if (!projectStore.findTaskById(project, taskId)) {
    throw projectService.createClientError(`Task not found: ${taskId}`, 404);
  }
  projectStore.removeTask(project, taskId);
  projectService.withProgress(project);
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
