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
            ref: "Projects"
        }
    ],
    permissions: [{
        type: String,
    }

    ],
    userData:{
        type: Object,
    }

    


},
{
    timestamps:true
}
)

module.exports = mongoose.model('User', userSchema)