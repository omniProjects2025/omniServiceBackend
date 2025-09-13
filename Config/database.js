const mongoose = require("mongoose");

const connectDB = async () => {
    const fallbackUri = "mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService";
    const mongoUri = process.env.MONGO_URI || fallbackUri;
    
    // Simplified options for better compatibility
    const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority'
    };
    
    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(mongoUri, options);
        console.log("✅ Database connected successfully");
        
        // Create indexes for better performance (with error handling)
        try {
            await mongoose.connection.db.collection('healthpackages').createIndex({ package_title: 1 });
            await mongoose.connection.db.collection('fixedsurgicalpackages').createIndex({ package_title: 1 });
            await mongoose.connection.db.collection('doctorsData').createIndex({ location: 1 });
            await mongoose.connection.db.collection('doctorsData').createIndex({ doctor_designation: 1 });
            console.log("✅ Database indexes created for optimal performance");
        } catch (indexErr) {
            console.log("⚠️ Index creation failed (may already exist):", indexErr.message);
        }
        
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        console.error("🔍 Connection URI:", mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
        throw err;
    }
};

module.exports = connectDB;