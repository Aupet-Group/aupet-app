const express = require('express');
const { checkIfLoggedIn } = require('../middlewares/auth');
const User = require('../model/user');

const router = express.Router();

router.get('/update', checkIfLoggedIn, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    // res.send(user)
    res.render('users/update', { user });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const {
    email, name, lastName, username, phone, mobile, secondaryPhone,
  } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      email,
      name,
      lastName,
      username,
      phone,
      mobile,
      secondaryPhone,
    });
    console.log(user);
    res.redirect('users/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    res.render('users/profile', { user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
