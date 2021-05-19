const { User } = require('../models/user.model');
const bcrypt = rquire('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  index: (req, res) => {
    res.json({ message: 'Backend server connected' });
  },
  getAll: (req, res) => {
    User.find({})
      .then((users) => {
        res.json({ message: 'success', users });
      })
      .catch((err) => res.json(err));
  },
  register: (req, res) => {
    User.create(req.body)
      .then((user) => {
        const userToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res
          .cookie('usertoken', userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
          })
          .json({ message: 'success!', user });
      })
      .catch((err) => res.json(err));
  },
  login: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
      return res.sendStatus(400);
    }
    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!correctPassword) {
      return res.sendStatus(400);
    }
    const userToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res
      .cookie('usertoken', userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
      })
      .json({ message: 'success!', user });
  },
  logout: (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
  },
};
