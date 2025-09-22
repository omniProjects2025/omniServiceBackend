const express = require('express');
const router = express.Router();
const multer = require('multer');
const mailController = require('../controllers/mailController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mail route using upload.single('resume') as in your working code
router.post('/send-email', upload.single('resume'), mailController.sendEmail);

module.exports = router;