const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("are you connectiong to DB");
    await mongoose.connect("mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService");
    console.log("not connected");
}

module.exports = connectDB;