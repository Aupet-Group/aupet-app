/* eslint-disable no-underscore-dangle */
const express = require('express');
const Event = require('../model/event');
const { checkIfLoggedIn } = require("../middlewares/auth");

const router = express.Router();

/* GET events listing. */
router.get('/', (req, res, next) => {
    console.log("events dsadf")
  Event.find({})
    .then((events) => {
      res.render('events/events', { events });
    })
    .catch((error) => {
        console.log(error)
        next(error);
    });
});

// Form to create new event
router.get('/new', checkIfLoggedIn, (req, res) => {
  res.render('events/newevent');
});


router.post('/', checkIfLoggedIn,  async (req, res, next) => {
 const {title, description, initialDateTime, finalDateTime, location} = req.body;
//  todo añadir middleware auth
 const owner = res.locals.currentUser._id;
 try {
    const event = await Event.create({
        owner,
        title,
        description,
        creationEventDate: Date.now(),
        initialDateTime,
        finalDateTime,
        location
     })
     res.redirect('/events');
 }
    catch (error){
        next(error)
    };
});
    

// router.post('/', async (req, res, next) => {
//     const {title, description, initialDateTime, finalDateTime, location} = req.body;
//    //  todo añadir middleware auth
//     const owner = res.locals.currentUser._id;
//     try {
//     const createdEvent = await Event.create({
//         owner,
//         title,
//         description,
//         creationEventDate: Date.now(),
//         initialDateTime,
//         finalDateTime,
//         location
//      })
//      res.redirect('events/events');
//      } catch (error) {
//        next(error);
//      }
//    });

module.exports = router;
