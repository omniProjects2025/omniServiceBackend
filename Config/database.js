const mongoose = require('mongoose');

const connectDB = async () => {
  const fallbackUri = "mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService";
  const mongoUri = process.env.MONGO_URI || fallbackUri;
  
  // Optimized connection options
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority'
  };
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, options);
    console.log('✅ Database connected successfully');
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
};

// Create database indexes
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Health packages indexes
    await db.collection('healthpackages').createIndex({ package_title: 1 });
    await db.collection('healthpackages').createIndex({ location: 1 });
    await db.collection('healthpackages').createIndex({ discount: 1 });
    
    // Surgical packages indexes
    await db.collection('fixedsurgicalpackages').createIndex({ package_title: 1 });
    await db.collection('fixedsurgicalpackages').createIndex({ price: 1 });
    
    // Doctors indexes
    await db.collection('doctorsData').createIndex({ location: 1 });
    await db.collection('doctorsData').createIndex({ doctor_designation: 1 });
    await db.collection('doctorsData').createIndex({ doctor_name: 1 });
    
    // Users indexes
    await db.collection('users').createIndex({ emailId: 1 }, { unique: true });
    await db.collection('users').createIndex({ phoneNumber: 1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (err) {
    console.log('⚠️ Index creation failed (may already exist):', err.message);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📡 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;