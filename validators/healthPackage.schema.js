const Joi = require('joi');

exports.createHealthPackageSchema = Joi.object({
  id: Joi.number().optional(),
  package_title: Joi.string().min(3).required(),
  oldPrice: Joi.number().min(0).optional(),
  newPrice: Joi.number().min(0).optional(),
  description: Joi.string().allow('', null),
  image: Joi.string().uri().allow('', null),
  location: Joi.string().allow('', null),
  faqs: Joi.array().items(Joi.any()).optional(),
  package_details: Joi.array().items(Joi.string()).optional(),
  discount: Joi.number().min(0).max(100).optional()
});


