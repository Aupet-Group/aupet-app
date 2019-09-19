const isValidID = (id) => (req, res, next) => {
  if (req.params[id].match(/^[0-9a-fA-F]{24}$/)) next();
  else res.render('404');
};

module.exports = {
  isValidID,
};
