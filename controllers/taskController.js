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

const getAllTaskAssignments = asyncHandler(async (req, res) =>{
  const tasks = await TaskAssigned.find().lean()
  if(!tasks?.length){
      return res.status(400).json({message: 'No tasks found'})
  }
  res.json(tasks)
})



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