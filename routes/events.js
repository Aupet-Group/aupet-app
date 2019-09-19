const express = require('express');
const Event = require('../model/event');
const Pet = require('../model/pet');
const User = require('../model/user');
const { checkIfLoggedIn } = require('../middlewares/auth');

const router = express.Router();
let ownEvents = false;

// GET all events listing
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.render('events/events', { events, ownEvents });
  } catch (error) {
    next(error);
  }
});

// GET list user's own events
router.get('/myevents', checkIfLoggedIn, async (req, res, next) => {
  const owner = res.locals.currentUser._id;
  try {
    const events = await Event.find({ owner });
    const enabled = true;
    ownEvents = true;
    res.render('events/events', { events, enabled, ownEvents });
  } catch (error) {
    next(error);
  }
});

// GET form to create new event
router.get('/new', checkIfLoggedIn, async (req, res, next) => {
  const owner = res.locals.currentUser._id;
  try {
    const pets = await Pet.find({ owner });
    const enabled = true;
    res.render('events/newevent', { pets, enabled });
  } catch (error) {
    next(error);
  }
});

// Get de list where de user are enrolled in as a keeper or as a candidate

router.get('/enrolledin', checkIfLoggedIn, async (req, res, next) => {
  try {
    console.log(req.session.currentUser._id);
    const { _id } = req.session.currentUser;
    const events = await Event.find({ $or: [{ candidates: _id }, { keeper: _id }] });
    console.log(events);
    res.render('events/enrolledin', { events, _id });
  } catch (error) {
    next(error);
  }
});

// POST new event
router.post('/', checkIfLoggedIn, async (req, res, next) => {
  const { title, description, selectedPet, initialDateTime, finalDateTime, location } = req.body;
  const owner = res.locals.currentUser._id;
  try {
    if (selectedPet === 'All') {
      pet = await Pet.find({ owner });
    } else {
      pet = await Pet.find({ owner, petName: selectedPet });
    }
    const event = await Event.create({
      owner,
      title,
      description,
      creationEventDate: Date.now(),
      initialDateTime,
      finalDateTime,
      address: { location },
      pet,
    });
    res.redirect('/events');
  } catch (error) {
    next(error);
  }
});

// GET event details
router.get('/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('pet candidates');
    const pets = event.pet;
    const {candidates} = event;
    res.render('events/eventDetails', { event, pets, candidates, ownEvents });
  } catch (error) {
    next(error);
  }
});

// GET form to update an event
router.get('/:eventId/update', checkIfLoggedIn, async (req, res, next) => {
  const userId = res.locals.currentUser._id;
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('pet');
    const pets = event.pet;
    const enabled = true;
    if (userId == event.owner) {
      res.render('events/edit', { event, pets, enabled });
    } else {
      req.flash('error', "You can't edit this event.");
    }
  } catch (error) {
    next(error);
  }
});

// POST event update
router.post('/:eventId', checkIfLoggedIn, async (req, res, next) => {
  const { eventId } = req.params;
  const owner = res.locals.currentUser._id;
  const { title, description, selectedPet, initialDateTime, finalDateTime, location } = req.body;
  try {
    if (selectedPet === 'All') {
      pet = await Pet.find({ owner });
    } else {
      pet = await Pet.find({ owner, petName: selectedPet });
    }
    const event = await Event.findByIdAndUpdate(eventId, {
      owner,
      title,
      description,
      initialDateTime,
      finalDateTime,
      address: { location },
      pet,
    });
    res.redirect(`/events/${eventId}`);
  } catch (error) {
    next(error);
  }
});

// POST delete event
router.post('/:eventId/delete', checkIfLoggedIn, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = res.locals.currentUser._id;
  try {
    const event = await Event.findById(eventId);
    if (userId == event.owner) {
      const delEvent = await Event.findByIdAndDelete(eventId);
      res.redirect('/events');
    } else {
      res.redirect('/events');
    }
  } catch (error) {
    next(error);
  }
});

// GET enroll in an event
router.get('/:eventId/enroll', checkIfLoggedIn, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = res.locals.currentUser._id;
  try {
    const user = await User.findById(userId);
    let event = await Event.findById(eventId).populate('owner candidates keeper');
    if (user._id.equals(event.owner._id)) {
      req.flash('error', "The owner can't enroll in his/her own event.");
    } else {
      let enrolled = false;
      let allocated = false;

      if (event.keeper) {
        allocated = true;
      }
      event.candidates.forEach((candidate) => {
        if (candidate.email == user.email) {
          enrolled = true;
        }
      });
      if (!allocated) {
        if (!enrolled) {
          // Add user to candidates array
          event = await Event.findByIdAndUpdate(eventId, { $push: { candidates: [userId] } }, { new: true });
          req.flash('success', "You've just been enrolled. Wait to be accepted by the owner.");
        } else {
          req.flash('error', 'You are already enrolled. Wait to be accepted by the owner.');
        }
      } else {
        req.flash('error', 'Sorry. The task is already allocated to other keeper. Try with another task.');
      }
    }
    res.redirect(`/events/${eventId}`);
  } catch (error) {
    next(error);
  }
});

// GET accept a keeper
router.get('/:eventId/accept/:userId', checkIfLoggedIn, async (req, res, next) => {
  const { userId } = req.params;
  const { eventId } = req.params;

  try {
    let event = await Event.findById(eventId).populate('keeper pet candidates');
    const pets = event.pet;
    const {candidates} = event;
    let allocated = false;

    if (event.keeper) {
      req.flash('error', 'Sorry. This task is already allocated.');
      allocated = true;
    } else {
      event = await Event.findByIdAndUpdate(eventId, { $set: { keeper: userId } }, { new: true });
      allocated = true;
      req.flash('success', "You've just accepted a keeper for your task.");
      
    }
    
  res.render('events/eventDetails', { event, pets, candidates, allocated });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
