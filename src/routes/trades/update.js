const httpStatus = require('http-status');

const APIError = require('../../utils/api-error');
const Trades = require('../../model/trades');
const Portfolios = require('../../model/portfolio');
const Balance = require('../../model/return-balance');
const generatePortfolioAndReturnFromTrades = require('./helpers/generate-portfolio-return');

async function updateTrade(req, res, _next) {
  const toUpdateTrade = await Trades.findById({ _id: req.body.txId });

  if (!toUpdateTrade) {
    throw new APIError('Entity does not exist', httpStatus.PRECONDITION_FAILED, true);
  }

  const trades = await Trades.find({
    userid: res.locals.user.username,
    tickerSymbol: toUpdateTrade.tickerSymbol,
  });

  const newTrades = trades.map((e) => {
    if (e._id === req.body.txId) {
      return {
        ...e.toObject(),
        ...(req.body.tradeType && { tradeType: req.body.tradeType }),
        ...(req.body.txAmount && { txAmount: req.body.txAmount }),
        ...(req.body.quantity && { quantity: req.body.quantity }),
      };
    }
    return e.toObject();
  });

  let portfolio = null;
  let returns = null;

  try {
    ({ portfolio, returns } = generatePortfolioAndReturnFromTrades(newTrades));
  } catch {
    // there can be other validations here but for now assuming tradeEvents are not valid
    throw new APIError('updating this trade is causing conflicts', httpStatus.CONFLICT, true);
  }

  await Promise.all([
    Trades.updateOne(
      { _id: req.body.txId },
      {
        ...(req.body.tradeType && { tradeType: req.body.tradeType }),
        ...(req.body.txAmount && { txAmount: req.body.txAmount }),
        ...(req.body.quantity && { quantity: req.body.quantity }),
      },
    ),
    Balance.updateOne(
      { userid: res.locals.user.username, tickerSymbol: toUpdateTrade.tickerSymbol },
      { availableBal: returns },
      { upsert: true },
    ),
    Portfolios.updateOne(
      { userid: res.locals.user.username, tickerSymbol: toUpdateTrade.tickerSymbol },
      portfolio,
      { upsert: true },
    ),
  ]);

  res.status(httpStatus.ACCEPTED).json({});
}

module.exports = updateTrade;
