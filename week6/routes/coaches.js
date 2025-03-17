const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')

const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const coachesController = require('../controllers/coaches')

router.get('/', handleErrorAsync ( coachesController.getCoachList ))

router.get('/:coachId', handleErrorAsync ( coachesController.getCoachDetail ))

module.exports = router
