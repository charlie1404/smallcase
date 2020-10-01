const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'portfolio-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.simple(),
      ),
    }),
  ],
});

module.exports = logger;
