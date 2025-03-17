const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Skill')
const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const skillController = require('../controllers/skill')

router.get('/', handleErrorAsync ( skillController.getSkills ))

router.post('/', handleErrorAsync ( skillController.postSkill ))

router.delete('/:skillId', handleErrorAsync ( skillController.deleteSkill ))

module.exports = router
