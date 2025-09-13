const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Doctor routes
router.post('/doctor_details', doctorController.createDoctor);
router.get('/getdoctordetails', doctorController.getDoctorDetails);
router.get('/getdoctorsbylocation', doctorController.getDoctorsByLocation);
router.get('/getdoctorsbydesignation', doctorController.getDoctorsByDesignation);
router.put('/updatedoctor/:id', doctorController.updateDoctor);
router.delete('/deletedoctor/:id', doctorController.deleteDoctor);

module.exports = router;