const httpStatus = require('http-status');

const Trades = require('../../model/trades');

async function fetchTrades(req, res, _next) {
  // simple aggregated view of trades on the basis of ticker symbol
  const data = await Trades.aggregate([
    {
      $match: {
        userid: res.locals.user.username,
      },
    },
    {
      $group: {
        _id: '$tickerSymbol',
        obj: {
          $push: {
            tradeType: '$tradeType',
            quantity: '$quantity',
            txAmount: '$txAmount',
            createdAt: '$createdAt',
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $let: {
            vars: { obj: { ticker: '$_id', trades: '$obj' } },
            in: { $mergeObjects: '$$obj' },
          },
        },
      },
    },
  ]);

  res.status(httpStatus.OK).json(data);
}

module.exports = fetchTrades;
