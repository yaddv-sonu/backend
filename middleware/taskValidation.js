import { body, param, query } from 'express-validator';

// Validation middleware for creating a task
export const validateCreateTask = [
  body('taskName')
    .trim()
    .notEmpty().withMessage('Task name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Task name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  
  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value, { req }) => {
      if (req.body.dueDate && new Date(value) >= new Date(req.body.dueDate)) {
        throw new Error('Start date must be before due date');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.some(tag => typeof tag !== 'string' || tag.length > 30)) {
        throw new Error('Invalid tag format or length');
      }
      return true;
    })
];

// Validation middleware for updating a task
export const validateUpdateTask = [
  param('id')
    .isMongoId().withMessage('Invalid task ID'),
  
  body('taskName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Task name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  
  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value, { req }) => {
      if (req.body.dueDate && new Date(value) >= new Date(req.body.dueDate)) {
        throw new Error('Start date must be before due date');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.some(tag => typeof tag !== 'string' || tag.length > 30)) {
        throw new Error('Invalid tag format or length');
      }
      return true;
    })
];

// Validation middleware for task queries
export const validateTaskQuery = [
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  
  query('sortBy')
    .optional()
    .isIn(['dueDate', 'createdAt', 'priority', 'status']).withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Validation middleware for task ID
export const validateTaskId = [
  param('id')
    .isMongoId().withMessage('Invalid task ID')
]; 