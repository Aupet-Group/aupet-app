const notifications = () => (req, res, next) => {
  // We extract the messages separately cause we call req.flash() we'll clean the object flash.
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};

const checkEmailAndPasswordNotEmpty = (req, res, next) => {
  const { email, password } = req.body;
  if (email !== '' && password !== '') {
    next();
  } else {
    req.flash('error', 'the email or password fields cannot be empty');
    res.redirect('/signup');
  }
};

const checkIfLoggedIn = (req, res, next) => {
  if (req.session.backTo) delete req.session.backTo; //if exist delete
  if (req.session.currentUser) {
    next();
  } else {
    req.session.backTo = req.originalUrl; //Copy the current url to comeback later next to login
    res.redirect('/login');
  }
};

const checkIfNoLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    req.flash('error', 'you are already logged in. You cannot sign up or login again');
    res.redirect('/');
  } else {
    next();
  }
};

module.exports = {
  notifications,
  checkEmailAndPasswordNotEmpty,
  checkIfLoggedIn,
  checkIfNoLoggedIn,
};
