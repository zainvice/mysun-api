const Project = require("../models/project");
const asyncHandler = require("express-async-handler");
const Task = require("../models/Task")
const User = require("../models/user")

const distributeTasks = async (projectData, workers, projectId) => {
  const nonSupervisorWorkers = workers.filter(worker => worker.role !== 'supervisor');
  const SupervisorWorkers = workers.filter(worker => worker.role === 'supervisor');
  console.log(SupervisorWorkers)

  if (projectData.tasks.length === 0 || nonSupervisorWorkers.length === 0) {
    console.log("No tasks to distribute or no non-supervisor workers.");
    return [];
  }

  // Calculate the number of tasks per non-supervisor worker
  const tasksPerWorker = Math.ceil(projectData.tasks.length / nonSupervisorWorkers.length);
  let tasknum=0
  const newTasks = [];

  for (let index = 0; index < nonSupervisorWorkers.length; index++) {
    const worker = nonSupervisorWorkers[index];
    const startIndex = index * tasksPerWorker;
    const endIndex = Math.min((index + 1) * tasksPerWorker, projectData.tasks.length);
    const workerTasks = projectData.tasks.slice(startIndex, endIndex);
    const email = worker.email;

    const workerFound = await User.findOne({ email }).exec();
    const semail = SupervisorWorkers[0].email
    const superviosrFound = await User.findOne({email: semail}).exec()
    const project = await Project.findById({_id: projectId});
    
    if (workerFound) {
      //console.log(workerFound)
      //console.log(workerTasks)
      const taskPromises = workerTasks.map(async tasksData => {
        const taskData= tasksData
        console.log("Creating")
        tasknum=tasknum+1
        const newTask = await Task.create({ taskData, projectId, supervisor: superviosrFound, worker: workerFound });
        if(project){
          console.log("added task: ", tasknum, newTask._id,"to", project.projectName)
          project.tasks.push(newTask._id)
        }
        console.log("new Task created")
        return newTask;
      });
      
      const tasksForWorker = await Promise.all(taskPromises);
      //console.log(tasksForWorker)
      for (let index = 0; index < tasksForWorker.length; index++){
        
        //workerFound.tasks.push(tasksForWorker[index]._id);
        
      }
      superviosrFound.projects.push(projectId)
      await superviosrFound.save();
      workerFound.projects.push(projectId)
      await workerFound.save();
      await project.save()
      newTasks.push({ workerId: worker.id, tasks: tasksForWorker });
    }
  }

  return newTasks;
};



// Function to generate a unique project ID
const generateProjectId = async () => {
  const lastProject = await Project.findOne({}, { projectId: 1 })
    .sort({ projectId: -1 })
    .exec();

  if (lastProject) {
    const lastId = parseInt(lastProject.projectId.substr(7)); // Extract the numeric part
    const newId = lastId + 1;
    return `NUPROJ${String(newId).padStart(3, "0")}`;
  } else {
    // If no projects exist, start with NUPROJ001
    return "NUPROJ001";
  }
};

const createProject = async (req, res) => {
  try {
    const {
      projectName,
      projectData,
      buildingData,
      projectDescription,
      projectFile,
      startDate,
      endDate,
      admin,
      workers,
      status,
    } = req.body;

    // Generate a unique project ID
    const projectId = await generateProjectId();
    

    const newProject = new Project({
      projectId,
      projectName,
      projectData,
      buildingData,
      projectDescription,
      projectFile,
      startDate,
      endDate,
      admin,
      workers,
      status,
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
    const assignedTasks = await distributeTasks(projectData, workers, savedProject._id)
    if(savedProject){
       
     /*  sendEmail(
          savedProject.workers.supervisor.email,
          "New Project Assigned",
          {
            name: savedProject.workers.supervisor.name,
            
          },
          "./template/newProject.handlebars"
        ); */
  }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error creating Project" });
  }
};

// to get all projects
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate('tasks').sort({ createdAt: -1 }).lean();
  if (!projects?.length) {
    return res.status(400).json({ message: "No Project found" });
  }
  res.json(projects);
});

//update project by using projectId
const updateProject = asyncHandler(async (req, res) => {
    try {
      const { projectId, updatedData, workers, taskData, buildingData } = req.body;
      console.log(req.body)
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }
     
      // Find the project by projectId
      const project = await Project.findOne({ projectId }).exec();
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      //console.log(project);
      console.log("BUILDING DATA", buildingData, "TASK DATA", taskData)
      if (taskData && buildingData) {
        const completeDataEntry = { buildingData, ...taskData };
        
        // Check if this data entry already exists in the completeData array
        const exists = project.completeData.some(entry =>
          JSON.stringify(entry) === JSON.stringify(completeDataEntry)
        );
      
        if (!exists) {
          project.completeData.push(completeDataEntry);
        }
      }
  
      // update the project fields that u want
      if (updatedData?.projectName) {
        project.projectName = updatedData?.projectName;
      }
      if (updatedData?.startDate) {
        project.startDate = updatedData?.startDate;
      }
      if (updatedData?.endDate) {
        project.endDate = updatedData?.endDate;
      }
      if (updatedData?.admin) {
        project.admin = updatedData?.admin;
      }
      console.log("found Workers", workers)
      if (workers) {
       
        for(const worker of workers){
          project.workers.push(worker)
        }
      }
      if (updatedData?.status) {
        project.status = updatedData?.status;
      }
      if (updatedData?.projectData) {
        project.projectData = updatedData?.projectData;
      }
      if (updatedData?.projectDescription) {
        project.projectDescription = updatedData?.projectDescription;
      }
  
      // Save the updated project
      const updatedProject = await project.save();
      
      console.log("updated project")
      console.log(updatedProject);
      if(updatedProject){
       
        /* sendEmail(
            updatedProject.sender.email,
            "Update in Projeect",
            {
              name: updatedProject.sender.name,
              
            },
            "./template/project.handlebars"
          ); */
    }
  
      return res.status(200).json({ message: `${updatedProject.projectName} updated!`, updatedProject });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating project' });
    }
  });
  


// to delete a projectId
const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.body;
    console.log(projectId);
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Find the project by projectId
    const project = await Project.findOne({ projectId }).exec();
    console.log(project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const deletedProject = await Project.deleteOne({ projectId });

    if (deletedProject.deletedCount === 1) {
      return res.status(200).json({ message: "Project deleted successfully" });
    } else {
      return res.status(500).json({ error: "Error deleting project" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting project" });
  }
});

//all exports
module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
};
