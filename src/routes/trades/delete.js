const httpStatus = require('http-status');

const APIError = require('../../utils/api-error');
const Trades = require('../../model/trades');
const Portfolios = require('../../model/portfolio');
const Balance = require('../../model/return-balance');
const generatePortfolioAndReturnFromTrades = require('./helpers/generate-portfolio-return');

async function deleteTrade(req, res, _next) {
  const toDeleteTrade = await Trades.findById({ _id: req.body.txId });

  if (!toDeleteTrade) {
    throw new APIError('Entity does not exist', httpStatus.PRECONDITION_FAILED, true);
  }

  const trades = await Trades.find({
    userid: res.locals.user.username,
    tickerSymbol: toDeleteTrade.tickerSymbol,
  });

  const newTrades = trades.filter((trade) => trade._id !== req.body.txId).map((e) => e.toObject());

  let portfolio = null;
  let returns = null;

  try {
    ({ portfolio, returns } = generatePortfolioAndReturnFromTrades(newTrades));
  } catch {
    // there can be other validations here but for now assuming tradeEvents are not valid
    throw new APIError('Deleting this trade is causing conflicts', httpStatus.CONFLICT, true);
  }

  await Promise.all([
    Trades.deleteOne({ _id: req.body.txId }),
    Balance.updateOne(
      { userid: res.locals.user.username, tickerSymbol: toDeleteTrade.tickerSymbol },
      { availableBal: returns },
      { upsert: true },
    ),
    Portfolios.updateOne(
      { userid: res.locals.user.username, tickerSymbol: toDeleteTrade.tickerSymbol },
      portfolio,
      { upsert: true },
    ),
  ]);

  res.status(httpStatus.ACCEPTED).json({});
}

module.exports = deleteTrade;
