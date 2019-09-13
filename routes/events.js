/* eslint-disable no-underscore-dangle */
const express = require('express');
const Event = require('../model/event');
const { checkIfLoggedIn } = require("../middlewares/auth");

const router = express.Router();

/* GET events listing. */
router.get('/', (req, res, next) => {
  Event.find({})
    .then((events) => {
      res.render('events/events', { events });
    })
    .catch((error) => {
        next(error);
    });
});

// Form to create new event
router.get('/new', checkIfLoggedIn, (req, res) => {
  res.render('events/newevent');
});


router.post('/', checkIfLoggedIn,  async (req, res, next) => {
 const {title, description, initialDateTime, finalDateTime, location} = req.body;
 const owner = res.locals.currentUser._id;
 try {
    const event = await Event.create({
        owner,
        title,
        description,
        creationEventDate: Date.now(),
        initialDateTime,
        finalDateTime,
        address: {location: location}
     })
     res.redirect('/events');
 }
    catch (error){
        next(error)
    };
});

module.exports = router;
