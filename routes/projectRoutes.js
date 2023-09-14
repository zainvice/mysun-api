const express = require('express')
const router =express.Router()
const projectController = require('../controllers/projectController')


router.route('/')
    
    .get(projectController.getAllProjects) //READ
    .post(projectController.createProject) //CREATE
    .patch(projectController.updateProject) //UPDATE
    .delete(projectController.deleteProject) //DELETE

module.exports=router