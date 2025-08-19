// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/database');
const compression = require('compression'); //This reduces payload size and improves response time.

const userRouter = require('./apis/user');
const specialtiesRouter = require('./apis/specialties');
const doctorRoutes = require('./apis/doctordetails');
const doctorsnew = require('./apis/doctors_new')
const mailRoutes = require('./apis/mail');
const healthpackage = require('./apis/healthpackages');
const surgicalpackage = require('./apis/fixed_surgical_packages')
const newsRouter = require('./apis/news');
const blogsRoute = require('./apis/blogsdetails');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    'https://omni-fronted-final.vercel.app',               // Local Dev
    'https://omniprojects2025.github.io', // GitHub Pages root domain
    'http://localhost:4200',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));




//  improves response time.
app.use(compression());

// app.use(cors(corsOptions));
app.options("*", cors());
// Register routes
app.use('/', userRouter);
app.use('/', specialtiesRouter);
app.use('/', doctorRoutes);
app.use('/', mailRoutes);
app.use('/', healthpackage);
app.use('/', surgicalpackage)
app.use('/', newsRouter);
app.use('/', blogsRoute);
app.use('/', doctorsnew);
// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database successfully connected');

    const PORT = process.env.PORT || 3000; // ✅ Important for Render
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }
};

startServer();
