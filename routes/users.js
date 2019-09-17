const express = require('express');
const { checkIfLoggedIn } = require('../middlewares/auth');
const User = require('../model/user');

const router = express.Router();

//Show profile of User
router.get('/profile', checkIfLoggedIn, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    const enabled = true;
    res.render('users/profile', { user, enabled });
  } catch (error) {
    next(error);
  }
});

//Show the profile prepared to update

router.get('/profile/update', checkIfLoggedIn, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    // res.send(user)
    res.render('users/update', { user });
  } catch (error) {
    next(error);
  }
});

//Saves the user profile updated

router.post('/', async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { email, name, lastName, username, phone, mobile, secondaryPhone } = req.body;
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
    req.session.currentUser = user;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/users', checkIfLoggedIn, async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('users/users', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:_id', checkIfLoggedIn, async (req, res, next) => {
  console.log('detalle de un usuario que no soy yo');
  const { _id } = req.params;
  try {
    const users = await User.findOne({ _id });
    const enabled = false;
    res.render('users/profile', { users, enabled });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
