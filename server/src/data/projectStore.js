const projects = require('./projects');

function listProjects() {
  return projects;
}

function findProjectById(projectId) {
  return projects.find((project) => project.id === projectId);
}

function addProject(project) {
  projects.push(project);
  return project;
}

module.exports = {
  listProjects,
  findProjectById,
  addProject,
};
