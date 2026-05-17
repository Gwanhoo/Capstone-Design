import { Router } from 'express';
import { createProject, getProjectById, getProjects } from '../controllers/projectController.js';

const router = Router();

router.get('/projects', getProjects);
router.get('/projects/:projectId', getProjectById);
router.post('/projects', createProject);

export default router;
