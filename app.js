//  这个东西本质是服务器，根据前端的请求分发资源

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./router');

var app = express();
var ejs = require('ejs');

// view engine setup
//  这个模板引擎好像是必须设置的，express默认是jade
app.engine('.html', ejs.renderFile);
app.set('views', path.join(__dirname, 'view')); // 这里设定了渲染页面时候的默认路径，view/index
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//  这里放打包好的文件，告诉express在这里找资源
app.use(express.static(path.join(__dirname, 'dist')));

//  app.use第一个参数是路由，后面是回调
//  use和get的区别是use可以嵌套或者匹配多个规则，get就是单一的返回回调，也就是接口的写法
app.use('*.html', indexRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
