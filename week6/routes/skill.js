const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Skill')
const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')

router.get('/', handleErrorAsync ( async (req, res, next) => {
        const data = await dataSource.getRepository("Skill").find({
          select: ['id', 'name']
        })
        res.status(200).json({
          status: "success",
          data: data,
        })
}))

router.post('/', handleErrorAsync ( async (req, res, next) => {
        const { name } = req.body
        if (!isValidString(name)) {
          return next(appError(400, "欄位未正確填寫"))
        }

        const skillRepo = dataSource.getRepository("Skill");
        const findSkill = await skillRepo.find({
          where: { 
            name: name
          } 
        })
        if (findSkill.length > 0) {
          return next(appError(409, "資料重複"))
        }

        const newSkill = skillRepo.create({
          name
        })

        const result = await skillRepo.save(newSkill);

        res.status(200).json({
          status: "success",
          data: result,
        })
}))

router.delete('/:skillId', handleErrorAsync ( async (req, res, next) => {
        const { skillId } = req.params
  
        if (!isValidString(skillId)) {
          return next(appError(400, "ID錯誤"))
        }
  
        const result = await dataSource.getRepository("Skill").delete(skillId);
        if (result.affected === 0) {
          return next(appError(404, "找不到資料"))
        }
        
        res.status(200).json({
          status: "success",
          message: "刪除成功",
        })
}))

module.exports = router
