const mongoose = require('mongoose');

const Task = new mongoose.Schema({
  taskData: {
    type: Object,
    required: true,
   
  },
  projectId: {
    type: String,
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
  }
  
});

module.exports = mongoose.model('Task', Task);
