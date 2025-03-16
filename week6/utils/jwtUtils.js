const jwt = require('jsonwebtoken')
const config = require('../config/index')
const appError = require('./appError')

const generateJWT = (payload)=> {
  // 產生 JWT token
  return jwt.sign(
      payload, // payload：Token 內存的資訊
      config.get('secret.jwtSecret'), // secret: 密鑰，存放於環境變數提高安全性
      { expiresIn: config.get('secret.jwtExpiresDay') } //options：包含 expiresIn (效期)
  );
}

module.exports = { 
  generateJWT,
};
