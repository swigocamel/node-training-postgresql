const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')

const { isValidString, isNumber } = require('../utils/validUtils')
const appError = require('../utils/appError')
const isAuth = require('../middlewares/isAuth')
const isCoach = require('../middlewares/isCoach')
const handleErrorAsync = require('../utils/handleErrorAsync')

router.post('/coaches/courses', isAuth, isCoach, handleErrorAsync ( async (req, res, next) => {
      // TODO 可以做檢查日期格式
      // 可以用 moment
      const { user_id, skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body
      if(!isValidString(user_id) || !isValidString(skill_id) || !isValidString(name)
      || !isValidString(description) || !isValidString(start_at) || !isValidString(end_at)
      || !isNumber(max_participants) || !isValidString(meeting_url) || !meeting_url.startsWith('https')) {
        return next(appError(400, '欄位未填寫正確'))
      }
      
      const userRepo = dataSource.getRepository("User")
      const findUser = await userRepo.findOne({
        where: {
          id: user_id
        }
      })

      if(!findUser) {
        return next(appError(400, '使用者不存在'))
      } else if (findUser.role != 'COACH') {
        return next(appError(400, '使用者尚未成為教練'))
      }

      const courseRepo = dataSource.getRepository("Course")
      const newCourse = courseRepo.create({
        user_id,
        skill_id,
        name,
        description,
        start_at,
        end_at,
        max_participants,
        meeting_url
      })

      const result = await courseRepo.save(newCourse)
  
      res.status(201).json({
        status: "success",
        data: {
          course: result
        }
      })
}))

router.put('/coaches/courses/:courseId', isAuth, isCoach, handleErrorAsync ( async (req, res, next) => {
      const { courseId } = req.params
      // TODO 可以做檢查日期格式
      // 可以用 moment
      const { skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body
      if( !isValidString(courseId)
      ||  !isValidString(skill_id) || !isValidString(name)
      || !isValidString(description) || !isValidString(start_at) || !isValidString(end_at)
      || !isNumber(max_participants) || !isValidString(meeting_url) || !meeting_url.startsWith('https')) {
        return next(appError(400, '欄位未填寫正確'))
      }

      const courseRepo = dataSource.getRepository("Course")
      const findCourse = await courseRepo.findOne({
        where: {
          id: courseId
        }
      })

      if(!findCourse) {
        return next(appError(400, '課程不存在'))
      }

      const updateCourse = await courseRepo.update({
        id: courseId
      }, {
        skill_id,
        name,
        description,
        start_at,
        end_at,
        max_participants,
        meeting_url
      })

      if (updateCourse.affected === 0) {
        return next(appError(400, '更新課程失敗'))
      }

      const result = await courseRepo.findOne({
        where: {
          id: courseId
        }
      })
  
      res.status(201).json({
        status: "success",
        data: {
          course: result
        }
      })
}))

router.post('/coaches/:userId', handleErrorAsync ( async (req, res, next) => {
    const { userId } = req.params
    const { experience_years, description, profile_image_url } = req.body

    if(!isValidString(userId) || !isNumber(experience_years) || !isValidString(description)) {
      return next(appError(400, '欄位未填寫正確'))
    }

    if(profile_image_url && isValidString(profile_image_url) && !profile_image_url.includes('https')) {
      return next(appError(400, '欄位未填寫正確'))
    }

    const userRepo = dataSource.getRepository("User")
    const findUser = await userRepo.findOne({
      where: {
        id: userId
      }
    })

    if(!findUser) {
      return next(appError(400, '使用者不存在'))
    } else if (findUser.role === 'COACH') {
      return next(appError(400, '使用者已經是教練'))
    }

    const updateUser = await userRepo.update({
      id: userId
    }, {
      role: 'COACH'
    })

    if (updateUser.affected === 0) {
      return next(appError(400, '更新使用者失敗'))
    }

    const coachRepo = dataSource.getRepository("Coach")
    const newCoach = coachRepo.create({
      user_id: userId,
      description,
      profile_image_url,
      experience_years,
    })

    const coachResult = await coachRepo.save(newCoach)
    const userResult = await userRepo.findOne({
      where: {
        id: userId
      }
    })

    res.status(201).json({
      status: "success",
      data: {
        user: {
          name: userResult.name,
          role: userResult.role
        },
        coach: coachResult
      }
    })
}))



module.exports = router