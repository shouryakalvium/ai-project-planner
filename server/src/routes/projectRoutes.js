const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/', projectController.listProjects);
router.get('/:projectId', projectController.getProject);
router.post('/', projectController.createProject);

module.exports = router;
