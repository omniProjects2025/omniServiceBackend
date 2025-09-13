const mongoose = require("mongoose");

const connectDB = async () => {
    const fallbackUri = "mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService";
    const mongoUri = process.env.MONGO_URI || fallbackUri;
    
    const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
    };
    
    try {
        await mongoose.connect(mongoUri, options);
        console.log("✅ Database connected with optimized settings");
        
        // Ensure indexes are created for better performance
        await mongoose.connection.db.collection('healthpackages').createIndex({ package_title: 1 });
        await mongoose.connection.db.collection('fixedsurgicalpackages').createIndex({ package_title: 1 });
        await mongoose.connection.db.collection('doctorsData').createIndex({ location: 1 });
        await mongoose.connection.db.collection('doctorsData').createIndex({ doctor_designation: 1 });
        
        console.log("✅ Database indexes created for optimal performance");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;