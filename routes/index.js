const express = require('express');

const router = express.Router();
const Event = require('../model/event');

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/searchbar', (req, res, next) => {
  const { zipcode } = req.body;
  const events = Event.find({}).populate('user'.address )
});

module.exports = router;
