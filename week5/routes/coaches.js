const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')

const { isValidString, isNumber } = require('../utils/validUtils')

router.get('/', async (req, res, next) => {
  try {
    const { per, page } = req.query
    if(!isValidString(per) || !isValidString(page)) {
        res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    // per & page 轉成數字
    const perNum = parseInt(per)
    const pageNum = parseInt(page)

    // 取得教練列表
    const coachRepo = dataSource.getRepository('User')
    const coaches = await coachRepo.find({
      where: {
        role: 'COACH'
      },
      select: ['id', 'name', 'email', 'role'],
      skip: perNum * (pageNum - 1),
      take: perNum
    })

    const coachResult = coaches.map(coach => {
      return {
        id: coach.id,
        name: coach.name,
      }
    })

    res.status(200).json({
        status: "success",
        data: coachResult
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

module.exports = router
