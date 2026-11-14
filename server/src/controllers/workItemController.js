const taskService = require('../services/taskService');
const milestoneService = require('../services/milestoneService');

async function listTasks(request, response) {
  response.status(200).json(await taskService.listTasks(request.params.projectId));
}

async function createTask(request, response) {
  response.status(201).json(await taskService.createTask(request.params.projectId, request.body));
}

async function updateTask(request, response) {
  response.status(200).json(await taskService.updateTask(request.params.projectId, request.params.taskId, request.body));
}

async function deleteTask(request, response) {
  await taskService.deleteTask(request.params.projectId, request.params.taskId);
  response.status(204).send();
}

async function listMilestones(request, response) {
  response.status(200).json(await milestoneService.listMilestones(request.params.projectId));
}

async function createMilestone(request, response) {
  response.status(201).json(await milestoneService.createMilestone(request.params.projectId, request.body));
}

async function updateMilestone(request, response) {
  response.status(200).json(await milestoneService.updateMilestone(request.params.projectId, request.params.milestoneId, request.body));
}

async function deleteMilestone(request, response) {
  await milestoneService.deleteMilestone(request.params.projectId, request.params.milestoneId);
  response.status(204).send();
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
