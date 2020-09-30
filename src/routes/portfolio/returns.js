const httpStatus = require('http-status');

const { getLastPrice } = require('../../services/nse-india');
const Portfolio = require('../../model/portfolio');
const Returns = require('../../model/return-balance');

async function fetchPortfolio(req, res, _next) {
  const [[returns], portfolio] = await Promise.all([
    Returns.aggregate([
      { $match: { userid: res.locals.user.username } },
      { $group: { _id: null, availableBal: { $sum: '$availableBal' } } },
    ]),
    Portfolio.find({ userid: res.locals.user.username }, '-_id -__v -userid'),
  ]);

  const portfolioWithCurrentPrices = await Promise.all(
    portfolio.map(async (security) => {
      const currentPrice = await getLastPrice(security.tickerSymbol);
      return { ...security._doc, currentPrice };
    }),
  );

  let sum = 0;

  for (const security of portfolioWithCurrentPrices) {
    sum += (security.currentPrice - security.avgBuyPrice) * security.availableQuantity;
  }

  res
    .status(httpStatus.OK)
    .json({ oldSellReturns: returns.availableBal, cumulativePortfolioReturn: sum });
}

module.exports = fetchPortfolio;
