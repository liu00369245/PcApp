var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Session会话引入
var session = require('express-session');

//导入二级路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var consultRouter = require('./routes/consult');
var detailsRouter = require('./routes/details');
var cinemaRouter = require('./routes/cinema');
var movieMatchRouter = require('./routes/movieMatch');
var hotMovieRouter = require('./routes/hotMovie');
var hotTvRouter = require('./routes/hotTv');
var hotReadyRouter = require('./routes/hotReady');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//配置Session
app.use(session({
  secret: 'loginInfo',
  resave: true,
  cookie: { maxAge: 600 * 1000 },
  saveUninitialized: true
}));

//配置一级路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/consult', consultRouter);
app.use('/details', detailsRouter);
app.use('/cinema', cinemaRouter);
app.use('/movieMatch', movieMatchRouter);
app.use('/hotMovie', hotMovieRouter);
app.use('/hotTv', hotTvRouter);
app.use('/hotReady', hotReadyRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
