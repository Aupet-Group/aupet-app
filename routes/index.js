const express = require('express');

const router = express.Router();

const User = require('../model/user');
let keepers;

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Aupet', layout: 'layouthome' });
});
// you don't need to be loged in

router.post('/searchbar', async (req, res, next) => {
  const { zipcode } = req.body;
  try {
    keepers = await User.find({ 'address.0.zipcode': zipcode, keeper: true });
    res.redirect('/list');
  } catch (error) {
    next(error);
  }
});

// you don't need to be loged in
router.get('/list', async (req, res, next) => {
  try {
    res.render('users/keeperzone', { keepers });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
