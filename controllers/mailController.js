const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory (buffer)
const upload = multer({ storage });

// Send email function
exports.sendEmail = async (req, res) => {
  try {

    const { firstName, lastName, phone, email, position } = req.body;

    if (!firstName || !phone || !email || !position || !req.file) {

      return res.status(400).json({ message: "Missing required fields or resume file" });
    }

    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anushajammula02@gmail.com', 
        pass: 'iikk gxoz cfbg xotn',
      },
    });

    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: 'anushajammula02@gmail.com', // Changed from user email to Gmail account
      replyTo: email,
      to: 'pallesathish4044@gmail.com',
      subject: `Job Application from ${firstName} ${lastName || ''}`,
      text: `
        Name: ${firstName} ${lastName || ''}
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

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send email',
      error: error.message 
    });
  }
};