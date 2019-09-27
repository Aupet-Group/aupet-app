const User = require('../model/user');

const isValidID = id => (req, res, next) => {
  if (req.params[id].match(/^[0-9a-fA-F]{24}$/)) next();
  else res.render('404');
};

/* Check if the field of Name in update is empty */

const checkIfNameisEmpty = (req, res, next) => {
  const { name } = req.body;
  if (name.match(/^[0-9a-zA-Z]{3,25}$/)) {
    next();
  } else {
    const {
      email,
      lastName,
      phone,
      owner: ownerString,
      keeper: keeperString,
      street,
      number,
      zipcode,
      location,
    } = req.body;
    req.flash('error', 'This field needs a minimum of 4 characters and a maximum of 10');
    res.render('users/update', {
      user: {
        email,
        name,
        lastName,
        phone,
        owner: ownerString,
        keeper: keeperString,
        street,
        number,
        zipcode,
        location,
      },
    });
  }
};

const checkIfNameInDatabaseIsEmpty = async (req, res, next) => {
  const { _id } = res.locals.currentUser;
  try {
    const user = await User.findById({ _id });
    if (!user.name) {
      req.flash('error', 'A name is required');
      res.redirect('/profile/update');
    } else if (user.name.match(/^[0-9a-zA-Z]{3,25}$/)) {
      next();
    } else {
      req.flash('error', 'A name is required');
      res.redirect('/profile/update');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { isValidID, checkIfNameisEmpty, checkIfNameInDatabaseIsEmpty };
