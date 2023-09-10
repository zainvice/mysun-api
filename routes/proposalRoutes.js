const express = require('express')
const router =express.Router()
const proposalControllers = require('../controllers/proposalController')
/*const verifyJWT = require ('../middleware/verifyJWT')

router.use(verifyJWT)*/

router.route('/')
    .get(proposalControllers.getAllproposals)  //READ
    .post(proposalControllers.createNewproposal) //CREATE
    .patch(proposalControllers.updateproposal) //UPDATE
    .delete(proposalControllers.deleteproposal) //DELETE

module.exports=router
