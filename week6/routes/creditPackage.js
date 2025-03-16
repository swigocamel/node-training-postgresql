const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const isAuth = require('../middlewares/isAuth')

router.get('/', handleErrorAsync ( async (req, res, next) => {
        const data = await dataSource.getRepository("CreditPackage").find({
          select: ['id', 'name', 'credit_amount', 'price']
        })
        res.status(200).json({
          status: "success",
          data: data,
        })
}))

router.post('/', handleErrorAsync ( async (req, res, next) => {
        const { name, credit_amount, price } = req.body
        if (!isValidString(name) || !isNumber(credit_amount) || !isNumber(price)) {
          return next(appError(400, "欄位未正確填寫"))
        }

        const CreditPackage = dataSource.getRepository("CreditPackage");
        const findCreditPackage = await CreditPackage.find({
          where: { 
            name: name
          } 
        })
        if (findCreditPackage.length > 0) {
          return next(appError(409, "資料重複"))
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
}))

router.post('/:creditPackageId', isAuth, handleErrorAsync ( async (req, res, next) => {
        const { creditPackageId } = req.params

        const findCreditPackage = await dataSource.getRepository('CreditPackage').findOne({
          where: { 
            id: creditPackageId
          } 
        })
        if (!findCreditPackage) {
          return next(appError(400, "ID錯誤"))
        }

        res.status(200).json({
          status: "success",
          data: [],
        })
}
))

router.delete('/:creditPackageId', handleErrorAsync ( async (req, res, next) => {
        const { creditPackageId } = req.params
  
        if (!isValidString(creditPackageId)) {
          return next(appError(400, "ID錯誤"))
        }
  
        const result = await dataSource.getRepository("CreditPackage").delete(creditPackageId);
        if (result.affected === 0) {
          return next(appError(404, "找不到資料"))
        }
        
        res.status(200).json({
          status: "success",
          message: "刪除成功",
        })
}))

module.exports = router
