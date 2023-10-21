const mongoose = require('mongoose');

const Task = new mongoose.Schema({
  taskData: {
    type: Object,
    required: true,
   
  },
  taskName:{
    type: String,
    
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
    type: Number,
    default: 0
  },
  manual:{
    type: Boolean
  },
  timer:{
    type: Date
  },
  statusHistory:[{
    type: Object
  }]
  
}, 
{
    timestamps:true
}
);

module.exports = mongoose.model('Task', Task);
