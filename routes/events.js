/* eslint-disable no-underscore-dangle */
const express = require('express');
const Event = require('../model/event');
const Pet = require('../model/pet');
const User = require('../model/user');
const { checkIfLoggedIn } = require("../middlewares/auth");

const router = express.Router();


// GET all events listing
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.render('events/events', { events });
  } catch (error) {
    next(error);
  }
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
     const pet = await Pet.find({ owner });
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
         next(error);
     };

    });
  
// GET event details
router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('pet');
    const pets = event.pet;
    res.render('events/eventDetails', { event, pets });  
  }
  catch (error){
    next(error);
};
});

// GET form to update an event
router.get('/:eventId/update', checkIfLoggedIn, async (req, res, next) => {
  const userId = res.locals.currentUser._id;
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (userId == event.owner) {
      res.render('events/edit', event);
    } else {
      res.redirect('/events');
    }
  }
    catch (error){
    next(error);
};
});

// POST event update
router.post('/:eventId', checkIfLoggedIn, async (req, res, next) => {
  const { eventId } = req.params;
  const owner = res.locals.currentUser._id;
  const {title, description, initialDateTime, finalDateTime, location} = req.body;
  try {
    const pet = await Pet.find({ owner });
    const event = await Event.findByIdAndUpdate(eventId, {
      owner,
      title,
      description,
      initialDateTime,
      finalDateTime,
      address: {location: location},
      pet
   });
    res.redirect(`/events/${eventId}`);
  }
  catch (error){
    next(error);
};
});

// POST delete event
router.post('/:eventId/delete', checkIfLoggedIn, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = res.locals.currentUser._id;
  const event = await Event.findById(eventId);
  if (userId == event.owner) {
    try {
      const delEvent = await Event.findByIdAndDelete(eventId);
      res.redirect('/events');
      } 
    catch (error){
        next(error);
    };
    } else {
      res.redirect('/events');
    }  
});


module.exports = router;


