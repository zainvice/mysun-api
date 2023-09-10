const express = require('express')
const router =express.Router()
const adminController = require('../controllers/adminController')


router.route('/')
    .get(adminController.getAllAdmins)  //READ
    .post(adminController.createNewAdmin) //CREATE
    .patch(adminController.updateAdmin) //UPDATE
    .delete(adminController.deleteAdmin) //DELETE

module.exports=router
