/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const { checkIfLoggedIn } = require('../middlewares/auth');

const User = require('../model/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

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

module.exports = router;
