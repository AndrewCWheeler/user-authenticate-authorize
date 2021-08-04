const { User } = require('../models/user.model');

module.exports.authenticate = async (req, res, next) => {
  const loggedUser = await User.findOne({ _id: req.session.userId });
  if (loggedUser === null) {
    res.status(404).json({
      message: 'You do not exist in the database.',
      results: loggedUser,
    });
    return;
  }
  if (!loggedUser.emailIsVerified) {
    res.status(401).json({
      message: 'Email not yet verified.',
      results: loggedUser,
    });
    return;
  }
  if (!loggedUser.isApproved) {
    res.status(401).json({
      message: 'Note: Your account has not yet been approved.',
      results: loggedUser,
    });
    return;
  } else {
    next();
  }
};

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
