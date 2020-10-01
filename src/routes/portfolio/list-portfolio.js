const httpStatus = require('http-status');

const Portfolio = require('../../model/portfolio');

async function fetchPortfolio(req, res, _next) {
  // As we are already saving aggregated records, simply find on the basis of user and return
  const data = await Portfolio.find({ userid: res.locals.user.username }, '-_id -__v -userid');

  res.status(httpStatus.OK).json(data);
}

module.exports = fetchPortfolio;
