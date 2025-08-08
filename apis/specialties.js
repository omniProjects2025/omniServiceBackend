const express = require('express');
const specialtyRouter = express.Router();
const Specialty = require('../Models/Specialty.js');

specialtyRouter.post("/speciality_details", async (req, res) => {
  try {
    const specialties = new Specialty({
      name: 'Cardiology',
      icon: 'assets/our_specialities/Cardio_gray.svg',
      blue_icon: 'assets/our_specialities/Cardio_blue.svg',
      location: ['Kothapet', 'Nampally']
    });

    const newSpecialties = await specialties.save();
    res.json({
      message: "Specialties added successfully",
      data: newSpecialties
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});

specialtyRouter.get("/getspecialty", async (req, res) => {
  try {
    const SpecialtyData = await Specialty.find();
    res.json({
      message: "I have got all specialty",
      SpecialtyData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});

module.exports = specialtyRouter;
