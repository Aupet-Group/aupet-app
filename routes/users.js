const express = require('express');
const { checkIfLoggedIn } = require('../middlewares/auth');
const User = require('../model/user');

const router = express.Router();

// Show profile of User
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

// Show the profile prepared to update

router.get('/profile/update', checkIfLoggedIn, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    const owner = user.owner ? 'checked' : '';
    const keeper = user.keeper ? 'checked' : '';
    res.render('users/update', { user, owner, keeper });
  } catch (error) {
    next(error);
  }
});

// Saves the user profile updated

router.post('/', async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const {
    email,
    name,
    lastName,
    username,
    phone,
    mobile,
    secondaryPhone,
    owner: ownerString,
    keeper: keeperString,
  } = req.body;

  const owner = ownerString === 'checked';
  const keeper = keeperString === 'checked';
  try {
    const user = await User.findByIdAndUpdate(_id, {
      email,
      name,
      lastName,
      username,
      phone,
      mobile,
      secondaryPhone,
      owner,
      keeper,
    });
    req.session.currentUser = user;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});


//show all of user that are keepers
router.get('/keepers', checkIfLoggedIn, async (req, res, next) => {
  try {
    const users = await User.find({ keeper: true });
    
    res.render('users/users', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:_id', checkIfLoggedIn, async (req, res, next) => {
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
