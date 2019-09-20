const express = require('express');

const router = express.Router();
const Event = require('../model/event');

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

//you don't need to be loged in

router.post('/searchbar', (req, res, next) => {
  const { zipcode } = req.body;
  const keepers = User.find({ zipcode, keeper: true });
  res.locals.currentUser.keepers = keepers;
  res.redirect('/list');
});

//you don't need to be loged in
router.get('/list', (req,res, next)=>{
  const { keepers} = res.locals.currentUser;
  
  console.log(keepers);
});
module.exports = router;
