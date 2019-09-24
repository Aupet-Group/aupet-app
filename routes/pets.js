const express = require('express');
const Pet = require('../model/pet');

const router = express.Router();
const User = require('../model/user');
const { checkIfLoggedIn } = require('../middlewares/auth');

// Get list all user's own pets
router.get('/', checkIfLoggedIn, async (req, res, next) => {
  const owner = res.locals.currentUser._id;
  try {
    const pets = await Pet.find({ owner });
    res.render('pets/listpets', { pets });
  } catch (error) {
    next(error);
  }
});

// GET form to create new pet

router.get('/new', checkIfLoggedIn, (req, res, next) => {
  res.render('pets/addPet');
});

//  POST new pet

router.post('/', async (req, res, next) => {
  const { petType, petWeight, petName, petAge, petImg } = req.body;

  const { petId } = req.params;
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
    res.render('pets/petDetails', { pet });
  } catch (error) {
    next(error);
  }
});

//GET pet details

router.get('/:petId', async (req, res, next) => {
  const { petId } = req.params;

  try {
    const pet = await Pet.findById(petId);
    res.render('pets/petDetails', { pet });
  } catch (error) {
    next(error);
  }
});

// Get form to Edit Pet
router.get('/:petId/update', checkIfLoggedIn, (req, res, next) => {
  const { petId } = req.params;
  Pet.findById(petId)
    .then(pet => {
      res.render('pets/editPet', pet);
    })
    .catch(next);
});

// Post update Pet

router.post('/:petId', checkIfLoggedIn, async (req, res, next) => {
  const { petId } = req.params;
  const pet = Pet.findById(petId);
  const { petType, petWeight, petAge, petName } = req.body;
  try {
    await Pet.findByIdAndUpdate(petId, {
      petType,
      petWeight,
      petAge,
      petName,
    });
    res.redirect(`/pets/${petId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
