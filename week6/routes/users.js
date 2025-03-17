const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('User')

const { isValidString, isValidPassword } = require('../utils/validUtils')
const appError = require('../utils/appError')
const { generateJWT } = require('../utils/jwtUtils')
const isAuth = require('../middlewares/isAuth')
const handleErrorAsync = require('../utils/handleErrorAsync')
const usersController = require('../controllers/users')

const saltRounds = 10

router.get('/signup', handleErrorAsync ( usersController.getUsersSignup ))

router.post('/signup', handleErrorAsync ( usersController.postUsersSignup ))

router.post('/login', handleErrorAsync ( usersController.postUsersLogin ))

router.get('/profile', isAuth, handleErrorAsync ( usersController.getUsersProfile ))

router.put('/profile', isAuth, handleErrorAsync ( usersController.putUsersProfile ))
module.exports = router