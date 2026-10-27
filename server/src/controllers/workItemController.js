const taskService = require('../services/taskService');
const milestoneService = require('../services/milestoneService');

function listTasks(request, response) {
  response.status(200).json(taskService.listTasks(request.params.projectId));
}

function createTask(request, response) {
  response.status(201).json(taskService.createTask(request.params.projectId, request.body));
}

function updateTask(request, response) {
  response.status(200).json(taskService.updateTask(request.params.projectId, request.params.taskId, request.body));
}

function deleteTask(request, response) {
  taskService.deleteTask(request.params.projectId, request.params.taskId);
  response.status(204).send();
}

function listMilestones(request, response) {
  response.status(200).json(milestoneService.listMilestones(request.params.projectId));
}

function createMilestone(request, response) {
  response.status(201).json(milestoneService.createMilestone(request.params.projectId, request.body));
}

function updateMilestone(request, response) {
  response.status(200).json(milestoneService.updateMilestone(request.params.projectId, request.params.milestoneId, request.body));
}

function deleteMilestone(request, response) {
  milestoneService.deleteMilestone(request.params.projectId, request.params.milestoneId);
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
