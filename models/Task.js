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
  classification:{
    type: String,
    default:"None",
  },
  propertyType:[{
    type: String,
    default:"None",
  }],
  stats:[{
    type: String,
    default:"None",
  }],
  floor:{
    type:String,

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
  }],
  classificationHistory:[{
    type: Object
  }],
  propertyTypeHistory:[{
    type: Object
  }],
  statsHistory:[{
    type: Object
  }]
  
}, 
{
    timestamps:true
}
);

module.exports = mongoose.model('Task', Task);
