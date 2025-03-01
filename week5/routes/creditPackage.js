const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')

router.get('/', async (req, res, next) => {
    try {
        const data = await dataSource.getRepository("CreditPackage").find({
          select: ['id', 'name', 'credit_amount', 'price']
        })
        res.status(200).json({
          status: "success",
          data: data,
        })
      } catch (error) {
        next(error)
    }  
})

router.post('/', async (req, res, next) => {
})

router.delete('/:creditPackageId', async (req, res, next) => {
})

module.exports = router
