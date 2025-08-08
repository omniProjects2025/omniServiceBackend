const express = require('express');
const doctorprofileRoute = express.Router();
const Doctor = require('../Models/doctors_data');


doctorprofileRoute.post("/doctor_details", async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.json({
      message: "Doctor details added successfully",
      data: savedDoctor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});

doctorprofileRoute.get("/getdoctordetails", async (req, res) => {
    console.log(res,'res');
  try {
    const doctors = await Doctor.find({}, {
  doctor_name: 1,
  doctor_profile: 1,
  doctor_designation: 1,
  doctor_qualification: 1,
  doctor_experience: 1,
  doctor_location: 1,
  location: 1,
  _id: 0
});
    res.json({
      message: "All doctor details fetched successfully",
      data: doctors
    });
    console.log(res['data'],'data...')
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});

// doctorprofileRoute.get("/getdoctordetails", async (req, res) => {
//   const start = Date.now();

//   // Default values: page 1, 10 doctors per page
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   try {
//     // const doctors = await Doctor.find({ _id: { $gt: lastId } }).limit(limit);
//     const doctors = await Doctor.find().skip(skip).limit(limit).lean();
//     console.timeEnd("fetchDoctors");
//     console.timeEnd("fetchDoctors");

//     console.time("countDocs");
//     const totalDocs = await Doctor.countDocuments();
//     console.timeEnd("countDocs");
//     const duration = Date.now() - start;

//     res.json({
//       message: "Doctor details fetched successfully",
//       duration: `${duration}ms`,
//       currentPage: page,
//       totalPages: Math.ceil(totalDocs / limit),
//       data: doctors
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: err.message
//     });
//   }
// });



module.exports = doctorprofileRoute;