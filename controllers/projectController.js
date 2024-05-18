const Project = require("../models/project");
const asyncHandler = require("express-async-handler");
const Task = require("../models/Task")
const User = require("../models/user")

function compareTasks(task1, task2) {
  for (const key in task1) {
    if (task1[key] !== task2[key]) {
      return false;
    }
  }
  return true;
}

const createTasks = async (projectData, workers, projectId) => {
  const nonSupervisorWorkers = workers.filter(worker => worker.role !== 'supervisor');
  const SupervisorWorkers = workers.filter(worker => worker.role === 'supervisor');
  console.log("PROJECT DATA GO NOW", projectData)

  if (projectData.tasks.length === 0) {
    //console.log("No tasks to distribute or no non-supervisor workers.");
    return [];
  }

  // Calculate the number of tasks per non-supervisor worker
  const tasksPerWorker = Math.ceil(projectData.tasks.length / nonSupervisorWorkers.length);
  let tasknum=0
  const newTasks = [];
  const semail = SupervisorWorkers[0].email
  const superviosrFound = await User.findOne({email: semail}).exec()
  const project = await Project.findById({_id: projectId});
  for(const task of projectData?.tasks){
    //console.log(task)
    const taskData= task.tasksData
    try{
      const newTask = await Task.create({ taskData: task, projectId, supervisor: superviosrFound});
      if(newTask){
        console.log("TASK CREATED SUCCESSFULLY!")
      }
      if(newTask && project){
        
        project.tasks.push(newTask._id)
        console.log("ADDED TO PROJECT!")
      }
    }catch(error){
      console.error("COULDN\"T CRETE TASK")
      return; 
    }
    
  }
  for (let index = 0; index < nonSupervisorWorkers.length; index++) {
    const worker = nonSupervisorWorkers[index];
    const startIndex = index * tasksPerWorker;
    const endIndex = Math.min((index + 1) * tasksPerWorker, projectData.tasks.length);
    const workerTasks = projectData.tasks.slice(startIndex, endIndex);
    const email = worker.email;

    const workerFound = await User.findOne({ email }).exec();
    const semail = SupervisorWorkers[0].email
    const superviosrFound = await User.findOne({email: semail}).exec()
    
    
    
    if (workerFound) {
      
      superviosrFound.projects.push(projectId)
      await superviosrFound.save();
      workerFound.projects.push(projectId)
      await workerFound.save();
      
      newTasks.push({ workerId: worker.id});
    }
  }
  await project.save()

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
      originalData: projectData,
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
    console.log("SAVING PROJECT DONE")
    console.log("SENDING BUIDLING DATA", buildingData)
    const assignedTasks = await createTasks(buildingData, workers, savedProject._id)

    console.log("Done creating tasks")
    if(savedProject&&assignedTasks){
       return res.status(201).json({message: `Project ${savedProject.projectName} created successfully!` });
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
    console.log("DANG IT")
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
    
         try{
          const { projectId, updatedData, workers, taskData, buildingData, manual, resetType, updateWorkers, removedWorker } = req.body;
      console.log(req.body)
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }
      console.log(req.body)
      if(manual===true){
        taskData['manual'] = 'Manually entered';
      }
      // Find the project by projectId
      const project = await Project.findOne({ projectId }).exec();
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      ////console.log(project);
      //console.log("BUILDING DATA", buildingData, "TASK DATA", taskData)

      if (taskData && buildingData) {
        const completeDataEntry = { "building number": buildingData, ...taskData };
        
        // Check if this data entry already exists in the completeData array
        const existingIndex = project.completeData.findIndex(entry => entry["building number"] === buildingData);
        //console.log(existingIndex)
        if (existingIndex !== -1) {
          // Update the existing entry with the new data
          Object.assign(project.completeData[existingIndex], completeDataEntry);
        } else {
          // Add the new entry to the completeData array
          project.completeData.push(completeDataEntry);
        }

      }
      //console.log("Updated Here", project)
      if(taskData){
        if (taskData) {
          if (resetType === "Full" || resetType === "Partial") {
            consol.log("DID'nt")
            const { ["building number"]: removedBuildingNumber, ...newTaskData } = taskData;
        
            
            const data = project.projectData.tasks;
            data.push(newTaskData);
        
            
            const newData = { tasks: data };
            project.projectData = newData;
        
            
            console.log("Removed 'building number':", removedBuildingNumber);
        } else {
            console.log("HERE")
            // Your existing logic to filter out taskData
            const taskDataString = JSON.stringify(taskData);
            const newprojectdata = project.projectData.tasks.filter((task) => {
              const taskString = JSON.stringify(task);
              return taskString !== taskDataString;
            });
            const projectData = {tasks: newprojectdata}
            project.projectData = projectData
            console.log("NOT HERE")
          }
        }
        
        
        /* const taskDataString = JSON.stringify(taskData);
        const newprojectdata = project.projectData.tasks.filter(task => {
          const taskString = JSON.stringify(task);
          ////console.log("TASK", taskString)
          ////console.log("TASK DATA", taskDataString)
          return taskString !== taskDataString;
        });
        
        const projectData = {tasks: newprojectdata}
        project.projectData = projectData */
       
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
      
      if (workers&&!updateWorkers) {
       
        for(const worker of workers){
          project.workers.push(worker)
          const workere = await User.findOne({email: worker.email}).populate('projects').exec()
          if(workere){
            console.log("Before filter",workere.projects)
            console.log("project", project.projectId)
            console.log("worker projects", workere.projects)
            if (workere.projects) {
              // Check if the project is already in the worker's projects
              const projectExists = workere.projects.some(projecte => projecte.projectId === project.projectId);
              
              // If the project doesn't exist, add it
              if (!projectExists) {
                  console.log("updating worker projects");
                  workere.projects.push(project);
              }
            } else {
                // If the worker doesn't have any projects, add the project
                console.log("updating worker projects");
                workere.projects = [project];
            }
            console.log("After filter",workere.projects)
            const updatedWorkere = await User.findByIdAndUpdate(workere._id, workere)
            if(updatedWorkere){
              console.log("Worker updated successfully and added to the project!")
            }
          }
        }
      }
      if (workers&&updateWorkers&&removedWorker) {
        project.workers = workers
        if(removedWorker){
           const worker = await User.findOne({email: removedWorker.email}).populate('projects').exec()
           if(worker){
             console.log("Before filter",worker.projects)
             console.log("project", project.projectId)
             worker.projects = worker.projects.filter((projecte)=> projecte.projectId!==project.projectId)
             console.log("After filter",worker.projects)
             const updatedWorker = await User.findByIdAndUpdate(worker._id, worker)
             if(updatedWorker){
               console.log("Worker updated successfully and removed from project!")
             }
           }
        }
      }
      if (updatedData?.status) {
        project.status = updatedData?.status;
      }
     /*  if (updatedData?.projectData) {
        project.projectData = updatedData?.projectData;
      } */
      if (updatedData?.projectDescription) {
        project.projectDescription = updatedData?.projectDescription;
      }
  
      // Save the updated project
      const updatedProject = await Project.findByIdAndUpdate(project._id, project);
      
      console.log("updated project")
      //console.log(updatedProject);
      if(updatedProject){
        console.log("SENDING RESPONSE")
        return res.status(200).json({ message: `${updatedProject.projectName} updated!`});
       
        /* sendEmail(
            updatedProject.sender.email,
            "Update in Projeect",
            {
              name: updatedProject.sender.name,
              
            },
            "./template/project.handlebars"
          ); */
      }
         }catch(error){
           console.log("Error",error)
         }
  
      
   
      
   
  });
  


// to delete a projectId
const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.body;
    console.log(req.body);
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Find the project by projectId
    const project = await Project.findById({ _id: projectId }).exec();
    //console.log(project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project) {
      const taskIds = project.tasks.map((task) => task._id);
    
      try {
       
        const removedTasks = await Task.deleteMany({ _id: { $in: taskIds } }).exec();
    
        console.log(`${removedTasks.deletedCount} tasks deleted.`);
      } catch (error) {
        console.error('Error occurred while deleting tasks', error);
        
      }
      const users = await User.find().populate('projects').select('-password').lean()
      if (users) {
        users.forEach((user) => {
          if (user.projects) {
            user.projects = user.projects.filter((projecte) => projecte._id !== project._id);
          }
        });
      }
      
    }

    
    const deletedProject = await Project.deleteOne({ _id: project._id });

    if (deletedProject) {
      return res.status(200).json({ message: "Project deleted successfully" });
    } else {
      return res.status(502).json({ error: "Error deleting project" });
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
