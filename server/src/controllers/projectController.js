const projectService = require('../services/projectService');

async function listProjects(request, response) {
  response.status(200).json(await projectService.getProjects());
}

async function getProject(request, response) {
  response.status(200).json(await projectService.getProject(request.params.projectId));
}

async function createProject(request, response) {
  response.status(201).json(await projectService.createProject(request.body));
}

module.exports = {
  listProjects,
  getProject,
  createProject,
};
