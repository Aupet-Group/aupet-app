const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const hbs = require('hbs');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const flash = require('connect-flash');
const { notifications } = require('./middlewares/auth.js');
require('dotenv').config();

hbs.registerPartials(path.join(__dirname, '/views/partials'));
hbs.registerHelper('ifequal', (firstValue, secondValue, options) => {
  if (firstValue === secondValue) { return options.fn(this); }
  return options.inverse(this);
});

hbs.registerHelper('ifnotequal', (firstValue, secondValue, options) => {
  if (firstValue !== secondValue) { return options.fn(this); }
  return options.inverse(this);
});


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const eventRouter = require('./routes/events');
const petsRouter = require('./routes/pets');
const reviewsRouter = require('./routes/reviews');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(
  sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true, // true for .map; false no .map file
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  res.locals.currentUser = req.session.currentUser;
  next();
});

app.use(notifications(app));

// Routes
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', authRouter);
app.use('/pets', petsRouter);
app.use('/events', eventRouter);
app.use('/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  // next(createError(404));
  res.render('404');
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('500');
});

module.exports = app;
