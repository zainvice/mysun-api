const express = require('express')
const router =express.Router()
const taskController = require('../controllers/taskController')


router.route('/')
    
    .get(taskController.getAllTaskAssignments) //READ
    .post(taskController.createTaskAssignment) //CREATE
    .patch(taskController.updateTaskAssignmentById) //UPDATE
    .delete(taskController.deleteTaskAssignmentById) //DELETE
router.route('/byId')
    .post(taskController.getTaskById);

module.exports=router