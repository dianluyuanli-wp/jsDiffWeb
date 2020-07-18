var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    //前端渲染
    //  入口文件位置 ./entry/index.js 
    //  html文件 ./view/index.html
    res.render('index');
});

module.exports = router;

