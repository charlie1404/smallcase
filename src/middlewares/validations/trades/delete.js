const Joi = require('joi');
const httpStatus = require('http-status');
const APIError = require('../../../utils/api-error');

const deleteParamsSchema = Joi.object({ txId: Joi.string().required() }).required();

function validateDeleteParams(req, res, next) {
  const { value, error } = deleteParamsSchema.validate(req.body);
  if (error) {
    throw new APIError('Invalid input params', httpStatus.BAD_REQUEST, true);
  }
  req.body = value;
  next();
}

module.exports = validateDeleteParams;
