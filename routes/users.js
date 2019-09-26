const express = require('express');

const upload = require('../config/cloudinary');

const { checkIfLoggedIn } = require('../middlewares/auth');
const { checkIfNameisEmpty, checkIfNameInDatabaseIsEmpty } = require('../middlewares/help');

const User = require('../model/user');

const router = express.Router();

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

router.post('/', checkIfNameisEmpty, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { email, name, lastName, phone, owner: ownerString, keeper: keeperString, street, number, zipcode } = req.body;

  const owner = ownerString === 'checked';
  const keeper = keeperString === 'checked';
  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        $set: {
          email,
          name,
          lastName,
          phone,
          owner,
          keeper,
          'address.0.street': street,
          'address.0.number': number,
          'address.0.zipcode': zipcode,
        },
      },
    );
    req.session.currentUser = user;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

// Show all of user that are keepers //
router.get('/keepers', checkIfLoggedIn, async (req, res, next) => {
  try {
    const keepersWithoutUser = await User.find({ keeper: true });
    const users = keepersWithoutUser.filter(keeperFilter => keeperFilter.id.toString() !== req.session.currentUser.id);
    res.render('users/users', { users });
  } catch (error) {
    next(error);
  }
});

// Shoe details of keepers

router.get('/users/:_id', checkIfLoggedIn, checkIfNameInDatabaseIsEmpty, async (req, res, next) => {
  const { _id } = req.params;
  try {
    const users = await User.findOne({ _id });
    const enabled = false;
    res.render('users/profile', { users, enabled });
  } catch (error) {
    next(error);
  }
});

// Show profile of User
router.get('/profile', checkIfLoggedIn, checkIfNameInDatabaseIsEmpty, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findOne({ _id });
    const enabled = true;
    res.render('users/profile', { user, enabled });
  } catch (error) {
    next(error);
  }
});

router.get('/imageUpload', checkIfLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.session.currentUser;
    const user = await User.findById({ _id });
    if (!user.img) {
      user.img = '/images/default-user.png';
    }
    delete res.locals.nameFile;
    res.locals.nameFile = user.id.toString();
    res.render('users/userphoto', { user });
  } catch (error) {
    next(error);
  }
});

router.post('/imageUpload', checkIfLoggedIn, upload.single('photo'), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    console.log(_id);
    req.session.currentUser.fileName = `${_id}_user`;
    await User.findByIdAndUpdate({ _id }, { $set: { img: req.file.url } });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
