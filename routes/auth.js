/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../model/user');

const bcryptSalt = 10;

const { checkEmailAndPasswordNotEmpty } = require('../middlewares/auth');

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post(
  '/signup',
  checkEmailAndPasswordNotEmpty,
  async (req, res, next) => {
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
        await User.create({ email, hashedPassword });
        req.flash(
          'info',
          `user with mail ${email} created, you must log in to use the features of our page`,
        );
        res.redirect('/created');
      }
    } catch (error) {
      req.flash('error', 'Please try again');
      res.redirect('/signup');
    }
  },
);

router.get('/created', (req, res, next) => {
  res.render('created');
});

module.exports = router;
