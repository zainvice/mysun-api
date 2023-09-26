const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    username: {
        type: String,
        required: false

    },
    phone: {
        type: String,
        required: false
    },
    GST: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "Worker"
    },
    active: {
        type: Boolean,
        default: true
    },
    OTP: {
        type: String
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    permissions: [{
        type: String,
    }

    ],
    userData:{
        type: Object,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    lastLogin: {
       
    }


},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema)