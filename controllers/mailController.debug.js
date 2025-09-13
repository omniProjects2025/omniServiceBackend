const nodemailer = require('nodemailer');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// Debug version of sendEmail to see what's being received
exports.sendEmailDebug = asyncHandler(async (req, res) => {
  console.log('=== DEBUG: Mail Controller ===');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  console.log('req.files:', req.files);
  console.log('req.headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  
  const { firstName, lastName, phone, email, position } = req.body || {};
  
  console.log('Extracted fields:');
  console.log('firstName:', firstName);
  console.log('lastName:', lastName);
  console.log('phone:', phone);
  console.log('email:', email);
  console.log('position:', position);

  // Multer .any() puts files in req.files
  const file = (req.files && req.files[0]) || req.file;
  console.log('File object:', file);
  
  if (!firstName || !lastName || !phone || !email || !position || !file) {
    console.log('Missing fields check:');
    console.log('firstName missing:', !firstName);
    console.log('lastName missing:', !lastName);
    console.log('phone missing:', !phone);
    console.log('email missing:', !email);
    console.log('position missing:', !position);
    console.log('file missing:', !file);
    
    return res.status(400).json({
      status: 'debug',
      message: 'Missing required fields or resume file',
      receivedBody: req.body,
      receivedFile: file,
      receivedFiles: req.files,
      contentType: req.headers['content-type']
    });
  }

  res.status(200).json({
    status: 'debug-success',
    message: 'All fields received correctly',
    receivedBody: req.body,
    receivedFile: file ? { name: file.originalname, size: file.size } : null
  });
});

// Original sendEmail method
exports.sendEmail = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, position } = req.body || {};

  // Multer .any() puts files in req.files
  const file = (req.files && req.files[0]) || req.file;
  if (!firstName || !lastName || !phone || !email || !position || !file) {
    throw new AppError('Missing required fields or resume file', 400);
  }

  // Fallback to Gmail settings if env is missing
  const useEnv = process.env.SMTP_USER && process.env.SMTP_PASS;
  const transporter = nodemailer.createTransporter(
    useEnv
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        }
      : {
          service: 'gmail',
          auth: { user: 'anushajammula02@gmail.com', pass: 'iikk gxoz cfbg xotn' }
        }
  );

  // Verify SMTP before sending (helps surface config errors)
  try {
    await transporter.verify();
  } catch (e) {
    throw new AppError(`SMTP verification failed: ${e.message}`, 502);
  }

  const mailTo = (req.body && req.body.to) || process.env.MAIL_TO || 'pallesathish4044@gmail.com';
  const authenticatedUser =
    (transporter && transporter.options && transporter.options.auth && transporter.options.auth.user) ||
    process.env.SMTP_USER ||
    process.env.SMTP_FROM ||
    'no-reply@yourdomain.com';

  const mailOptions = {
    from: authenticatedUser,
    replyTo: email,
    to: mailTo,
    envelope: {
      from: authenticatedUser,
      to: mailTo
    },
    subject: `Message from ${firstName}`,
    text: `
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone}
      Position: ${position}
    `,
    html: `
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Position:</strong> ${position}</p>
    `,
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  const accepted = Array.isArray(info.accepted) ? info.accepted : [];
  if (accepted.length === 0) {
    throw new AppError('Email was not accepted by SMTP server', 502);
  }
  res.status(200).json({
    message: 'Email sent successfully',
    messageId: info.messageId,
    accepted,
    response: process.env.NODE_ENV !== 'production' ? info.response : undefined
  });
});

