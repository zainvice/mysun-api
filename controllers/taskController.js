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
      const project = await Project.findById(_id).populate('tasks').exec();
      if(project){
        console.log("PROJECT", project)
        const duplicates = project?.tasks.find(task => task.taskData["building number"] === taskData["building number"]);
        if(duplicates){
          console.log("Duplicate Found!")
          return res.status(200).json(duplicates);
        }
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


  res.json(tasks);
});

const getTaskById = asyncHandler(async(req, res)=>{
    console.log(req.body)
    const {_id} = req.body
    const taskFound = await TaskAssigned.findById(_id).populate('projectId').lean();

    if(taskFound)
      return res.json(taskFound)
    else
      return res.status(400)
})


// Update a task assignment by ID
const updateTaskAssignmentById = async (req, res) => {

    const { _id ,taskData, notes, status, timeTaken, manual, classification, propertyType, stats, floor, resetType } = req.body;
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

    /* if(manual===true){
      taskData['manual'] = 'Manually entered';
    }
    console.log(taskData, "TASK")
    // Find the corresponding building in the taskData or create it if it doesn't exist
    if (!task.taskData[buildingNumber]) {
      task.taskData[buildingNumber] = [];
    }

    // Add the new task data to the array under the building number
    task.taskData[buildingNumber] = [taskData]; */
    const completeDataEntry = { "building number": buildingNumber, ...taskData };
    if(completeDataEntry){
      task.taskData = completeDataEntry;
    }
    if(manual){
      task.manual = manual;
    }
    console.log("Displaying Task",task )
    if(notes){
      task.notes= notes
    }
    if(status){
      const change = {
        changedFrom: task.status,
        changedTo: status,
        changedOn: Date.now(),
      }
      if(task.status!=status)
          task.statusHistory.push(change)
      task.status= status
      if(status==="Coordination Letter"){
        
                const sevenDaysFromNow = new Date();
                sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
                task.timer= sevenDaysFromNow;
          
      }

    }
    if(classification){
      const change = {
        changedFrom: task.classification,
        changedTo: classification,
        changedOn: Date.now(),
      }
      if(task.classification!=classification)
          task.classificationHistory.push(change)
      task.classification= classification
      if(classification==="Coordination Letter 1" || classification==="Coordination Letter 2"){
        
                const sevenDaysFromNow = new Date();
                sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
                task.timer= sevenDaysFromNow;
          
      }

    }
    if(propertyType){
      const change = {
        changedFrom: task.propertyType,
        changedTo: propertyType,
        changedOn: Date.now(),
      }
      if(task.propertyType!=propertyType)
          task.propertyTypeHistory.push(change)
      task.propertyType= propertyType
     

    }
    if(stats){
      const change = {
        changedFrom: task.stats,
        changedTo: stats,
        changedOn: Date.now(),
      }
      if(task.stats!=stats)
        task.statsHistory.push(change)
     
      task.stats= stats
     

    }
    if(floor){
      task.floor = floor;
    }
    if(timeTaken){
      task.timeTaken= task.timeTaken + timeTaken
    }
    if(resetType){
      if(resetType==="Partial"){
        console.log("reseting")
        const newtaskData = {"building number": buildingNumber}
        console.log("reseting to", newtaskData)
        task.taskData = newtaskData
      }
      if(resetType==="Full"){
        console.log("reseting")
        const newtaskData = {"building number": buildingNumber}
        console.log("reseting to", newtaskData)
        task.taskData = newtaskData
        task.status = "Pending"
        task.statusHistory = []
        task.classification = "None"
        task.classificationHistory = []
        task.propertyTypeHistory = []
        task.statsHistory = []
        task.propertyType = ["None"]
        task.stats = ["None"]
        task.floor = undefined
      }
    }

    const saved = await TaskAssigned.findByIdAndUpdate(task._id, task)
    console.log("SAVED", saved)

    if (!saved) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }
    if(resetType){
      if(resetType==="Partial"){
        const taskData = {buildingNumber: buildingNumber}
        task.taskData = taskData
      }
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
    getTaskById,
    
}