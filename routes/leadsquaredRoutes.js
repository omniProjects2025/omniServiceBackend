const express = require('express');
const axios = require('axios');
const router = express.Router();
const { validate, createEndpointLimiter } = require('../middlewares/inputValidation');

// SECURITY: Rate limiting for form submissions
const formSubmissionLimiter = createEndpointLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // Only 10 form submissions per 5 minutes per IP
  'Too many form submissions, please try again later'
);

// SECURITY: LeadSquared credentials stored securely on backend
const LEADSQUARED_CONFIG = {
  baseUrl: 'https://api-in21.leadsquared.com/v2/',
  accessKey: process.env.LEADSQUARED_ACCESS_KEY || 'u$r56afea08b32d556818ad1a5f69f0e7f0',
  secretKey: process.env.LEADSQUARED_SECRET_KEY || '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
};

// SECURITY: Input validation schema for LeadSquared submissions
const leadsquaredSchema = require('joi').object({
  Attribute: require('joi').string().required(),
  Value: require('joi').string().required()
});

const validateLeadsquaredPayload = (req, res, next) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Payload must be an array of attributes'
    });
  }

  const errors = [];
  req.body.forEach((item, index) => {
    const { error } = leadsquaredSchema.validate(item);
    if (error) {
      errors.push(`Item ${index}: ${error.details[0].message}`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation errors',
      details: errors
    });
  }

  next();
};

// SECURITY: Proxy LeadSquared requests through backend
router.post('/submit', 
  formSubmissionLimiter,
  validateLeadsquaredPayload,
  async (req, res) => {
    try {
      const url = `${LEADSQUARED_CONFIG.baseUrl}LeadManagement.svc/Lead.Capture?accessKey=${LEADSQUARED_CONFIG.accessKey}&secretKey=${LEADSQUARED_CONFIG.secretKey}`;
      
      // SECURITY: Sanitize payload before sending
      const sanitizedPayload = req.body.map(item => ({
        Attribute: item.Attribute.trim(),
        Value: typeof item.Value === 'string' ? item.Value.trim() : item.Value
      }));

      const response = await axios.post(url, sanitizedPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });

      res.status(200).json({
        status: 'success',
        message: 'Lead submitted successfully',
        data: response.data
      });

    } catch (error) {
      console.error('LeadSquared API Error:', error.message);
      
      // SECURITY: Don't expose internal error details to frontend
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit lead. Please try again later.'
      });
    }
  }
);

module.exports = router;



