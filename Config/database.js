const mongoose = require("mongoose");

const connectDB = async () => {
    const fallbackUri = "mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService";
    const mongoUri = process.env.MONGO_URI || fallbackUri;
    try {
        await mongoose.connect(mongoUri);
        console.log("✅ Database connected");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;