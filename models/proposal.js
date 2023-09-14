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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    sender: {
      type: String,
      required: false,
    },
    reciever: {
      type: String,
      default: "User",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
