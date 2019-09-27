const express = require('express');
const Event = require('../model/event');
const Pet = require('../model/pet');
const User = require('../model/user');
const { checkIfLoggedIn } = require('../middlewares/auth');
const { isValidID } = require('../middlewares/help');

const router = express.Router();

let ownEvents = false;
const today = new Date().toISOString().slice(0, 10);


// GET all events listing
router.get('/', async (req, res, next) => {
  let events;
  let currEvs;
  let pastEvs;
  try {
    const allEvents = await Event.find({}).populate('owner keeper');
    const currentAllEvents = await Event.find({ start: { $gte: today } });
    const pastAllEvents = await Event.find({ start: { $lt: today } }).populate('owner keeper');   
    if (req.session.currentUser) {
      events = allEvents.filter(
        (event) => event.owner._id.toString() !== req.session.currentUser._id.toString(),
      );
      currEvs = currentAllEvents.filter(
        (event) => event.owner._id.toString() !== req.session.currentUser._id.toString(),
      );
      pastEvs = pastAllEvents.filter(
        (event) => event.owner._id.toString() !== req.session.currentUser._id.toString()
      );  
       
    } else {
      events = allEvents;
      currEvs = currentAllEvents;
      pastEvs = pastAllEvents;
    };

    const currentEvents = await Promise.all(currEvs.map(async (event) => { 
      const curEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      curEvent.petType = petType;
      return curEvent;        
    }));

    const pastEvents = await Promise.all(pastEvs.map(async (event) => { 
      const pastEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      pastEvent.petType = petType;
      return pastEvent;        
    }));

    const { owner } = events;
    const { keeper } = events;
    
    res.render('events/events', { events, currentEvents, pastEvents, owner, keeper });
  } catch (error) {
    next(error);
  }
});


// GET list user's own events
router.get('/myevents', checkIfLoggedIn, async (req, res, next) => {
  const owner = res.locals.currentUser._id;
  let currEvs;
  let pastEvs;
  try {
    currEvs = await Event.find({ $and: [{ owner }, { start: { $gte: today } }] });
    pastEvs = await Event.find({ $and: [{ owner }, { start: { $lt: today } }] });
    const enabled = true;
    ownEvents = true;

    const currentEvents = await Promise.all(currEvs.map(async (event) => { 
      const curEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      curEvent.petType = petType;
      return curEvent;        
    }));

    const pastEvents = await Promise.all(pastEvs.map(async (event) => { 
      const pastEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      pastEvent.petType = petType;
      return pastEvent;        
    }));

    res.render('events/events', {
      currentEvents, pastEvents, enabled, ownEvents,
    });
  } catch (error) {
    next(error);
  }
});

// GET list 3rd party user's events
router.get('/userevents/:userId', checkIfLoggedIn, async (req, res, next) => {
  const { userId } = req.params;
  const thirdParty = true;
  let currEvs;
  let pastEvs;
  try {
    const user = await User.findById({ _id: userId });
    const events = await Event.find({ owner: userId }).populate('owner keeper');
    currEvs = await Event.find({ $and: [{ owner: userId }, { start: { $gte: today } }] });
    pastEvs = await Event.find({ $and: [{ owner: userId }, { start: { $lt: today } }] });
    
    const currentEvents = await Promise.all(currEvs.map(async (event) => { 
      const curEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      curEvent.petType = petType;
      return curEvent;        
    }));

    const pastEvents = await Promise.all(pastEvs.map(async (event) => { 
      const pastEvent = await Event.findOne({ _id: event._id}).populate('owner keeper'); 
      const pet = await Pet.find({_id: event.pet });
      const extractType = [];
      pet.forEach((el) => {
       return extractType.push(el.petType);
      });
      const petType = extractType.join(", ");
      pastEvent.petType = petType;
      return pastEvent;        
    }));
    
    const { owner } = events;
    const { keeper } = events;
    res.render('events/events', {
      currentEvents, pastEvents, user, owner, keeper, thirdParty,
    });
  } catch (error) {
    next(error);
  }
});

// GET list events where the user is enrolled in as a keeper or as a candidate

router.get('/enrolledin', checkIfLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.session.currentUser;// string type
    const events = await Event.find({ $or: [{ candidates: _id }, { keeper: _id }] }).populate('owner').populate('keeper');
    for (let i = 0; i < events.length; i++) {
      if (events[i].keeper) {
        if (events[i].keeper._id.toString() === _id) { events[i].keeperyes = 'yes'; }
      }
    }
    const { owner } = events;
    res.render('events/enrolledin', { events, owner, _id });
  } catch (error) {
    next(error);
  }
});

// GET list events where the user is enrolled in as a keeper or as a candidate as 3rd party

