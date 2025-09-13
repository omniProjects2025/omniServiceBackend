const express = require('express');
const router = express.Router();
const healthPackagesController = require('../controllers/healthPackagesController');

// Health packages routes
router.post('/updatehealthpackages', healthPackagesController.createHealthPackage);
router.get('/gethealthpackages', healthPackagesController.getHealthPackages);
router.get('/gethealthpackagesbylocation', healthPackagesController.getHealthPackagesByLocation);
router.get('/gethealthpackagesbyprice', healthPackagesController.getHealthPackagesByPrice);
router.put('/updatehealthpackage/:id', healthPackagesController.updateHealthPackage);
router.delete('/deletehealthpackage/:id', healthPackagesController.deleteHealthPackage);

module.exports = router;