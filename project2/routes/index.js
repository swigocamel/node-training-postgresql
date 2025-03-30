var express = require('express');
var router = express.Router();
require('dotenv').config();

const {TEXT} = process.env;
console.log(TEXT);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', TEXT });
});

module.exports = router;
