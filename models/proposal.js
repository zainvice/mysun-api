const mongoose = require ('mongoose')

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
    },
    projectData: {
        type: Object,
        required: false
    },
    sender: {
        type: String,
        required: false
    },
    reciever: {
        type: String,
        default: "User",
    },
    status: {
        type: String,
        default: "Pending",
    }
    

},
{
    timestamps:true
}
)

module.exports = mongoose.model('Project', projectSchema)