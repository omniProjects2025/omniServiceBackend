const FixedSurgicalPackage = require('../Models/fixed_surgical_packages');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

// Create new surgical package
exports.createFixedSurgicalPackage = asyncHandler(async (req, res) => {
  const packageData = req.body;

  if (!packageData.package_title) {
    throw new AppError('Package title is required', 400);
  }

  const surgicalPackage = new FixedSurgicalPackage(packageData);
  const savedPackage = await surgicalPackage.save();

  // Invalidate cache
  cache.delete('surgicalpackages:list');

  res.status(201).json({
    status: 'success',
    message: 'Surgical package created successfully',
    data: savedPackage
  });
});

// Get all surgical packages
exports.getFixedSurgicalPackages = asyncHandler(async (req, res) => {
  const cacheKey = 'surgicalpackages:list';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Surgical packages fetched successfully',
      data: cached
    });
  }

  const packages = await FixedSurgicalPackage.find({}, {
    package_title: 1,
    package_short_desc: 1,
    price: 1,
    img: 1,
    desc: 1,
    package_includes: 1,
    faqs: 1
  }).lean().sort({ package_title: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Surgical packages fetched successfully',
    data: packages
  });
});

// Get surgical packages by price range
exports.getSurgicalPackagesByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice || !maxPrice) {
    throw new AppError('Min price and max price are required', 400);
  }

  const cacheKey = `surgicalpackages:price:${minPrice}-${maxPrice}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Surgical packages fetched successfully',
      data: cached
    });
  }

  const packages = await FixedSurgicalPackage.find({
    price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) }
  }, {
    package_title: 1,
    package_short_desc: 1,
    price: 1,
    img: 1,
    desc: 1,
    package_includes: 1
  }).lean().sort({ price: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Surgical packages fetched successfully',
    data: packages
  });
});

// Get surgical packages by title search
exports.getSurgicalPackagesByTitle = asyncHandler(async (req, res) => {
  const { title } = req.query;

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const cacheKey = `surgicalpackages:title:${title}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json({
      status: 'success',
      message: 'Surgical packages fetched successfully',
      data: cached
    });
  }

  const packages = await FixedSurgicalPackage.find({
    package_title: { $regex: title, $options: 'i' }
  }, {
    package_title: 1,
    package_short_desc: 1,
    price: 1,
    img: 1,
    desc: 1,
    package_includes: 1
  }).lean().sort({ package_title: 1 });

  cache.set(cacheKey, packages, DEFAULT_TTL_MS);

  res.json({
    status: 'success',
    message: 'Surgical packages fetched successfully',
    data: packages
  });
});

// Update surgical package
exports.updateFixedSurgicalPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    throw new AppError('Package ID is required', 400);
  }

  const package = await FixedSurgicalPackage.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!package) {
    throw new AppError('Surgical package not found', 404);
  }

  // Invalidate cache
  cache.delete('surgicalpackages:list');

  res.json({
    status: 'success',
    message: 'Surgical package updated successfully',
    data: package
  });
});

// Delete surgical package
exports.deleteFixedSurgicalPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Package ID is required', 400);
  }

  const package = await FixedSurgicalPackage.findByIdAndDelete(id);

  if (!package) {
    throw new AppError('Surgical package not found', 404);
  }

  // Invalidate cache
  cache.delete('surgicalpackages:list');

  res.json({
    status: 'success',
    message: 'Surgical package deleted successfully'
  });
});