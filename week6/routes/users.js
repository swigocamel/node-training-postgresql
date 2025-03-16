const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('User')

const { isValidString, isValidPassword } = require('../utils/validUtils')
const appError = require('../utils/appError')
const { generateJWT } = require('../utils/jwtUtils')
const isAuth = require('../middlewares/isAuth')

const saltRounds = 10

router.get('/signup', async (req, res, next) => {
  try {
    const data = await dataSource.getRepository("User").find({
      select: ['id', 'name', 'email', 'role']
    })

    res.status(200).json({
      status: "success",
      data: data,
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

router.post('/signup', async (req, res, next) => {
   try {
    const { name, email, password } = req.body

    if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
      next(appError(400, "欄位未正確填寫"))
      return
    }

    if (!isValidPassword(password)) {
      next(appError(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"))
      return
    }

    const userRepo = dataSource.getRepository("User");
    const findUser = await userRepo.findOne({
      where: { 
        email: email
      } 
    })

    if (findUser) {
      next(appError(409, "Email已被使用"))
      return
    }

    const hashPassword = await bcrypt.hash(password, saltRounds)
    const newUser = userRepo.create({
      name,
      password: hashPassword,
      email,
      role: 'USER'
    })
    const result = await userRepo.save(newUser)

    res.status(201).json({
      status : "success",
      data: {
        user: {
          id: result.id,
          name: result.name
        }
      }
    })
   } catch (error) {
    logger.error(error)
    next(error)
   }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!isValidString(email) ||! isValidString(password)) {
      next(appError(400, '欄位未填寫正確'))
      return
    }
    if(!isValidPassword(password)) {
      next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'))
      return
    }

    
    const userRepo = dataSource.getRepository('User')
    // 使用者不存在或密碼輸入錯誤
    const findUser = await userRepo.findOne({
      select:['id', 'name', 'password'],
      where: {
        email: email
      }
    })
    if (!findUser) {
      next(appError(400, '使用者不存在或密碼錯誤'))
      return
    }

    const isMatch = await bcrypt.compare(password, findUser.password)
    if (!isMatch) {
      next(appError(400, '使用者不存在或密碼錯誤'))
      return
    }
  
    // TODO JWT
    const token = generateJWT({
      id: findUser.id,
      role: findUser.role
    })

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          name: findUser.name
        }
      }
    })
  } catch (error) {
    logger.error('登入錯誤:', error)
    next(error)
  }
})

router.get('/profile', isAuth, async (req, res, next) => {
  try {
    const { id } = req.user

    if (!isValidString(id)) {
      next(appError(400, '欄位未填寫正確'))
      return
    }

    const findUser = await dataSource.getRepository('User').findOne({
      where: {
        id: id
      }
    })
    
    res.status(200).json({
      status: 'success',
      data: {
        email: findUser.email,
        name: findUser.name
      }
    })
  } catch (error) {
    logger.error('取得使用者資料錯誤:', error)
    next(error)
  }
})
module.exports = router