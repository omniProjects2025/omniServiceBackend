const Joi = require('joi');

exports.createDoctorNewSchema = Joi.object({
  location: Joi.string().required(),
  doctors: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      profile: Joi.string().allow('', null),
      designation: Joi.string().allow('', null),
      qualification: Joi.array().items(Joi.string()).optional(),
      experience: Joi.string().allow('', null),
      bio: Joi.array().items(Joi.string()).optional(),
      awards: Joi.array().items(Joi.string()).optional(),
      availability: Joi.string().allow('', null),
      education: Joi.array().items(Joi.string()).optional(),
      area_expertise: Joi.array().items(Joi.string()).optional(),
      fellowships: Joi.array().items(Joi.string()).optional(),
      publications: Joi.string().allow('', null),
      work_location: Joi.string().allow('', null),
      department: Joi.string().allow('', null),
      specialization: Joi.string().allow('', null)
    })
  ).required()
});


