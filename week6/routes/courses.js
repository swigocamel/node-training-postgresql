const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')

const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const coursesController = require('../controllers/courses')

router.get('/', handleErrorAsync ( coursesController.getCourses ))

module.exports = router