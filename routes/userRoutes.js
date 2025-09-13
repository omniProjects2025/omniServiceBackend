const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.get('/getusers', userController.getUsers);
router.get('/getuserbyid', userController.getUserById);

module.exports = router;


