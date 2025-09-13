const FixedSurgicalPackage = require('../Models/fixed_surgical_packages');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');
const { cache, DEFAULT_TTL_MS } = require('../utils/cache');

exports.createFixedSurgicalPackage = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body || !body.package_title) {
    throw new AppError('package_title is required', 400);
  }
  const newsurgical = new FixedSurgicalPackage(body);
  const savedsurgicalPackage = await newsurgical.save();
  // Invalidate cache on create
  cache.delete('fixedsurgicalpackages:list');
  res.json({
    message: 'Fixed Surgical Packages details Updated successfully',
    data: savedsurgicalPackage
  });
});

exports.getFixedSurgicalPackages = asyncHandler(async (req, res) => {
  const cacheKey = 'fixedsurgicalpackages:list';
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({
      message: 'Fixed Surgical Packages details fetched successfully',
      data: cached
    });
  }

  // Use lean() for better performance and only select needed fields
  const surgicalpackage = await FixedSurgicalPackage.find({}, {
    package_title: 1,
    package_short_desc: 1,
    price: 1,
    img: 1,
    desc: 1
  }).lean().sort({ package_title: 1 }); // Sort for consistent results
  
  cache.set(cacheKey, surgicalpackage, DEFAULT_TTL_MS);
  res.json({
    message: 'Fixed Surgical Packages details fetched successfully',
    data: surgicalpackage
  });
});


