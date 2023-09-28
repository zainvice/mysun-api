const TaskAssigned = require('../models/Task');
const asyncHandler= require('express-async-handler')
const User = require('../models/user')
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

  // Sort tasks based on status
  tasks.sort((task1, task2) => {
    const statusOrder = {
      'Pending': 1,
      'Coordination Letter 1': 2,
      'Coordination Letter 2': 3,
      'Office Work': 4,
      'Measurement in Assessment': 5,
      'Partly Measured': 6,
      'Missing Information': 7,
      'United Address': 8,
      'Refused Survey': 9,
      'Fixing Required': 10,
      'Examination': 11,
      'Ready for Delivery': 12,
      'Delivered': 13,
    };

    const status1 = task1.status;
    const status2 = task2.status;

    return statusOrder[status1] - statusOrder[status2];
  });

  res.json(tasks);
});



// Update a task assignment by ID
const updateTaskAssignmentById = async (req, res) => {

    const { _id ,taskData, notes, status, timeTaken } = req.body;
    console.log(req.body)
    if(!_id){
      console.log("ID not found abort!")
      return res.status(400).json({error: 'ID not found'})
    }
    const updatedTaskAssignment = await TaskAssigned.findByIdAndUpdate(
      _id,
      { taskData, notes, status, timeTaken },
      { new: true }
    );

    if (!updatedTaskAssignment) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }
    if(updatedTaskAssignment){
      const email= updatedTaskAssignment.worker.email
      const worker= await User.findOne({email}).exec()
      if(worker){
        worker.workhours= worker.workhours+timeTaken
        await worker.save()
        console.log("Worker Updated!")
      }



    }
    if(!updateTaskAssignmentById){
      res.status(500).json({ error: 'Error updating task assignment' });
    }
    res.status(200).json(updatedTaskAssignment);
  
    
  
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