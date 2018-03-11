const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');

const routesApi = require('./api/routes/index');

// Models
let models = require('./api/models/index');
models.sequelize.sync().then(function() {
  console.log('Connexion bdd ok');
}).catch(function(err) {
  console.log(err, 'erreur connexion bdd');
});

let app = express();

// Passport
require('./api/config/passport');
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch unauthorised errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({'message': err.name + ': ' + err.message});
  }
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
