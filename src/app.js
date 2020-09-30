require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const util = require('util');

const config = require('./config');
const logger = require('./config/winston');
const APIError = require('./utils/api-error');
const routes = require('./routes');

const app = express();

// handle mongoose odm connect errors in seperate file later
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
});

// Temp, only for debug purposes
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.info(`${collectionName}.${method}`, { query: util.inspect(query, false, 20), doc });
});

app.set('port', config.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
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
    logger.error(err.message, { err });
    res.set('Content-Type', 'text/html');
    res.status(err.status).send(`<h2>${err.message}</h2><pre>${err.stack}</pre>`);
  } else {
    // Add logger
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
    });
  }
});

// eslint-disable-next-line no-console
app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
