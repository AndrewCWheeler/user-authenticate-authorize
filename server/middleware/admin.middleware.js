const { User } = require('../models/user.model');

module.exports.userIsAdmin = async (req, res, next) => {
  const user = await User.findOne({ _id: req.session.userId });
  if (user === null) {
    res.status(404).json({
      message: 'error',
      results: 'You do not exist in the database.',
    });
    return;
  }
  if (!user.isAdmin) {
    res.status(401).json({
      message: 'error',
      results: 'You are not an authorized admin.',
    });
    return;
  } else {
    next();
  }
};
