module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      details: error.details.map(d => ({ message: d.message, path: d.path }))
    });
  }
  next();
};