router.get('/enrolledin/:_id', checkIfLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.params;// string type
    const events = await Event.find({ $or: [{ candidates: _id }, { keeper: _id }] }).populate('owner').populate('keeper');
    for (let i = 0; i < events.length; i++) {
      if (events[i].keeper) {
        if (events[i].keeper._id.toString() === _id) { events[i].keeperyes = 'yes'; }
      }
    }
    const { owner } = events;
    res.render('events/enrolledin', { events, owner, _id });
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
    res.render('events/newevent', { pets, today, enabled });
  } catch (error) {
    next(error);
  }
});

// POST new event
router.post('/', checkIfLoggedIn, async (req, res, next) => {
  let pet;
  const {
    title, description, selectedPet, initialDateTime, finalDateTime, location,
  } = req.body;
  const owner = res.locals.currentUser._id;
  const start = initialDateTime;
  const end = finalDateTime;
  try {
    if (selectedPet === 'All') {
      pet = await Pet.find({ owner });
    } else {
      pet = await Pet.findOne({ $and: [ { owner }, { petName: selectedPet } ] });       
    }    
    await Event.create({
      owner,
      title,
      description,
      creationEventDate: Date.now(),
      initialDateTime,
      start,
      finalDateTime,
      end,
      address: { location },
      pet,
    });
    res.redirect('/events/myevents');
  } catch (error) {
    next(error);
  }
});

// GET event details
router.get('/:eventId', isValidID('eventId'), async (req, res, next) => {
  let past = false;
  const { eventId } = req.params;
  const { _id } = req.session.currentUser;
  try {
    let user = false;
    const event = await Event.findById(eventId).populate('owner pet candidates keeper');
    const { owner } = event;
    const pets = event.pet;
    const { candidates } = event;
    const { keeper } = event;
    if (_id === event.owner._id.toString()) {
      user = true;
    }
    if (event.start < today) {
      past = true;
    }
    res.render('events/eventDetails', {
      event,
      owner,
      user,
      pets,
      candidates,
      keeper,
      past
    });
  } catch (error) {
    next(error);
  }
});

// GET form to update an event
router.get('/:eventId/update', checkIfLoggedIn, isValidID('eventId'), async (req, res, next) => {
  const userId = res.locals.currentUser._id;
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('pet');
    const pets = event.pet;
    const enabled = true;
    if (userId === event.owner.toString()) {
      res.render('events/edit', {
        event, pets, today, enabled,
      });
    } else {
      req.flash('error', "You can't edit this event.");
    }
  } catch (error) {
    next(error);
  }
});

// POST event update
router.post('/:eventId', checkIfLoggedIn, isValidID('eventId'), async (req, res, next) => {
  let pet;
  const { eventId } = req.params;
  const owner = res.locals.currentUser._id;
  const {
    title, description, selectedPet, initialDateTime, finalDateTime, location,
  } = req.body;
  const start = initialDateTime;
  const end = finalDateTime;
  try {
    if (selectedPet === 'All') {
      pet = await Pet.find({ owner });
    } else {
      pet = await Pet.findOne({ $and: [ { owner }, { petName: selectedPet } ] });
    }
    await Event.findByIdAndUpdate(eventId, {
      owner,
      title,
      description,
      initialDateTime,
      start,
      finalDateTime,
      end,
      address: { location },
      pet,
    });
    res.redirect(`/events/${eventId}`);
  } catch (error) {
    next(error);
  }
});

// POST delete event
router.post('/:eventId/delete', checkIfLoggedIn, isValidID('eventId'), async (req, res, next) => {
  const { eventId } = req.params;
  const userId = res.locals.currentUser._id;
  try {
    const event = await Event.findById(eventId);
    if (userId === event.owner.toString()) {
      await Event.findByIdAndDelete(eventId);
      res.redirect('/events/myevents');
    } else {
      req.flash('error', 'You didn\'t create this task, you can\'t delete it.');
      res.redirect('/events');
    }
  } catch (error) {
    next(error);
  }
});

// GET enroll in an event
router.get('/:eventId/enroll', checkIfLoggedIn, isValidID('eventId'), async (req, res, next) => {
  const { eventId } = req.params;
  const userId = res.locals.currentUser._id;
  try {
    const user = await User.findById(userId);
    let event = await Event.findById(eventId).populate('owner candidates keeper');
    if (user._id.equals(event.owner._id)) {
      req.flash('error', "You can't enroll. It's your own event.");
    } else {
      let enrolled = false;
      let allocated = false;

      if (event.keeper) {
        allocated = true;
      }
      event.candidates.forEach((candidate) => {
        if (candidate.email === user.email) {
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
router.get(
  '/:eventId/accept/:userId',
  checkIfLoggedIn,
  isValidID('eventId'),
  isValidID('userId'),
  async (req, res, next) => {
    const { userId } = req.params;
    const { eventId } = req.params;

    try {
      let event = await Event.findById(eventId);
      if (event.keeper) {
        req.flash('error', 'Sorry. This task is already allocated.');
      } else {
        event = await Event.findByIdAndUpdate(eventId, { $set: { keeper: userId } }, { new: true });
        req.flash('success', "You've just accepted a keeper for your task.");
      }
      res.redirect(`/events/${eventId}`);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
