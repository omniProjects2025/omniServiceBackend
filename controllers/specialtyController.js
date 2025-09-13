const Specialty = require('../Models/Specialty');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

exports.createDefaultSpecialty = asyncHandler(async (req, res) => {
  const specialties = new Specialty({
    name: 'Cardiology',
    icon: 'assets/our_specialities/Cardio_gray.svg',
    blue_icon: 'assets/our_specialities/Cardio_blue.svg',
    location: ['Kothapet', 'Nampally']
  });

  const newSpecialties = await specialties.save();
  res.json({
    message: 'Specialties added successfully',
    data: newSpecialties
  });
});

exports.getSpecialties = asyncHandler(async (req, res) => {
  const SpecialtyData = await Specialty.find();
  res.json({
    message: 'I have got all specialty',
    SpecialtyData
  });
});


