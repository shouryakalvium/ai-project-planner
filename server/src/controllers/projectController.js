const projectService = require('../services/projectService');

function listProjects(request, response) {
  response.status(200).json(projectService.getProjects());
}

function getProject(request, response) {
  response.status(200).json(projectService.getProject(request.params.projectId));
}

function createProject(request, response) {
  response.status(201).json(projectService.createProject(request.body));
}

module.exports = {
  listProjects,
  getProject,
  createProject,
};
