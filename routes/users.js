const router = require('express').Router();

const {
  validateUserInfoUpdate,
} = require('../middlewares/validate');

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', validateUserInfoUpdate, updateUserInfo);

module.exports = router;
