const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const isAuth = require('../middlewares/isAuth')
const creditPackageController = require('../controllers/creditPackage')

router.get('/', handleErrorAsync ( creditPackageController.getCreditPackages ))

router.post('/', handleErrorAsync ( creditPackageController.postCreditPackage ))

router.post('/:creditPackageId', isAuth, handleErrorAsync ( creditPackageController.postPurchaseCreditPackage ))

router.delete('/:creditPackageId', handleErrorAsync ( creditPackageController.deleteCreditPackage ))

module.exports = router
