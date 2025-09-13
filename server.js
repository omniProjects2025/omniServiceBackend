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
  // Development (HTTP allowed for local dev only)
  'http://localhost:4200',
  'http://localhost:3000',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // SECURITY: In production, don't allow requests with no origin
    const isProduction = process.env.NODE_ENV === 'production';
    if (!origin && isProduction) {
      return callback(new Error('Origin header required in production'));
    }
    
    // Allow no origin in development for testing tools
    if (!origin && !isProduction) return callback(null, true);
    
    const allowedOrigins = parsedEnvOrigins.length ? parsedEnvOrigins : defaultOrigins;
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS allowed origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      console.log(`📝 Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`CORS: Origin '${origin}' not allowed. Allowed origins: ${allowedOrigins.join(', ')}`));
    }
  },
  // SECURITY: Restrict HTTP methods to only what's needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // SECURITY: Minimal required headers only
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'Cache-Control'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  // SECURITY: Prevent credentials from being sent to wrong origins
  preflightContinue: false
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// SECURITY: Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
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
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'OMNI Hospitals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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
    app.listen(PORT, () => {
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
        
        // Wait a bit for server to be ready
        setTimeout(() => {
          endpoints.forEach(endpoint => {
            axios.get(`${baseUrl}${endpoint}`)
              .then(() => console.log(`✅ Warmed up: ${endpoint}`))
              .catch(err => console.log(`⚠️ Warmup failed for ${endpoint}: ${err.message}`));
          });
        }, 1000);
        
        console.log('🔥 Starting cache warmup for API endpoints');
      } catch (e) {
        console.log('⚠️ Warmup skipped: axios not available');
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

