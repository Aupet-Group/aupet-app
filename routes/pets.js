const express = require('express');

const upload = require('../config/cloudinary');

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
  await User.findByIdAndUpdate({ _id: owner }, { $set: { owner: true } });

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

// GET pet details

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
router.get('/:petId/update', checkIfLoggedIn, async (req, res, next) => {
  const { petId } = req.params;
  try {
    const pet = await Pet.findById(petId);
    res.render('pets/editPet', pet);
  } catch (error) {
    next(error);
  }
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

// Upload pet Image

router.get('/pets/imageUpload', checkIfLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.session.currentUser;
    const pet = await Pet.findById(petId);
    if (!pet.img) {
      pet.img = '/images/default-pet.png';
    }
    delete res.locals.nameFile;
    res.locals.nameFile = pet.id.toString();
    res.render('pets/petImage', { pet });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
