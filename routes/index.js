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
  const keepers = User.find({ zipcode, keeper: true });
  res.locals.currentUser.keepers = keepers;
  res.redirect('/list');
});

router.get('/list', (req,res, next)=>{
  const { keepers} = res.locals.currentUser;
  console.log(keepers);
});
module.exports = router;
