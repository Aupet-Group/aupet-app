const express = require('express');

const router = express.Router();
const Events = require('../model/event');
const Reviews = require('../model/review');

const { checkIfLoggedIn } = require('../middlewares/auth');
const { isValidID } = require('../middlewares/help');

// Get the reviews list of a task (event)
router.get('/:eventId', checkIfLoggedIn, isValidID('eventId'), async (req, res, next) => {
  const { eventId } = req.params;
  const { id: userId } = req.session.currentUser;
  try {
    const event = await Events.findById({ _id: eventId });
    if (event.keeper) {
      if (event.owner.toString() === userId || event.keeper.toString() === userId) {
        req.flash('info', 'Yo can write a review');
        res.render('reviews/list');
      } else {
        req.flash('error', 'You have not participated in this event, you cannot create a review.');
        res.redirect('/events');
      }
    } else {
      req.flash('error', "This event has no pet keeper, maybe it hasn't been launched yet.");
      res.redirect('/events');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
