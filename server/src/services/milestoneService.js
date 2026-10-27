const { randomUUID } = require('node:crypto');
const projectStore = require('../data/projectStore');
const projectService = require('./projectService');

const allowedStatuses = new Set(['Planned', 'In progress', 'Complete']);

function validateTargetDate(value) {
  if (value === undefined || value === '') return '';
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw projectService.createClientError('targetDate must be a valid date in YYYY-MM-DD format');
  }
  return value;
}

function validateMilestoneInput(input, partial = false) {
  const milestone = input || {};
  if (!partial && (typeof milestone.title !== 'string' || milestone.title.trim().length === 0)) {
    throw projectService.createClientError('title is required');
  }
  if (milestone.title !== undefined && (typeof milestone.title !== 'string' || milestone.title.trim().length === 0)) {
    throw projectService.createClientError('title is required');
  }
  if (milestone.description !== undefined && typeof milestone.description !== 'string') {
    throw projectService.createClientError('description must be a string');
  }
  if (milestone.status !== undefined && !allowedStatuses.has(milestone.status)) {
    throw projectService.createClientError('status must be Planned, In progress, or Complete');
  }
  return {
    ...(milestone.title === undefined ? {} : { title: milestone.title.trim() }),
    ...(milestone.description === undefined ? {} : { description: milestone.description.trim() }),
    ...(milestone.status === undefined ? {} : { status: milestone.status }),
    ...(milestone.targetDate === undefined ? {} : { targetDate: validateTargetDate(milestone.targetDate) }),
  };
}

function getProject(projectId) {
  return projectService.getProject(projectId);
}

function listMilestones(projectId) {
  return getProject(projectId).milestones;
}

function getMilestone(projectId, milestoneId) {
  const project = getProject(projectId);
  const milestone = projectStore.findMilestoneById(project, milestoneId);
  if (!milestone) throw projectService.createClientError(`Milestone not found: ${milestoneId}`, 404);
  return milestone;
}

function createMilestone(projectId, input) {
  const project = getProject(projectId);
  const values = validateMilestoneInput(input);
  const milestone = {
    id: randomUUID(),
    title: values.title,
    description: values.description || '',
    targetDate: values.targetDate || '',
    status: values.status || 'Planned',
  };
  projectStore.addMilestone(project, milestone);
  return milestone;
}

function updateMilestone(projectId, milestoneId, input) {
  const project = getProject(projectId);
  const milestone = projectStore.findMilestoneById(project, milestoneId);
  if (!milestone) throw projectService.createClientError(`Milestone not found: ${milestoneId}`, 404);
  const values = validateMilestoneInput(input, true);
  Object.assign(milestone, values);
  return milestone;
}

function deleteMilestone(projectId, milestoneId) {
  const project = getProject(projectId);
  if (!projectStore.findMilestoneById(project, milestoneId)) {
    throw projectService.createClientError(`Milestone not found: ${milestoneId}`, 404);
  }
  projectStore.removeMilestone(project, milestoneId);
}

module.exports = {
  listMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
