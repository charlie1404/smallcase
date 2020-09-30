const Joi = require('joi');
const httpStatus = require('http-status');

const APIError = require('../../../utils/api-error');

const sellParamsSchema = Joi.object({
  symbol: Joi.string()
    .pattern(/^[A-Z]+$/, 'Must be a valid symbol')
    .required(),
  quantity: Joi.number().positive().integer().required(),
}).required();

function validateSellParams(req, res, next) {
  const { value, error } = sellParamsSchema.validate(req.body);
  if (error) {
    throw new APIError('Invalid input params', httpStatus.BAD_REQUEST, true);
  }
  req.body = value;
  next();
}

module.exports = validateSellParams;
