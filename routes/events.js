/* eslint-disable no-underscore-dangle */
const express = require('express');
const Event = require('../model/event');
const Pet = require('../model/pet');
const User = require('../model/user');
const { checkIfLoggedIn } = require("../middlewares/auth");

const router = express.Router();

// GET all events listing
router.get('/', (req, res, next) => {
  // todo usar async await
  Event.find({})
    .then((events) => {
      res.render('events/events', { events });
    })
    .catch((error) => {
      next(error);
    });
});

// GET list user's own events
router.get('/myevents', checkIfLoggedIn, async (req, res, next) => {
  const owner = res.locals.currentUser._id;
  try {
    const events = await Event.find({owner});
    res.render('events/events', { events });
  } catch (error) {
    next(error);
  }
});


// GET form to create new event
router.get('/new', checkIfLoggedIn, (req, res) => {
  res.render('events/newevent');
});


// POST new event
router.post('/', checkIfLoggedIn,  async (req, res, next) => {
  const {title, description, initialDateTime, finalDateTime, location} = req.body;
  const owner = res.locals.currentUser._id;
  try {
     const pet = await Pet.find({ owner })
     const event = await Event.create({
         owner,
         title,
         description,
         creationEventDate: Date.now(),
         initialDateTime,
         finalDateTime,
         address: {location: location},
         pet
      })
      res.redirect('/events');
  }
     catch (error){
         next(error)
     };

    });
  
//GET event details
router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('pet');
    const pets = event.pet;
    res.render('events/eventDetails', { event, pets });  
  }
  catch (error){
    next(error)
};
});

module.exports = router;
