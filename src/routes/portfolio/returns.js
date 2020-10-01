const httpStatus = require('http-status');

const { getLastPrice } = require('../../services/nse-india');
const Portfolio = require('../../model/portfolio');
const Returns = require('../../model/return-balance');

async function fetchPortfolio(req, res, _next) {
  /*
    why returns to be aggregated
    this is a tradeoff,
    when we remove or delete a old trade, we need to recompute portfolio and returns,
    now one ways is to compute for all securites or only for updated security,
    here latter one.
  */
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

  /*
    was not sure by notion of returns,
    if it were to be shown only of in portfolio ones or all,
    so keeping previous returns (after sell) and showing along side,
    if not needed this could simplyfy lot things at other places as well.
  */
  res
    .status(httpStatus.OK)
    .json({ oldSellReturns: returns.availableBal, cumulativePortfolioReturn: sum });
}

module.exports = fetchPortfolio;
