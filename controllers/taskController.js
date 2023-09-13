const TaskAssigned = require('../models/Task');

// Create a new task assignment
const createTaskAssignment = async (req, res) => {
  try {
    const { taskData, notes, status } = req.body;

    const newTaskAssignment = new TaskAssigned({
      taskData,
      notes,
      status,
    });

    const savedTaskAssignment = await newTaskAssignment.save();
    res.status(201).json(savedTaskAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task assignment' });
  }
};

// Get all task assignments
const getAllTaskAssignments = async (req, res) => {
  try {
    const taskAssignments = await TaskAssigned.find();
    console.log(taskAssignments)
    res.status(200).json(taskAssignments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task assignments' });
  }
};

// Get a single task assignment by ID
const getTaskAssignmentById = async (req, res) => {
  try {
    console.log('Task assignment before')
    const taskId = req.params.id;
    console.log(taskId);
    const taskAssignment = await TaskAssigned.findById(taskId);
    
    if (!taskAssignment) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }

    res.status(200).json(taskAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task assignment' });
  }
};

// Update a task assignment by ID
const updateTaskAssignmentById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { taskData, notes, status } = req.body;

    const updatedTaskAssignment = await TaskAssigned.findByIdAndUpdate(
      taskId,
      { taskData, notes, status },
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
    getTaskAssignmentById,
    updateTaskAssignmentById,
    deleteTaskAssignmentById,
    
}