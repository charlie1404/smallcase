/* eslint-disable no-console */

require('dotenv').config('../.env');

const mongoose = require('mongoose');

const config = require('../src/config');
const app = require('../src/app');

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
});

mongoose.connection.on('error', () => {
  console.log('Cannot connect to database.');
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('Connection established with database.');

  const server = app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
    process.send('ready');
  });

  server.on('error', (error) => {
    console.error('http server Error', error);
    process.exit(1);
  });
});
