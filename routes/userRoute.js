const express = require('express');
const { authProtect } = require('../middlewares/authProtect');

const {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userControllers');
const {
  generateAndSendOTP,
  verifyOTP,
  createUser,
  createAvatar,
} = require('../controllers/authController');
const router = express.Router();
//User Auth routers
router.post('/signup', createUser);
router.post('/send-otp/:contact_number', generateAndSendOTP);
router.post('/auth', verifyOTP);
router.post('/user-avatar', authProtect, createAvatar);
//User routers
router.route('/').get(getUsers);
router
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
