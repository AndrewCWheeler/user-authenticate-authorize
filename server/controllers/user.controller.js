const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;
const { randomString } = require('../middleware/randomString.middleware');
const {
  sendEmailVerificationLink,
} = require('../middleware/nodemailer.middleware');

module.exports = {
  index: (req, res) => {
    res.json({ message: 'Backend server connected' });
  },
  getAll: (req, res) => {
    User.find({})
      .then((users) => {
        res.json({ message: 'success', results: users });
      })
      .catch((error) => res.json({ message: 'error', results: error }));
  },
  oneUser: (req, res) => {
    User.findOne({ _id: req.params.id })
      .then((user) => res.json({ message: 'success', results: user }))
      .catch((error) => res.json({ message: 'error', results: error }));
  },

  editUser: (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
      useFindAndModify: false,
    })
      .then((user) => res.json({ message: 'success', results: user }))
      .catch((error) => res.json({ message: 'error', results: error }));
  },
  register: (req, res) => {
    const email = req.body.email;
    // const duplicateUser = User.findOne({ email: email });
    // if (duplicateUser) {
    //   res.status(400).json({ message: 'duplicate user error' });
    // }
    const uniqueString = randomString();
    const newUser = {
      ...req.body,
      uniqueString,
      status: 'requested',
    };
    User.create(newUser)
      .then((user) => {
        let userObj = {
          _id: user._id,
          // email: user.email,
          // uniqueString: uniqueString,
          status: user.status,
        };
        sendEmailVerificationLink(email, uniqueString);
        res.json({ message: 'success', results: userObj });
      })
      .catch((error) => res.json(error));
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
      secret,
      { expiresIn: '7d' }
    );
    req.session.userId = user._id;
    let userObj = {
      _id: user._id,
      status: user.status,
    };
    res
      .cookie('usertoken', userToken, {
        httpOnly: true,
      })
      .json({ message: 'success', results: userObj });
  },
  deleteUser: (req, res) => {
    User.findByIdAndDelete({ _id: req.params.id })
      .then((user) => res.json({ message: 'success', results: user }))
      .catch((err) => res.json({ message: 'error', results: err }));
  },
  logout: (req, res) => {
    res.clearCookie('usertoken');
    req.session.destroy((err) => {
      if (err) {
        return res.json({ message: 'failed to logout' });
      }
      res.clearCookie('sid');
      res.sendStatus(200);
    });
  },
};
