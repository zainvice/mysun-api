const User= require('../models/user')
const asyncHandler= require('express-async-handler')
const bcrypt = require('bcrypt')
const sendEmail = require("../utils/email/sendEmail");
// @des GET ALL USERS
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) =>{
        const users = await User.find().populate('tasks').populate('projects').select('-password').lean()
        if(!users?.length){
            return res.status(400).json({message: 'No users found'})
        }
        res.json(users)
})
// @des CREATE NEW USER
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) =>{
        const{email, fullName ,username ,phone, password, role, permissions}= req.body

        //Confirm data 
        if (!email|| !password || !phone){
                return res.status(400).json({message: 'All fields are required!'})

        }

        //Check for duplicates

        const duplicates = await User.findOne({email}).lean().exec()

        if(duplicates){
            return res.status(409).json({message: 'Email already exists! '})
        }

        // Hash password 

        const hashedPwd = await bcrypt.hash(password, 10)

        const userObject ={ email, fullName ,phone, username, "password": hashedPwd, role, permissions}

        // Create a store new user

        const user= await User.create(userObject)
        if(user){
            res.status(201).json({message: `New user ${email} created!`})
            sendEmail(
                user.email,
                "Account Successfully Created",
                {
                  name: user.fullName,
                  
                },
                "./template/welcome.handlebars"
              );
        } else{
            res.status(400).json({message: 'Invaild Data used'})
        }
        
})

// @des Update USER
// @route Patch /users
// @access Private

const updateUser = asyncHandler(async (req, res) =>{
    const {email, phone, role, password, active, permissions, username, notes}= req.body

    //Confirm Data
    if(!email){
        return res.status(400).json({message: 'Email required!'})
    }
    
    const user = await User.findOne({email}).exec()
    
    if(!user){
        return res.status(400).json({message: 'User not found!'})
    }
    console.log(user)
    //Check for duplicates

    /*const duplicates= await User.findOne({email}).lean().exec()

    //Allow updates to the original user
    if (duplicates){
            return res.status(409).json({message: 'Duplicate email'})
    }*/
    if(user.email !== email){
        user.email = email
    }
    if(role){
        user.role= role
    }
    if (phone){
        user.phone=phone
    }
    if (username){
        user.username=username
    }

    if(active||active!=undefined){
        user.active=active
    }
    if(password){
        //Hash Password
        user.password = await bcrypt.hash(password, 10)
    }
    if(permissions){
        //Hash Password
        user.permissions = permissions
    }
    if(notes){
        user.notes= notes
    }
    const updatedUser= await user.save()
    
    console.log(updatedUser)

    res.json({message: `${updatedUser.email} updated!`})
    
})

// @des delete USER
// @route delete /users
// @access Private

const deleteUser = asyncHandler(async (req, res) =>{
    const {_id, active}= req.body
    if(!_id){
        return res.status(400).json({message: 'ID Required'})

    }
    console.log(_id, active)
    /*const note= await Note.findOne({email}).lean().exec()

    if(note){
        return res.status(400).json({message: 'User has assigned tasks'})
    }*/
    const user = await User.findById(_id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})

    }
    let result
    if(!active&&active===undefined){
        result = await user.deleteOne()
    }
    if(active===true){
        user.active= false
        result = await User.findByIdAndUpdate(user._id, user)
    }
    if(active===false){
        user.active= true
        result = await User.findByIdAndUpdate(user._id, user)
    }
    console.log(result)

    const reply = `Email ${result.email} with ID ${result._id} deleted!`

    res.json(reply)
})


module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}