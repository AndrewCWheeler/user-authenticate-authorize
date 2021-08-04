const { User } = require('../models/user.model');
const {
  sendApprovalLink,
  sendApprovalConfirmationLink,
} = require('../middleware/nodemailer.middleware');

module.exports = {
  authUser: async (req, res) => {
    const reqId = req.params.id;
    const requestUser = await User.findOne({ _id: reqId });
    const user = await User.findOne({ _id: req.session.userId });

    if (!requestUser || !user || reqId !== req.session.userId) {
      return res.status(400);
    }

    const userObj = {
      _id: user._id,
      status: user.status,
      isAdmin: user.isAdmin,
    };

    res.status(200).json({ message: 'success!', results: userObj });
  },
  verifyUserEmail: async (req, res) => {
    const updateObj = { emailIsVerified: true, status: 'verified' };
    const { uniqueString } = req.params;
    await User.findOneAndUpdate({ uniqueString: uniqueString }, updateObj, {
      runValidators: true,
      new: true,
      useFindAndModify: false,
    })
      .then((user) => {
        sendApprovalLink(user.username, user.email, user.message);
        let userObj = {
          _id: user._id,
          email: user.email,
          // uniqueString: uniqueString,
          status: user.status,
        };
        res.json({ message: 'success', results: userObj });
      })
      .catch((error) => res.json({ message: 'error', results: error }));
  },
  approveUser: async (req, res) => {
    await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
      useFindAndModify: false,
    })
      .then((user) => {
        let userObj = {
          _id: user._id,
          uniqueString: user.uniqueString,
          status: user.status,
        };
        sendApprovalConfirmationLink(user.email, user.uniqueString);
        res.json({ message: 'success', results: userObj });
      })
      .catch((error) => res.json({ message: 'error', results: error }));
  },
};
