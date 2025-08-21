const express = require('express');
const router = express.Router();
const doctorsNewController = require('../controllers/doctorsNewController');
const validate = require('../middlewares/validate');
const { createDoctorNewSchema } = require('../validators/doctorNew.schema');

router.post('/updatedoctordetails', validate(createDoctorNewSchema), doctorsNewController.createDoctor);
router.get('/getdoctors', doctorsNewController.getDoctors);

module.exports = router;


