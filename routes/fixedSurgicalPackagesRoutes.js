const express = require('express');
const router = express.Router();
const fixedSurgicalPackagesController = require('../controllers/fixedSurgicalPackagesController');
const validate = require('../middlewares/validate');
const { createFixedSurgicalSchema } = require('../validators/fixedSurgical.schema');

router.post('/updatefixedsuricalpackages', validate(createFixedSurgicalSchema), fixedSurgicalPackagesController.createFixedSurgicalPackage);
router.get('/getfixedsurgicalpackages', fixedSurgicalPackagesController.getFixedSurgicalPackages);

module.exports = router;


