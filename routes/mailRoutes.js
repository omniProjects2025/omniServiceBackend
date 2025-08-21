const express = require('express');
const router = express.Router();
const multer = require('multer');
const mailController = require('../controllers/mailController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only PDF/DOC/DOCX files are allowed'));
  }
});

// Accept common field names: resume, file, document
router.post('/send-email', upload.any(), mailController.sendEmail);

module.exports = router;


