const express = require('express');
const projectController = require('../controllers/projectController');
const workItemController = require('../controllers/workItemController');

const router = express.Router();

router.get('/', projectController.listProjects);
router.get('/:projectId', projectController.getProject);
router.post('/', projectController.createProject);
router.get('/:projectId/tasks', workItemController.listTasks);
router.post('/:projectId/tasks', workItemController.createTask);
router.patch('/:projectId/tasks/:taskId', workItemController.updateTask);
router.delete('/:projectId/tasks/:taskId', workItemController.deleteTask);
router.get('/:projectId/milestones', workItemController.listMilestones);
router.post('/:projectId/milestones', workItemController.createMilestone);
router.patch('/:projectId/milestones/:milestoneId', workItemController.updateMilestone);
router.delete('/:projectId/milestones/:milestoneId', workItemController.deleteMilestone);

module.exports = router;
