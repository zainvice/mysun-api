const express = require('express')
const router = express.Router()
const RegisterController = require('../controllers/authController')

router.post('/signup', RegisterController)