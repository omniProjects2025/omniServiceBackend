const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import database connection
const connectDB = require('./Config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const specialtyRoutes = require('./routes/specialtyRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const doctorsNewRoutes = require('./routes/doctorsNewRoutes');
const mailRoutes = require('./routes/mailRoutes');
const healthPackageRoutes = require('./routes/healthPackagesRoutes');
const surgicalPackageRoutes = require('./routes/fixedSurgicalPackagesRoutes');
const leadsquaredRoutes = require('./routes/leadsquaredRoutes');

// Import middleware
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// ==================== MIDDLEWARE SETUP ====================

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// CORS Configuration - Simplified and Fixed
const allowedOrigins = [
  // Production domains
  'https://omni-hospitals.in',
  'https://www.omni-hospitals.in',
  'https://omnihospitals.in',
  'https://www.omnihospitals.in',
  'https://api.omni-hospitals.in',
  // Legacy domains
  'https://omni-fronted-final.vercel.app',
  'https://omni-frontend-final.vercel.app',
  'https://omniprojects2025.github.io',
  // Development domains
  'http://localhost:4200',
  'http://localhost:3000',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Always allow localhost for development
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    // Allow no origin for testing tools
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
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
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Security middleware
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
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 200,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/api/health'
});

app.use(limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// ==================== ROUTES ====================

// Health check endpoints
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

// Test endpoints
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'API is working!',
    origin: req.get('origin') || 'no-origin',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', userRoutes);
app.use('/api', specialtyRoutes);
app.use('/api', doctorRoutes);
app.use('/api', mailRoutes);
app.use('/api', healthPackageRoutes);
app.use('/api', surgicalPackageRoutes);
app.use('/api', doctorsNewRoutes);
app.use('/api/leadsquared', leadsquaredRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// ==================== SERVER STARTUP ====================

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');

    // Start server
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Warm up cache after server starts
      setTimeout(() => {
        warmupCache(PORT);
      }, 2000);
    });

    // Handle port conflicts
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is busy, trying ${PORT + 1}...`);
        const newServer = app.listen(PORT + 1, () => {
          console.log(`🚀 Server running on port ${PORT + 1}`);
        });
        newServer.on('error', () => {
          console.error('❌ Failed to start server on any port');
          process.exit(1);
        });
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

// Cache warmup function
const warmupCache = async (port) => {
  try {
    const axios = require('axios');
    const baseUrl = `http://localhost:${port}/api`;
    const endpoints = [
      '/getdoctors',
      '/gethealthpackages',
      '/getfixedsurgicalpackages',
      '/getspecialty'
    ];

    console.log('🔥 Warming up cache...');
    for (const endpoint of endpoints) {
      try {
        await axios.get(`${baseUrl}${endpoint}`);
        console.log(`✅ Warmed up: ${endpoint}`);
      } catch (err) {
        console.log(`⚠️ Warmup failed for ${endpoint}: ${err.message}`);
      }
    }
    console.log('🎯 Cache warmup completed');
  } catch (e) {
    console.log('⚠️ Cache warmup skipped');
  }
};

// Start the server
startServer();