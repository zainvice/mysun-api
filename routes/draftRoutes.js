const express = require('express')
const router =express.Router()
const draftControllers = require('../controllers/draftController')
/*const verifyJWT = require ('../middleware/verifyJWT')

router.use(verifyJWT)*/

router.route('/')
    .get(draftControllers.getAlldrafts)  //READ
    .post(draftControllers.createNewdraft) //CREATE
    .patch(draftControllers.updatedraft) //UPDATE
    .delete(draftControllers.deletedraft) //DELETE

module.exports=router
