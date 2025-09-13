const express = require('express');
const router = express.Router();
const fixedSurgicalPackagesController = require('../controllers/fixedSurgicalPackagesController');

// Surgical packages routes
router.post('/updatefixedsuricalpackages', fixedSurgicalPackagesController.createFixedSurgicalPackage);
router.get('/getfixedsurgicalpackages', fixedSurgicalPackagesController.getFixedSurgicalPackages);
router.get('/getsurgicalpackagesbyprice', fixedSurgicalPackagesController.getSurgicalPackagesByPrice);
router.get('/getsurgicalpackagesbytitle', fixedSurgicalPackagesController.getSurgicalPackagesByTitle);
router.put('/updatesurgicalpackage/:id', fixedSurgicalPackagesController.updateFixedSurgicalPackage);
router.delete('/deletesurgicalpackage/:id', fixedSurgicalPackagesController.deleteFixedSurgicalPackage);

module.exports = router;