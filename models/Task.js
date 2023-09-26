const mongoose = require('mongoose');

const Task = new mongoose.Schema({
  taskData: {
    type: Object,
    required: true,
   
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  notes: {
    type: String,
  },
  status:{
    type: String,
    default:"Pending",
  },
  worker: {
    type: Object
  },
  supervisor:{
    type: Object
  },
  timeTaken:{
    
  }
  
});

module.exports = mongoose.model('Task', Task);
