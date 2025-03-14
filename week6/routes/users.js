const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('User')

const { isValidString, isValidPassword } = require('../utils/validUtils')
const { appError } = require('../utils/appError')

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

module.exports = router