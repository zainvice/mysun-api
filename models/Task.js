const mongoose = require('mongoose');

const TaskAssignedSchema = new mongoose.Schema({
  taskData: {
    type: Object,
    required: true,
   
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
  }
  
});

module.exports = mongoose.model('TaskAssigned', TaskAssignedSchema);
