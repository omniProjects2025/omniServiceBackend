const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate, createEndpointLimiter } = require('../middlewares/inputValidation');

// SECURITY: Rate limiting for signup endpoint (more restrictive)
const signupLimiter = createEndpointLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // Only 5 signups per 15 minutes per IP
  'Too many signup attempts, please try again later'
);

// SECURITY: Input validation and rate limiting applied
router.post('/signup', signupLimiter, validate('signup'), userController.signup);
router.get('/getusers', userController.getUsers);
router.get('/getuserbyid', userController.getUserById);

module.exports = router;


