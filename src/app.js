const bodyParser = require('body-parser');
const express = require('express');
const httpStatus = require('http-status');

const config = require('./config');
const logger = require('./config/winston');
const APIError = require('./utils/api-error');
const routes = require('./routes');

const app = express();

app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

// if error is not an instanceOf APIError, convert it. (preserve stack trace)
app.use((err, req, res, next) => {
  logger.error(err.message, err);
  if (!(err instanceof APIError)) {
    const apiError = new APIError(
      err.message || httpStatus['500_MESSAGE'],
      err.status || 500,
      err.isPublic || false,
    );
    apiError.stack = err.stack;
    return next(apiError);
  }
  return next(err);
});

// 404
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// respond on errors
app.use((err, req, res, _next) => {
  if (config.env === 'development') {
    res.set('Content-Type', 'text/html');
    res.status(err.status).send(`<h2>${err.message}</h2><pre>${err.stack}</pre>`);
  } else {
    // Add logger
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
    });
  }
});

module.exports = app;
