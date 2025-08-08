const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 2, maxLength: 50, trim: true },
  lastName: { type: String, required: false, minLength: 2, maxLength: 50, trim: true },
  emailId: { type: String, required: true, trim: true },
  password: { type: String, default: "" },
  age: { type: Number, min: 18, default: null },
  phoneNumber: { type: String, maxLength: 200 },
  gender: { type: String, default: "" },
  location: { type: String },
  department: { type: String },
  message: { type: String }
});


module.exports = mongoose.model("User", userSchema);