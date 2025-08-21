const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');

router.post('/speciality_details', specialtyController.createDefaultSpecialty);
router.get('/getspecialty', specialtyController.getSpecialties);

module.exports = router;


