const nodemailer = require('nodemailer');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// Send email
exports.sendEmail = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, position, to } = req.body;

  // Validation
  if (!firstName || !lastName || !phone || !email || !position) {
    throw new AppError('Missing required fields: firstName, lastName, phone, email, position', 400);
  }

  // Get file from multer
  const file = (req.files && req.files[0]) || req.file;
  if (!file) {
    throw new AppError('Resume file is required', 400);
  }

  // Email configuration
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'anushajammula02@gmail.com',
      pass: process.env.SMTP_PASS || 'iikk gxoz cfbg xotn'
    }
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
  } catch (error) {
    throw new AppError(`SMTP verification failed: ${error.message}`, 502);
  }

  // Email content
  const mailOptions = {
    from: process.env.SMTP_USER || 'anushajammula02@gmail.com',
    replyTo: email,
    to: to || process.env.MAIL_TO || 'pallesathish4044@gmail.com',
    subject: `Job Application from ${firstName} ${lastName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Position: ${position}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Job Application</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Position:</strong> ${position}</p>
        </div>
        <p style="margin-top: 20px; color: #666;">
          This application was submitted through the OMNI Hospitals website.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer
      }
    ]
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  
  // Check if email was accepted
  const accepted = Array.isArray(info.accepted) ? info.accepted : [];
  if (accepted.length === 0) {
    throw new AppError('Email was not accepted by SMTP server', 502);
  }

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully',
    data: {
      messageId: info.messageId,
      accepted: accepted,
      response: process.env.NODE_ENV !== 'production' ? info.response : undefined
    }
  });
});

// Send contact form email
exports.sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    throw new AppError('Missing required fields: name, email, subject, message', 400);
  }

  // Email configuration
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'anushajammula02@gmail.com',
      pass: process.env.SMTP_PASS || 'iikk gxoz cfbg xotn'
    }
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
  } catch (error) {
    throw new AppError(`SMTP verification failed: ${error.message}`, 502);
  }

  // Email content
  const mailOptions = {
    from: process.env.SMTP_USER || 'anushajammula02@gmail.com',
    replyTo: email,
    to: process.env.MAIL_TO || 'pallesathish4044@gmail.com',
    subject: `Contact Form: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Contact Form Submission</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="margin-top: 20px; color: #666;">
          This message was submitted through the OMNI Hospitals contact form.
        </p>
      </div>
    `
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  
  // Check if email was accepted
  const accepted = Array.isArray(info.accepted) ? info.accepted : [];
  if (accepted.length === 0) {
    throw new AppError('Email was not accepted by SMTP server', 502);
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact email sent successfully',
    data: {
      messageId: info.messageId,
      accepted: accepted
    }
  });
});