// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var session = require('express-session');
// var { Magic } = require('magic-sdk');
// const { MagicAdmin } = require('@magic-sdk/admin');
// const nodemailer = require("nodemailer");
// const MagicLinkStrategy = require('passport-magic-link').Strategy;
const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var debug = require('debug')('expressapp:server');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//   secret: 'secret012',
// }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css', express.static('public/css'));
app.use('*/js', express.static('public/js'));
app.use('*/scss', express.static('public/scss'));
app.use('*/fonts', express.static('public/fonts'));
app.use('*/images', express.static('public/images'));
app.use(passport.initialize());
app.use(passport.session());

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// passport.use(new MagicLinkStrategy({
//   secret: '...',
//   userFields: ['name', 'email'],
//   tokenField: 'token'
// }, (user, token) => {
//     return MailService.sendMail({
//     to: user.email,
//     token})
//   }, (user) => {
//   return User.findOrCreate({email: user.email, name: user.name})
// }));

passport.use(new GoogleStrategy({
    clientID: new Buffer.from("NDA4MTgyOTcyMDE4LWtlbGY0djExYzRyZmUydnA0aGhqMjY1dDE5MHZkZzg2LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t", "base64").toString(),
    clientSecret: new Buffer.from("bk95b1lFa2NMME9XOU5wblQyaGFzMVNn", "base64").toString(),
    callbackURL: "/donate"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Setting URL redirections
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/donate', function(req, res, next) {
  if (req.query && req.query.code && req.query.scope)
    res.render('donorForm');
  else 
    res.redirect('signin');
});

app.get('/beneficiary', function(req, res, next) {
  res.render('beneficiary');
});

app.get('/signin', passport.authenticate('google', { scope: ['profile'] }), function(req, res, next) {
  res.render('signin-form'); 
});

app.post('/signin', function(req, res, next) {

  userMail = req.body.email;
  console.log(req.body, userMail)
  
  // const magic = new Magic("pk_live_5FF3CB606F042138");
  // const magicAdmin = new MagicAdmin("sk_live_D4A9E46A11FB1C06");

  try {
    // magic.auth.loginWithMagicLink({ email: userMail });

  } catch (error) {
    console.log(error);
  }

  res.sendStatus(200);

});

/* Get port from environment and store in Express. */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/* Create HTTP server. */
var server = http.createServer(app);

/* Listen on provided port, on all network interfaces. */
server.listen(port, ()=>{ console.log("Localhost started on http://localhost:" + port) });
server.on('error', onError);
server.on('listening', onListening);

/* Normalize a port into a number, string, or false. */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/* Event listener for HTTP server "error" event. */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/* Event listener for HTTP server "listening" event. */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// error handler and reporter
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
