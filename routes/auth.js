const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../model/user');

const bcryptSalt = 10;

const { checkEmailAndPasswordNotEmpty, checkIfLoggedIn, checkIfNoLoggedIn } = require('../middlewares/auth');

router.get('/signup', checkIfNoLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', checkIfNoLoggedIn, checkEmailAndPasswordNotEmpty, async (req, res, next) => {
  /* retrieves information from req.body */
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash('error', 'This email is already being used');
      res.redirect('/signup');
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);
      req.session.currentUser = await User.create({ email, hashedPassword });
      // const user2 = await User.findOne({ email });
      // req.session.currentUser = user2;
      res.redirect('/profile');
    }
  } catch (error) {
    req.flash('error', 'Please try again');
    res.redirect('/signup');
  }
});

router.get('/login', checkIfNoLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', checkIfNoLoggedIn, checkEmailAndPasswordNotEmpty, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user) {
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        res.redirect(req.session.backTo || '/profile');
      } else {
        req.flash('error', 'User or password incorret');
        res.redirect('/login');
      }
    } else {
      req.flash('info', "User doesn't exist try to sign up!");
      res.redirect('/signup');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/profile', checkIfLoggedIn, (req, res, next) => {
  res.render('profile');
});
//makes log out
router.get('/logout', checkIfLoggedIn, (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    }
    res.redirect('/login');
  });
});

module.exports = router;
