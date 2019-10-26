var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var v1 = require('./v1/v1');

// initialize caver
caver.initialize();

// view engine setup
//app.use(''cors());
/*
var whitelist = ['http://localhost:8080', 'http://15.164.129.118:3000']

var corsOptions = {
  origin: function(origin, callback){
  var isWhitelisted = whitelist.indexOf(origin) !== -1;
  callback(null, isWhitelisted);
  // callback expects two parameters: error and options
  },
  credentials:true
};*/
app.use(cors('http://localhost:8080'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/v1',v1);

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
