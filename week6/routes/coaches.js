const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')

const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')

router.get('/', handleErrorAsync ( async (req, res, next) => {
    const { per, page } = req.query
    if(!isValidString(per) || !isValidString(page)) {
      return next(appError(400, '欄位未填寫正確'))
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
}))

router.get('/:coachId', handleErrorAsync ( async (req, res, next) => {
      const { coachId } = req.params
      if(!isValidString(coachId)) {
        return next(appError(400, '欄位未填寫正確'))
      }

      const coachRepo = dataSource.getRepository('Coach')
      const userRepo = dataSource.getRepository('User')
      const findCoach = await coachRepo.findOne({
        where: {
          user_id: coachId
        }
      })

      if (!findCoach) {
        return next(appError(404, '找不到教練'))
      }

      const userResult = await userRepo.findOne({
        where: {
          id: coachId
        }
      })

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            name: userResult.name,
            role: userResult.role
          },
          coach: {
            id: findCoach.id,
            user_id: findCoach.user,
            experienced_years: findCoach.experienced_years,
            description: findCoach.description,
            profile_image_url: findCoach.profile_image_url,
            created_at: findCoach.created_at,
            updated_at: findCoach.updated_at
          }
        }
      })
  }))

module.exports = router
