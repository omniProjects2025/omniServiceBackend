const express = require('express');
const router = express.Router();
const multer = require('multer');
const mailController = require('../controllers/mailController');
const rateLimit = require('express-rate-limit');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
});

// Rate limiting for mail routes
const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 email requests per windowMs
  message: {
    status: 'error',
    message: 'Too many email requests, please try again later.'
  }
});

// Mail routes
router.post('/send-email', mailLimiter, upload.any(), mailController.sendEmail);
router.post('/send-contact-email', mailLimiter, mailController.sendContactEmail);

module.exports = router;