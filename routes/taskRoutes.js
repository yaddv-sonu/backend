import express from 'express';
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
  validateTaskId
} from '../middleware/taskValidation.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// ✅ Corrected Create Task Route
router.post('/createTask', validateCreateTask, createTask);

// Get all tasks with filtering and pagination
router.get('/', validateTaskQuery, getTasks);

// Update task
router.put('/:id', validateTaskId, validateUpdateTask, updateTask);

// Delete task
router.delete('/:id', validateTaskId, deleteTask);

export default router;
