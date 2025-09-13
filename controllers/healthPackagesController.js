const Healthpackage = require('../Models/healthpackages');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

exports.createHealthPackage = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body || !body.package_title) {
    throw new AppError('package_title is required', 400);
  }
  const newHealth = new Healthpackage(body);
  const savedHealthPackage = await newHealth.save();
  // Invalidate cache on create
  cache.delete('healthpackages:list');
  res.json({
    message: 'Health Packages details fetched successfully',
    data: savedHealthPackage
  });
});

exports.getHealthPackages = asyncHandler(async (req, res) => {
  const cacheKey = 'healthpackages:list';
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({
      message: 'Health Packages details fetched successfully',
      data: cached
    });
  }

  const healthpackage = await Healthpackage.find({}, {
    package_title: 1,
    oldPrice: 1,
    newPrice: 1,
    image: 1,
    description: 1,
    location: 1,
    discount: 1
  }).lean();
  cache.set(cacheKey, healthpackage, DEFAULT_TTL_MS);
  res.json({
    message: 'Health Packages details fetched successfully',
    data: healthpackage
  });
});


