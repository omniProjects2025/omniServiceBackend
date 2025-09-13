const express = require('express');
const doctorsprofileRoute = express.Router();
const Doctor = require('../Models/doctors_new');


doctorsprofileRoute.post("/updatedoctordetails", async (req, res) => {
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

doctorsprofileRoute.get("/getdoctors", async (req, res) => {
    console.log(res, 'res');
    try {
        const doctors = await Doctor.find({}, { doctors: 1, _id: 0 });

        res.json({
            message: "All doctor details fetched successfully",
            data: doctors
        });
        console.log(res['data'], 'data...')
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});



module.exports = doctorsprofileRoute;