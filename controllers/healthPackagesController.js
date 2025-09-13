const HealthPackage = require('../Models/healthpackages');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

// Create new health package
exports.createHealthPackage = asyncHandler(async (req, res) => {
  const packageData = req.body;

  if (!packageData.package_title) {
    throw new AppError('Package title is required', 400);
  }

  const healthPackage = new HealthPackage(packageData);
  const savedPackage = await healthPackage.save();

  // Invalidate cache
  cache.delete('healthpackages:list');

  res.status(201).json({
    status: 'success',
    message: 'Health package created successfully',
    data: savedPackage
  });
});

// Get all health packages
exports.getHealthPackages = asyncHandler(async (req, res) => {
  const cacheKey = 'healthpackages:list';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Health packages fetched successfully',
      data: cached
    });
  }

  const packages = await HealthPackage.find({}, {
    package_title: 1,
    oldPrice: 1,
    newPrice: 1,
    image: 1,
    description: 1,
    location: 1,
    discount: 1,
    package_details: 1,
    faqs: 1
  }).lean().sort({ package_title: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Health packages fetched successfully',
    data: packages
  });
});

// Get health packages by location
exports.getHealthPackagesByLocation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  if (!location) {
    throw new AppError('Location is required', 400);
  }

  const cacheKey = `healthpackages:location:${location}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Health packages fetched successfully',
      data: cached
    });
  }

  const packages = await HealthPackage.find({
    location: { $regex: location, $options: 'i' }
  }, {
    package_title: 1,
    oldPrice: 1,
    newPrice: 1,
    image: 1,
    description: 1,
    location: 1,
    discount: 1,
    package_details: 1
  }).lean().sort({ package_title: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Health packages fetched successfully',
    data: packages
  });
});

// Get health packages by price range
exports.getHealthPackagesByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice || !maxPrice) {
    throw new AppError('Min price and max price are required', 400);
  }

  const cacheKey = `healthpackages:price:${minPrice}-${maxPrice}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Health packages fetched successfully',
      data: cached
    });
  }

  const packages = await HealthPackage.find({
    newPrice: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }
  }, {
    package_title: 1,
    oldPrice: 1,
    newPrice: 1,
    image: 1,
    description: 1,
    location: 1,
    discount: 1,
    package_details: 1
  }).lean().sort({ newPrice: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Health packages fetched successfully',
    data: packages
  });
});

// Update health package
exports.updateHealthPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    throw new AppError('Package ID is required', 400);
  }

  const package = await HealthPackage.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!package) {
    throw new AppError('Health package not found', 404);
  }

  // Invalidate cache
  cache.delete('healthpackages:list');
  cache.delete(`healthpackages:location:${package.location}`);

  res.json({
    status: 'success',
    message: 'Health package updated successfully',
    data: package
  });
});

// Delete health package
exports.deleteHealthPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Package ID is required', 400);
  }

  const package = await HealthPackage.findByIdAndDelete(id);

  if (!package) {
    throw new AppError('Health package not found', 404);
  }

  // Invalidate cache
  cache.delete('healthpackages:list');

  res.json({
    status: 'success',
    message: 'Health package deleted successfully'
  });
});