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

function addTask(project, task) {
  project.tasks.push(task);
  return task;
}

function findTaskById(project, taskId) {
  return project.tasks.find((task) => task.id === taskId);
}

function removeTask(project, taskId) {
  const taskIndex = project.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) return false;
  project.tasks.splice(taskIndex, 1);
  return true;
}

function addMilestone(project, milestone) {
  project.milestones.push(milestone);
  return milestone;
}

function findMilestoneById(project, milestoneId) {
  return project.milestones.find((milestone) => milestone.id === milestoneId);
}

function removeMilestone(project, milestoneId) {
  const milestoneIndex = project.milestones.findIndex((milestone) => milestone.id === milestoneId);
  if (milestoneIndex === -1) return false;
  project.milestones.splice(milestoneIndex, 1);
  return true;
}

module.exports = {
  listProjects,
  findProjectById,
  addProject,
  addTask,
  findTaskById,
  removeTask,
  addMilestone,
  findMilestoneById,
  removeMilestone,
};
