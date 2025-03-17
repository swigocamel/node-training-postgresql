const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('UsersController')
const { isValidString } = require('../utils/validUtils')

const usersController = {
  async getUsersSignup (req, res, next)  {
    const data = await dataSource.getRepository("User").find({
        select: ['id', 'name', 'email', 'role']
      })
  
      res.status(200).json({
        status: "success",
        data: data,
      })
    },

  async postUsersSignup (req, res, next)  {
    const { name, email, password } = req.body

    if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
      return next(appError(400, "欄位未正確填寫"))
    }

    if (!isValidPassword(password)) {
      return next(appError(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"))
    }

    const userRepo = dataSource.getRepository("User");
    const findUser = await userRepo.findOne({
      where: { 
        email: email
      } 
    })

    if (findUser) {
      return next(appError(409, "Email已被使用"))
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
  },

  async postUsersLogin (req, res, next)  {
    const { email, password } = req.body
    if (!isValidString(email) ||! isValidString(password)) {
      return next(appError(400, '欄位未填寫正確'))
    }
    if(!isValidPassword(password)) {
      return next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'))
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
      return next(appError(400, '使用者不存在或密碼錯誤'))
    }

    const isMatch = await bcrypt.compare(password, findUser.password)
    if (!isMatch) {
      return next(appError(400, '使用者不存在或密碼錯誤'))
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
  },

  async getUsersProfile (req, res, next)  {
    const { id } = req.user

    if (!isValidString(id)) {
      return next(appError(400, '欄位未填寫正確'))
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
  },

  async putUsersProfile (req, res, next)  {
    const { id } = req.user
    const { name } = req.body
    if (!isValidString(name)) {
      return next(appError('400', '欄位未填寫正確'))
    }
    const userRepo = dataSource.getRepository('User')

    // TODO 檢查使用者名稱未變更
    const findUser = await userRepo.findOne({
      where: {
        id
      }
    })

    if (findUser.name === name) {
      return next(appError(400, '使用者名稱未變更'))
    }
    
    const updateUser = await userRepo.update({
      id
    }, {
      name
    })

    if (updateUser.affected === 0) {
      return next(appError(400, '更新使用者失敗'))
    }
    
    res.status(200).json({
      status: 'success',
    })
  }
}

module.exports = usersController