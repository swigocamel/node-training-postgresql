const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Skill')
const { isValidString, isNumber } = require('../utils/validUtils')
const { appError } = require('../utils/appError')

router.get('/', async (req, res, next) => {
    try {
        const data = await dataSource.getRepository("Skill").find({
          select: ['id', 'name']
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
        const { name } = req.body
        if (!isValidString(name)) {
          next(appError(400, "欄位未正確填寫"))
          return
        }

        const skillRepo = dataSource.getRepository("Skill");
        const findSkill = await skillRepo.find({
          where: { 
            name: name
          } 
        })
        if (findSkill.length > 0) {
          next(appError(409, "資料重複"))
          return
        }

        const newSkill = skillRepo.create({
          name
        })

        const result = await skillRepo.save(newSkill);

        res.status(200).json({
          status: "success",
          data: result,
        })
      } catch (error) {
        next(error)
    }
})

router.delete('/:skillId', async (req, res, next) => {
    try {
        const { skillId } = req.params
  
        if (!isValidString(skillId)) {
          next(appError(400, "ID錯誤"))
          return
        }
  
        const result = await dataSource.getRepository("Skill").delete(skillId);
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
