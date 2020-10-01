const winston = require('winston');

// FAQ: Why only console logger,
// Ideally logs go to some stream destination for high throughput handling,
// but as of now pm2 runs the application so these accmulate into om2 files which is reasonable for demo.
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
