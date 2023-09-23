const Project = require("../models/project");
const asyncHandler = require("express-async-handler");

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

    // Send email code here...

  } catch (error) {
    res.status(500).json({ error: "Error creating Project" });
  }
};

// to get all projects
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().lean();
  if (!projects?.length) {
    return res.status(400).json({ message: "No Project found" });
  }
  res.json(projects);
});

//update project by using projectId
const updateProject = asyncHandler(async (req, res) => {
    try {
      const { projectId, updatedData } = req.body;
      console.log('I\'m here');
  
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }
  
      // Find the project by projectId
      const project = await Project.findOne({ projectId }).exec();
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      console.log(project);
  
      // update the project fields that u want
      if (updatedData.projectName) {
        project.projectName = updatedData.projectName;
      }
      if (updatedData.startDate) {
        project.startDate = updatedData.startDate;
      }
      if (updatedData.endDate) {
        project.endDate = updatedData.endDate;
      }
      if (updatedData.admin) {
        project.admin = updatedData.admin;
      }
      if (updatedData.workers) {
        project.workers = updatedData.workers;
      }
      if (updatedData.status) {
        project.status = updatedData.status;
      }
      if (updatedData.projectData) {
        project.projectData = updatedData.projectData;
      }
      if (updatedData.projectDescription) {
        project.projectDescription = updatedData.projectDescription;
      }
  
      // Save the updated project
      const updatedProject = await project.save();
      
      console.log("updated project")
      console.log(updatedProject);
      if(updatedProject){
       
        sendEmail(
            updatedProject.sender.email,
            "Update in Projeect",
            {
              name: updatedProject.sender.name,
              
            },
            "./template/project.handlebars"
          );
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
