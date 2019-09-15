const express = require('express');

const router = express.Router();
const { checkIfLoggedIn } = require('../middlewares/auth');

const Pet = require('../model/pet');

// GET form to create new pet

router.get('/new', checkIfLoggedIn, (req, res, next) => {
  res.render('addPet');
});

//  POST new pet

router.post('/', async (req, res, next) => {
  const { petType, petWeight, petName, petAge, petImg } = req.body;
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

//
router.get('/created', (req, res, next) => {
  res.render('created');
});

module.exports = router;
