const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      Unique: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectData: {
      type: Object,
      required: false,
    },
    originalData: {
      type: Object,
      required: false,
    },
    projectFile: {
      type: Buffer, 
      required: false, 
    },
    projectDescription: {
        type:String,
        required: false
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    admin: {
      type: String,
      required: false,
    },
    workers: [{
      type: Object,
      default: "Worker",
    }],
    status: {
      type: String,
      default: "Pending",
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }],
    buildingData: {
      type: Object
    },
    completeData:[{
      type: Object
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
