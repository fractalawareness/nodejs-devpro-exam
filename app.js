const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');

// You should not randomly use let/const/var. Each of it has its own purpose.
// Read http://softwareengineering.stackexchange.com/questions/278652/how-much-should-i-be-using-let-vs-const-in-es6
// and https://medium.com/javascript-scene/javascript-es6-var-let-or-const-ba58b8dcde75#.48elfjrku

const index = require('./routes/index');
// const list = require('./routes/list');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const swaggerConfig = config.swagger;
SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
    if (err) { throw err; }
    app.use(SwaggerUi(swaggerExpress.runner.swagger));
    swaggerExpress.register(app);
});

app.use('/', index);

// app.use('/api/search/list/', list);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
  // res.render('error');
});

module.exports = app;
