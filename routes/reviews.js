const express = require('express');

const router = express.Router();
const Events = require('../model/event');
const Reviews = require('../model/review');

const { checkIfLoggedIn } = require('../middlewares/auth');
const { isValidID } = require('../middlewares/help');

router.get('/:_id', checkIfLoggedIn, isValidID('_id'), async (req, res, next) => {
  const {_id}= req.params;
  res.render('reviews/list');
});

module.exports = router;
