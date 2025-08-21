// server.js

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
// Removed unused news and blogs routes
const app = express();
app.set('trust proxy', 1);

// Middleware to parse JSON bodies
app.use(express.json({ limit: '2mb' }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const parsedEnvOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const defaultOrigins = [
  'https://omni-fronted-final.vercel.app',
  'https://omni-frontend-final.vercel.app',
  'https://omniprojects2025.github.io',
  'http://localhost:4200'
];
const corsOptions = {
  origin: parsedEnvOrigins.length ? parsedEnvOrigins : defaultOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Security & hardening
app.use(helmet());
app.use(hpp());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression improves response time
app.use(compression());

// Removed permissive wildcard preflight to keep CORS strict
// Register routes - keep legacy root and new versioned path
const mountPaths = ['/', '/api/v1'];
for (const base of mountPaths) {
  app.use(base, userRouter);
  app.use(base, specialtiesRouter);
  app.use(base, doctorRoutes);
  app.use(base, mailRoutes);
  app.use(base, healthpackage);
  app.use(base, surgicalpackage);
  app.use(base, doctorsnew);
}
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
        const bases = ['/', '/api/v1'];
        const urls = [];
        for (const base of bases) {
          urls.push(`http://localhost:${PORT}${base}getdoctors`);
          urls.push(`http://localhost:${PORT}${base}gethealthpackages`);
          urls.push(`http://localhost:${PORT}${base}getfixedsurgicalpackages`);
        }
        urls.forEach(u => axios.get(u).catch(() => {}));
        console.log('🔥 Warmed cache for doctorsNew, health packages, and fixed surgical packages');
      } catch (e) {
        // If axios is not installed or errors, silently skip warmup
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
