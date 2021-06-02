var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var mysqlStore = require('express-mysql-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authenticationRouter = require('./routes/authentication');
var productsRouter = require('./routes/products');

const { database } = require('./keys');

var app = express();
require('./lib/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'message',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authentication', authenticationRouter);
app.use('/products', productsRouter);

//Messages
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    next();
})

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