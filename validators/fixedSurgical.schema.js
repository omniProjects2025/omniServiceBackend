const Joi = require('joi');

exports.createFixedSurgicalSchema = Joi.object({
  id: Joi.number().optional(),
  package_title: Joi.string().min(3).required(),
  package_short_desc: Joi.string().allow('', null),
  price: Joi.number().min(0).optional(),
  desc: Joi.string().allow('', null),
  img: Joi.string().uri().allow('', null),
  package_includes: Joi.array().items(Joi.string()).optional(),
  faqs: Joi.array().items(Joi.object()).optional()
});


