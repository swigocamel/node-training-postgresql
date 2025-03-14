const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isValidString, isNumber } = require('../utils/validUtils')
const { appError } = require('../utils/appError')

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
    try {
        const { name, credit_amount, price } = req.body
        if (!isValidString(name) || !isNumber(credit_amount) || !isNumber(price)) {
          next(appError(400, "欄位未正確填寫"))
          return
        }

        const CreditPackage = dataSource.getRepository("CreditPackage");
        const findCreditPackage = await CreditPackage.find({
          where: { 
            name: name
          } 
        })
        if (findCreditPackage.length > 0) {
          next(appError(409, "資料重複"))
          return
        }

        const newCreditPackage = CreditPackage.create({
          name,
          credit_amount,
          price
        })

        const result = await CreditPackage.save(newCreditPackage);

        res.status(200).json({
          status: "success",
          data: result,
        })
      } catch (error) {
        next(error)
    }
})

router.delete('/:creditPackageId', async (req, res, next) => {
    try {
        const { creditPackageId } = req.params
  
        if (!isValidString(creditPackageId)) {
          next(appError(400, "ID錯誤"))
          return
        }
  
        const result = await dataSource.getRepository("CreditPackage").delete(creditPackageId);
        if (result.affected === 0) {
          next(appError(404, "找不到資料"))
          return
        }
        
        res.status(200).json({
          status: "success",
          message: "刪除成功",
        })
      } catch (error) {
        next(error)
      }  
})

module.exports = router
