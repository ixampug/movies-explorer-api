const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { loginUser, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/errorNotFound');
const { validateUserSingUp, validateUserSignIn } = require('../middlewares/validate');

router.post('/api/signup', validateUserSingUp, createUser);
router.post('/api/signin', validateUserSignIn, loginUser);

router.use(auth);

router.use('/api/users', userRoutes);
router.use('/api/movies', movieRoutes);

router.use('*', auth, (req, res, next) => {
  next(new ErrorNotFound('not found'));
});

module.exports = router;
