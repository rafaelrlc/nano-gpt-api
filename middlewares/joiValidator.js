const joi = require("joi");

const validator = (joiSchema) => (req, res, next) => {
  console.log(req.body);
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(406).send({ message: error });
  else next();
};

module.exports = validator;
