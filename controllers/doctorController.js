const Doctor = require('../Models/doctors_data');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

// Create new doctor
exports.createDoctor = asyncHandler(async (req, res) => {
  const doctorData = req.body;

  if (!doctorData.doctor_name) {
    throw new AppError('Doctor name is required', 400);
  }

  const doctor = new Doctor(doctorData);
  const savedDoctor = await doctor.save();

  // Invalidate cache
  cache.delete('doctors:list');

  res.status(201).json({
    status: 'success',
    message: 'Doctor created successfully',
    data: savedDoctor
  });
});

// Get all doctors
exports.getDoctorDetails = asyncHandler(async (req, res) => {
  const cacheKey = 'doctors:list';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Doctors fetched successfully',
      data: cached
    });
  }

  const doctors = await Doctor.find({}, {
    doctor_name: 1,
    doctor_profile: 1,
    doctor_designation: 1,
    doctor_qualification: 1,
    doctor_experience: 1,
    doctor_location: 1,
    location: 1,
    doctor_bio: 1,
    doctor_awards: 1,
    doctor_availability: 1
  }).lean().sort({ doctor_name: 1 });

  cache.set(cacheKey, doctors, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Doctors fetched successfully',
    data: doctors
  });
});

// Get doctors by location
exports.getDoctorsByLocation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  if (!location) {
    throw new AppError('Location is required', 400);
  }

  const cacheKey = `doctors:location:${location}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Doctors fetched successfully',
      data: cached
    });
  }

  const doctors = await Doctor.find({
    $or: [
      { location: { $in: [location] } },
      { doctor_location: location }
    ]
  }, {
    doctor_name: 1,
    doctor_profile: 1,
    doctor_designation: 1,
    doctor_qualification: 1,
    doctor_experience: 1,
    doctor_location: 1,
    location: 1
  }).lean().sort({ doctor_name: 1 });

  cache.set(cacheKey, doctors, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Doctors fetched successfully',
    data: doctors
  });
});

// Get doctors by designation
exports.getDoctorsByDesignation = asyncHandler(async (req, res) => {
  const { designation } = req.query;

  if (!designation) {
    throw new AppError('Designation is required', 400);
  }

  const cacheKey = `doctors:designation:${designation}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Doctors fetched successfully',
      data: cached
    });
  }

  const doctors = await Doctor.find({
    doctor_designation: { $regex: designation, $options: 'i' }
  }, {
    doctor_name: 1,
    doctor_profile: 1,
    doctor_designation: 1,
    doctor_qualification: 1,
    doctor_experience: 1,
    doctor_location: 1,
    location: 1
  }).lean().sort({ doctor_name: 1 });

  cache.set(cacheKey, doctors, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Doctors fetched successfully',
    data: doctors
  });
});

// Update doctor
exports.updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    throw new AppError('Doctor ID is required', 400);
  }

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  // Invalidate cache
  cache.delete('doctors:list');
  cache.delete(`doctors:location:${doctor.location}`);
  cache.delete(`doctors:designation:${doctor.doctor_designation}`);

  res.json({
    status: 'success',
    message: 'Doctor updated successfully',
    data: doctor
  });
});

// Delete doctor
exports.deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Doctor ID is required', 400);
  }

  const doctor = await Doctor.findByIdAndDelete(id);

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  // Invalidate cache
  cache.delete('doctors:list');

  res.json({
    status: 'success',
    message: 'Doctor deleted successfully'
  });
});