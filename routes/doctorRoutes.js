const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/doctor_details', doctorController.createDoctor);
router.get('/getdoctordetails', doctorController.getDoctorDetails);

module.exports = router;


