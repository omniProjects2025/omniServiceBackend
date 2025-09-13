const User = require('../Models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

// Create new user
exports.signup = asyncHandler(async (req, res) => {
  const { fullName, emailId, phoneNumber, location, department, message } = req.body;

  // Validation
  if (!fullName || !emailId) {
    throw new AppError('Full name and email are required', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Extract first name
  const firstName = fullName.trim().split(' ')[0] || '';

  // Create user
  const user = new User({
    firstName,
    emailId,
    phoneNumber,
    location,
    department,
    message
  });

  const newUser = await user.save();

  // Invalidate cache
  cache.delete('users:list');

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: newUser
  });
});

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
  const cacheKey = 'users:list';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Users fetched successfully',
      data: cached
    });
  }

  const users = await User.find({}, {
    firstName: 1,
    emailId: 1,
    phoneNumber: 1,
    location: 1,
    department: 1,
    message: 1,
    createdAt: 1
  }).lean().sort({ createdAt: -1 });

  cache.set(cacheKey, users, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Users fetched successfully',
    data: users
  });
});

// Get user by email
exports.getUserById = asyncHandler(async (req, res) => {
  const { emailId } = req.query;

  if (!emailId) {
    throw new AppError('Email ID is required', 400);
  }

  const user = await User.findOne({ emailId }).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    message: 'User fetched successfully',
    data: user
  });
});

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const updateData = req.body;

  if (!emailId) {
    throw new AppError('Email ID is required', 400);
  }

  const user = await User.findOneAndUpdate(
    { emailId },
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Invalidate cache
  cache.delete('users:list');

  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: user
  });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  const { emailId } = req.params;

  if (!emailId) {
    throw new AppError('Email ID is required', 400);
  }

  const user = await User.findOneAndDelete({ emailId });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Invalidate cache
  cache.delete('users:list');

  res.json({
    status: 'success',
    message: 'User deleted successfully'
  });
});