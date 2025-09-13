const User = require("../Models/user");
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

exports.signup = asyncHandler(async (req, res) => {
  const { fullName, emailId, phoneNumber, location, department, message } = req.body || {};
  if (!fullName || !emailId) {
    throw new AppError('fullName and emailId are required', 400);
  }

  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts?.[0] || "";

  const user = new User({
    firstName,
    emailId,
    phoneNumber,
    location,
    department,
    message
  });

  const newUser = await user.save();
  res.json({
    message: "User added successfully",
    data: newUser
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const userData = await User.find();
  res.json({
    message: "I have got all user",
    userData
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { emailId } = req.query || {};
  if (!emailId) {
    throw new AppError('emailId is required', 400);
  }
  const findUser = await User.findOne({ emailId });
  if (!findUser) {
    throw new AppError('User not found', 404);
  }
  res.json({
    message: "I have got the user",
    findUser
  });
});


