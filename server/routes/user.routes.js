const UserController = require('../controllers/user.controller');
const { authToken } = require('../middleware/jwt.middleware');
const { userIsAdmin } = require('../middleware/admin.middleware.js');
const { authenticate } = require('../middleware/authenticate.middleware.js');

module.exports = (app) => {
  app.get('/api', UserController.index);
  app.post('/api/register', UserController.register);
  app.post('/api/login', UserController.login);
  app.get('/api/logout', authToken, UserController.logout);
  app.get(
    '/api/users',
    authToken,
    userIsAdmin,
    authenticate,
    UserController.getAll
  );
  app.get('/api/users/:id', authToken, userIsAdmin, UserController.oneUser);
  app.patch(
    '/api/users/:id',
    authToken,
    userIsAdmin,
    authenticate,
    UserController.editUser
  );
  app.delete(
    '/api/users/:id',
    authToken,
    userIsAdmin,
    UserController.deleteUser
  );
};
