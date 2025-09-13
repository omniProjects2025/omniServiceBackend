const express = require('express');
const healthpackagesdetailsRoute = express.Router();
const Healthpackage = require('../Models/healthpackages');

healthpackagesdetailsRoute.post("/updatehealthpackages", async (req, res) => {
    try {
        const newHealth = new Healthpackage(req.body);
        const savedHealthPackage = await newHealth.save();
        res.json({
            message: "Health Packages details fetched successfully",
            data: savedHealthPackage
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

healthpackagesdetailsRoute.get("/gethealthpackages", async (req, res) => {
    console.log(res, 'res');
    try {
        const healthpackage = await Healthpackage.find();
        res.json({
            message: "Health Packages details fetched successfully",
            data: healthpackage
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

module.exports = healthpackagesdetailsRoute;