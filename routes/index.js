const express = require('express');

const router = express.Router();
const User = require('../model/user');

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// you don't need to be loged in

router.post('/searchbar', async (req, res, next) => {
  const { zipcode } = req.body;
  try {
    const keepers = await User.find({ 'address.0.zipcode': zipcode, keeper: true });
    if (typeof keepers !== 'undefined') {
      res.locals.currentUser.keepers = JSON.parse(JSON.stringify(keepers));
    }
    res.redirect('/list');
  } catch (error) {
    next(error);
  }
});

// you don't need to be loged in
router.get('/list', async (req, res, next) => {
  try {
    if (typeof res.locals.currentUser.keepers !== 'undefined') {
      const { keepers } = res.locals.currentUser;
      res.render('keeperzone', { keepers });
    } else {
      res.render('keeperzone'); 
}
  } catch (error) {
    next(error);
  }
});
module.exports = router;
