import Task from '../models/Task.js';
import { validationResult } from 'express-validator';

// Create a new task
export const createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { taskName, description, dueDate, priority, status, tags, startDate } = req.body;

    const task = new Task({
      userId: req.user,
      taskName,
      description,
      dueDate,
      priority,
      status,
      tags,
      startDate
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: err.message
    });
  }
};

// Get all tasks for a user with filtering and pagination
export const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = 'dueDate', sortOrder = 'asc', page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { userId: req.user };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get tasks with pagination and sorting
    const tasks = await Task.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: err.message
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { taskName, description, dueDate, priority, status, tags, startDate } = req.body;
    
    // Find and update task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      {
        taskName,
        description,
        dueDate,
        priority,
        status,
        tags,
        startDate,
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: err.message
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: err.message
    });
  }
};
