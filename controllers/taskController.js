const TaskAssigned = require('../models/Task');
const asyncHandler= require('express-async-handler')
// Create a new task assignment
const createTaskAssignment = async (req, res) => {
  try {
    const { taskData, notes, status } = req.body;

    const newTaskAssignment = new TaskAssigned({
      taskData,
      notes,
      status,
      worker,
      supervisor
    });

    const savedTaskAssignment = await newTaskAssignment.save();
    res.status(201).json(savedTaskAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task assignment' });
  }
};

// Get all task assignments

const getAllTaskAssignments = asyncHandler(async (req, res) => {
  const tasks = await TaskAssigned.find().populate('projectId').lean();
  
  if (!tasks?.length) {
    return res.status(400).json({ message: 'No tasks found' });
  }

  // Define an object to group tasks by status
  const tasksByStatus = {
    'Pending': [],
    'Coordination Letter 1': [],
    'Coordination Letter 2': [],
    'Office Work': [],
    'Measurement in Assessment': [],
    'Partly Measured': [],
    'Missing Information': [],
    'United Address': [],
    'Refused Survey': [],
    'Fixing Required': [],
    'Examination': [],
    'Ready for Delivery': [],
    'Delivered': [],
  };

  // Categorize tasks by status
  tasks.forEach((task) => {
    const { status } = task; // Assuming the status is a property in your task object
    if (tasksByStatus[status]) {
      tasksByStatus[status].push(task);
    }
  });

  // If there are projects in "Pending" state, move them to the top
  const tasksWithPending = tasksByStatus['Pending'];
  delete tasksByStatus['Pending'];

  // Create a new object with pending tasks at the top
  const sortedTasksByStatus = {
    'Pending': tasksWithPending,
    ...tasksByStatus,
  };

  res.json(sortedTasksByStatus);
});



// Update a task assignment by ID
const updateTaskAssignmentById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { taskData, notes, status, timeTaken } = req.body;

    const updatedTaskAssignment = await TaskAssigned.findByIdAndUpdate(
      taskId,
      { taskData, notes, status, timeTaken },
      { new: true }
    );

    if (!updatedTaskAssignment) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }

    res.status(200).json(updatedTaskAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task assignment' });
  }
};

// Delete a task assignment by ID
const deleteTaskAssignmentById = async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTaskAssignment = await TaskAssigned.findByIdAndRemove(taskId);

    if (!deletedTaskAssignment) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }

    res.status(200).json(deletedTaskAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task assignment' });
  }
};

module.exports={
    getAllTaskAssignments,
    createTaskAssignment,
    updateTaskAssignmentById,
    deleteTaskAssignmentById,
    
}