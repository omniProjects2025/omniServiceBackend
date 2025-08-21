const express = require('express');
const router = express.Router();
const healthPackagesController = require('../controllers/healthPackagesController');
const validate = require('../middlewares/validate');
const { createHealthPackageSchema } = require('../validators/healthPackage.schema');

router.post('/updatehealthpackages', validate(createHealthPackageSchema), healthPackagesController.createHealthPackage);
router.get('/gethealthpackages', healthPackagesController.getHealthPackages);

module.exports = router;


