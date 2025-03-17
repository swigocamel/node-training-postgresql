const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')

const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const isAuth = require('../middlewares/isAuth')
const isCoach = require('../middlewares/isCoach')
const handleErrorAsync = require('../utils/handleErrorAsync')
const adminController = require('../controllers/admin')

router.post('/coaches/courses', isAuth, isCoach, handleErrorAsync ( adminController.postCourses ))

router.put('/coaches/courses/:courseId', isAuth, isCoach, handleErrorAsync ( adminController.putCourses ))

router.post('/coaches/:userId', handleErrorAsync ( adminController.postCoaches ))



module.exports = router