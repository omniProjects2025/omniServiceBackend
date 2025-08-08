const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const mailRouter = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory (buffer)
const upload = multer({ storage });
mailRouter.post('/send-email', upload.single('resume'), async (req, res) => {

  const { firstName, lastName, phone, email, position } = req.body;

  if (!firstName || !lastName || !phone || !email || !position || !req.file) {
    return res.status(400).json({ message: "Missing required fields or resume file" });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anushajammula02@gmail.com', 
      pass: 'iikk gxoz cfbg xotn',
    },
  });

  const mailOptions = {
    from: email,
    to: 'vikshitha.voore@omnihospitals.in',
    subject: `Message from ${firstName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Position: ${position}
    `,
    attachments: [
      {
        filename: req.file.originalname,
        content: req.file.buffer,  // Attach file as buffer
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = mailRouter;
