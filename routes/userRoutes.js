const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const rateLimit = require('express-rate-limit');

// Rate limiting for user routes
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many user requests, please try again later.'
  }
});

// User routes
router.post('/signup', userLimiter, userController.signup);
router.get('/getusers', userController.getUsers);
router.get('/getuserbyid', userController.getUserById);
router.put('/updateuser/:emailId', userController.updateUser);
router.delete('/deleteuser/:emailId', userController.deleteUser);

module.exports = router;