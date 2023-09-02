const Joi = require("joi");

const queryQuestionValidator = Joi.object({
  question: Joi.string().min(1).max(4096).required(),
  temperature: Joi.number().precision(2).min(0).max(1).required(),
  token: Joi.number().integer().min(100).max(4096).required(),
});

module.exports = { queryQuestionValidator };
