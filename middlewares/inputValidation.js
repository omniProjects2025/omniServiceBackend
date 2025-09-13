const Joi = require('joi');

// SECURITY: Comprehensive input validation schemas
const schemas = {
  // User validation
  signup: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(), // Indian mobile format
    message: Joi.string().trim().max(1000).optional()
  }),

  // Contact form validation
  contact: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    message: Joi.string().trim().max(1000).optional()
  }),

  // Generic ID validation for GET requests
  mongoId: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })
};

// SECURITY: Sanitize input data
const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    // Remove potentially dangerous characters
    return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
               .replace(/javascript:/gi, '')
               .replace(/on\w+\s*=/gi, '')
               .trim();
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
};

// Main validation middleware
const validate = (schemaName, source = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        status: 'error',
        message: 'Validation schema not found'
      });
    }

    // Get data from specified source (body, params, query)
    const data = req[source];
    
    // SECURITY: Sanitize input before validation
    const sanitizedData = sanitizeInput(data);
    req[source] = sanitizedData;

    // Validate the sanitized data
    const { error, value } = schema.validate(sanitizedData, { 
      abortEarly: false,
      stripUnknown: true // SECURITY: Remove unknown fields
    });

    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    // Replace original data with validated and sanitized data
    req[source] = value;
    next();
  };
};

// SECURITY: Rate limiting for specific endpoints
const createEndpointLimiter = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests for this endpoint'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  validate,
  schemas,
  sanitizeInput,
  createEndpointLimiter
};



