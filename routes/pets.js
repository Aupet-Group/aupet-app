const express = require('express');

const router = express.Router();
const { checkIfLoggedIn } = require('../middlewares/auth');

const Pet = require('../model/pet');

router.get('/new', checkIfLoggedIn, (req, res, next) => {
  res.render('addPet');
});

router.post('/', async (req, res, next) => {
  const {
    petType, petWeight, petName, petAge, petImg,
  } = req.body;

  console.log(req.session.currentUser);

  const owner = req.session.currentUser._id;

  try {
    const pet = await Pet.create({
      owner,
      petType,
      petWeight,
      petName,
      petAge,
      petImg: ['/images/default.png'],
    });
    res.redirect('/created');
  } catch (error) {
    next(error);
  }
});

router.get('/created', (req, res) => {
  res.render('created');
});

module.exports = router;
