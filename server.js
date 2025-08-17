// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/database');
const compression = require('compression'); 

// Routers
const userRouter = require('./apis/user');
const specialtiesRouter = require('./apis/specialties');
const doctorRoutes = require('./apis/doctordetails');
const doctorsnew = require('./apis/doctors_new');
const mailRoutes = require('./apis/mail');
const healthpackage = require('./apis/healthpackages');
const surgicalpackage = require('./apis/fixed_surgical_packages');
const newsRouter = require('./apis/news');
const blogsRoute = require('./apis/blogsdetails');

const app = express();

// ✅ CORS (must be before everything else)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://omniprojects2025.github.io"); // GitHub Pages
  // res.header("Access-Control-Allow-Origin", "*"); // <--- TEMP: uncomment for testing open access
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ handle preflight quickly
  }

  next();
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ✅ Routes
app.use('/', userRouter);
app.use('/', specialtiesRouter);
app.use('/', doctorRoutes);
app.use('/', mailRoutes);
app.use('/', healthpackage);
app.use('/', surgicalpackage);
app.use('/', newsRouter);
app.use('/', blogsRoute);
app.use('/', doctorsnew);

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database successfully connected');

    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }
};

startServer();
