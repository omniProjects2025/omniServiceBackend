const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./Config/database');

const userRouter = require('./routes/userRoutes');
const specialtiesRouter = require('./routes/specialtyRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const doctorsnew = require('./routes/doctorsNewRoutes');
const mailRoutes = require('./routes/mailRoutes');
const healthpackage = require('./routes/healthPackagesRoutes');
const surgicalpackage = require('./routes/fixedSurgicalPackagesRoutes');
const leadsquaredRoutes = require('./routes/leadsquaredRoutes');
// Removed unused news and blogs routes
const app = express();
app.set('trust proxy', 1);

// Middleware to parse JSON bodies
app.use(express.json({ limit: '2mb' }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// CORS Configuration - Secure and Restrictive
const parsedEnvOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// SECURE: Only allow specific, necessary origins
const defaultOrigins = [
  // Production domains (HTTPS only for security)
  'https://omni-hospitals.in',
  'https://www.omni-hospitals.in',
  'https://omnihospitals.in',
  'https://www.omnihospitals.in',
  'https://api.omni-hospitals.in',
  // Legacy domains (for backward compatibility)
  'https://omni-fronted-final.vercel.app',
  'https://omni-frontend-final.vercel.app',
  'https://omniprojects2025.github.io',
  // Development (HTTP allowed for local dev only)
  'http://localhost:4200',
  'http://localhost:3000',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3000',
  // cPanel deployment domains (add your actual cPanel domain here)
  'https://yourdomain.com',
  'http://yourdomain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Always allow localhost for development
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      console.log(`✅ CORS allowed localhost origin: ${origin}`);
      return callback(null, true);
    }
    
    // Allow no origin for testing tools
    if (!origin) {
      console.log(`✅ CORS allowed no-origin request`);
      return callback(null, true);
    }
    
    const allowedOrigins = defaultOrigins;
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS allowed origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      console.log(`📝 Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`CORS: Origin '${origin}' not allowed. Allowed origins: ${allowedOrigins.join(', ')}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'Cache-Control',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Enhanced CORS debugging
app.use((req, res, next) => {
  console.log(`🌐 Request from origin: ${req.get('origin') || 'no-origin'}`);
  console.log(`🌐 Request method: ${req.method}`);
  console.log(`🌐 Request path: ${req.path}`);
  next();
});

// Explicit OPTIONS handler for preflight requests
app.options('*', (req, res) => {
  console.log(`🔄 Handling OPTIONS preflight request from: ${req.get('origin') || 'no-origin'}`);
  res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// SECURITY: Force HTTPS in production (but allow HTTP for cPanel subdomains)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const host = req.header('host');
    const protocol = req.header('x-forwarded-proto') || (req.secure ? 'https' : 'http');
    
    // Allow HTTP for localhost and development domains
    if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      return next();
    }
    
    // Force HTTPS for production domains
    if (protocol !== 'https') {
      return res.redirect(`https://${host}${req.url}`);
    }
    
    next();
  });
}

// SECURITY: Enhanced helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow CORS
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// SECURITY: Prevent HTTP Parameter Pollution
app.use(hpp());

// SECURITY: More restrictive rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // Stricter in production
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health' || req.path === '/api/health'
});

app.use(limiter);

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression improves response time
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'OMNI Hospitals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    origin: req.get('origin') || 'no-origin'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'OMNI Hospitals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    origin: req.get('origin') || 'no-origin'
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.status(200).json({ 
    message: 'CORS is working!',
    origin: req.get('origin') || 'no-origin',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Simple test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API is working!',
    origin: req.get('origin') || 'no-origin',
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// SECURITY: All routes properly namespaced under /api
// This prevents accidental exposure of endpoints and improves organization
app.use('/api', userRouter);
app.use('/api', specialtiesRouter);
app.use('/api', doctorRoutes);
app.use('/api', mailRoutes);
app.use('/api', healthpackage);
app.use('/api', surgicalpackage);
app.use('/api', doctorsnew);
app.use('/api/leadsquared', leadsquaredRoutes);

// SECURITY: Remove legacy routes - they create security vulnerabilities
// All API calls should go through /api prefix for consistency and security
// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database successfully connected');

    // Warm up cache for frequently requested datasets (non-blocking)
    try {
      const axios = require('axios');
      const PORT = process.env.PORT || 3000;
      const baseUrls = ['/', '/api/v1'].map(base => `http://localhost:${PORT}${base}`);
      // Start server temporarily to allow warmup requests
    } catch (e) {
      // noop if axios not available; skip warmup
    }

    const PORT = process.env.PORT || 3000;
    
    // Handle port conflicts gracefully
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      // Perform warmup requests after server starts
      try {
        const axios = require('axios');
        const baseUrl = `http://localhost:${PORT}/api`;
        const endpoints = [
          '/getdoctors',
          '/gethealthpackages',
          '/getfixedsurgicalpackages',
          '/getspecialty'
        ];
        
        // Wait a bit for server to be ready, then warm up endpoints
        setTimeout(async () => {
          console.log('🔥 Starting cache warmup for API endpoints...');
          for (const endpoint of endpoints) {
            try {
              await axios.get(`${baseUrl}${endpoint}`);
              console.log(`✅ Warmed up: ${endpoint}`);
            } catch (err) {
              console.log(`⚠️ Warmup failed for ${endpoint}: ${err.message}`);
            }
          }
          console.log('🎯 Cache warmup completed');
        }, 2000);
        
        console.log('🔥 Starting cache warmup for API endpoints');
      } catch (e) {
        console.log('⚠️ Warmup skipped: axios not available');
      }
    });

    // Handle port conflicts
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is already in use. Trying alternative port...`);
        const alternativePort = PORT + 1;
        const newServer = app.listen(alternativePort, () => {
          console.log(`🚀 Server is running on alternative port ${alternativePort}`);
        });
        newServer.on('error', (altErr) => {
          console.error(`❌ Failed to start server on ports ${PORT} and ${alternativePort}:`, altErr.message);
          process.exit(1);
        });
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }
};

// Global 404 and error handlers
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
app.use(notFound);
app.use(errorHandler);

startServer();

