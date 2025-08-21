const Doctor = require('../Models/doctors_new');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

exports.createDoctor = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body || !body.location) {
    throw new AppError('location is required', 400);
  }
  const newDoctor = new Doctor(body);
  const savedDoctor = await newDoctor.save();
  // Invalidate cached aggregated list
  cache.delete('doctorsNew:list');
  res.json({
    message: 'Doctor details added successfully',
    data: savedDoctor
  });
});

exports.getDoctors = asyncHandler(async (req, res) => {
  const cacheKey = 'doctorsNew:list';
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({
      message: 'All doctor details fetched successfully',
      data: cached
    });
  }

  const doctors = await Doctor.find({}, { doctors: 1, _id: 0 }).lean();
  cache.set(cacheKey, doctors, DEFAULT_TTL_MS);
  res.json({
    message: 'All doctor details fetched successfully',
    data: doctors
  });
});


