const TaskAssigned = require('../models/Task');
const Project = require('../models/project')
const asyncHandler= require('express-async-handler')
const User = require('../models/user')
// Create a new task assignment
const createTaskAssignment = async (req, res) => {
  try {
    const { taskData, projectId, supervisor } = req.body;
    
    const newTaskAssignment = new TaskAssigned({
      taskData,
      projectId, 
      supervisor
    });
    
    const savedTaskAssignment = await newTaskAssignment.save();
    if(savedTaskAssignment){
      const _id = projectId
      const project = await Project.findById(_id).exec()
      if(project){
        project.tasks.push(savedTaskAssignment)
        await project.save()
        console.log("Task created and added to project")
      }

    }
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
      'Field Mapped':2,
      'Fully Mapped':2,
      'Coordination Letter': 2,
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

    const { _id ,taskData, notes, status, timeTaken, manual } = req.body;
    console.log(req.body)
    if(!_id){
      console.log("ID not found abort!")
      return res.status(400).json({error: 'ID not found'})
    }
    const task = await TaskAssigned.findById(_id).exec()
    if(!task){
      return res.status(400).json({error: 'TASK not found'})
    }
    // Assuming building number is present in the taskData
    const buildingNumber = task.taskData['building number'];

    if(manual===true){
      taskData['manual'] = 'Manually entered';
    }
    console.log(taskData, "TASK")
    // Find the corresponding building in the taskData or create it if it doesn't exist
    if (!task.taskData[buildingNumber]) {
      task.taskData[buildingNumber] = [];
    }

    // Add the new task data to the array under the building number
    task.taskData[buildingNumber].push(
        taskData
    );
    console.log("Displaying Task",task )
    if(notes){
      task.notes= notes
    }
    if(status){
      task.status= status

    }
    if(timeTaken){
      task.timeTaken= timeTaken
    }
    const saved = await TaskAssigned.findByIdAndUpdate(task._id, task)
    console.log("SAVED", saved)

    if (!saved) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }
    if(saved){
      /* const email= saved?.worker.email
      const worker= await User.findOne({email}).exec()
      if(worker){
        worker.workhours= worker.workhours+timeTaken
        await worker.save()
        console.log("Worker Updated!")
      } */



    }
    if(!updateTaskAssignmentById){
      res.status(500).json({ error: 'Error updating task assignment' });
    }
    res.status(200).json(saved);
  
    
  
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