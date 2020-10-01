const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.string().default('4040'),
  MONGO_URL: Joi.string().required().description('Mongo DB host url'),
})
  .unknown()
  .required();

// Validate if all env are present
const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: +envVars.PORT,
  mongoUrl: envVars.MONGO_URL,
};
module.exports = config;
