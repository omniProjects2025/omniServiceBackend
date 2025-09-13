const Doctor = require('../Models/doctors_data');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

exports.createDoctor = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body || !body.doctor_name) {
    throw new AppError('doctor_name is required', 400);
  }
  const newDoctor = new Doctor(body);
  const savedDoctor = await newDoctor.save();
  // Invalidate cached lists on create
  cache.delete('doctors:list');
  res.json({
    message: 'Doctor details added successfully',
    data: savedDoctor
  });
});

exports.getDoctorDetails = asyncHandler(async (req, res) => {
  const cacheKey = 'doctors:list';
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({
      message: 'All doctor details fetched successfully',
      data: cached
    });
  }

  // Use lean() for better performance and only select needed fields
  const doctors = await Doctor.find({}, {
    doctor_name: 1,
    doctor_profile: 1,
    doctor_designation: 1,
    doctor_qualification: 1,
    doctor_experience: 1,
    doctor_location: 1,
    location: 1,
    _id: 0
  }).lean().sort({ doctor_name: 1 }); // Sort for consistent results

  cache.set(cacheKey, doctors, DEFAULT_TTL_MS);
  res.json({
    message: 'All doctor details fetched successfully',
    data: doctors
  });
});


