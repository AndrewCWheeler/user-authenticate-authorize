const AuthController = require('../controllers/auth.controller');
const { authToken } = require('../middleware/jwt.middleware');
const { userIsAdmin } = require('../middleware/admin.middleware.js');
const { authenticate } = require('../middleware/authenticate.middleware.js');

module.exports = (app) => {
  app.get('/api/auth/:id', authToken, AuthController.authUser);
  app.get('/api/verify/:uniqueString', AuthController.verifyUserEmail);
  app.patch(
    '/api/approve/:id',
    authToken,
    authenticate,
    userIsAdmin,
    AuthController.approveUser
  );
};
