const httpStatus = require('http-status');

const { getLastPrice } = require('../../services/nse-india');
const Trades = require('../../model/trades');
const Portfolios = require('../../model/portfolio');
const APIError = require('../../utils/api-error');
const Balance = require('../../model/return-balance');

async function sellTrade(req, res, _next) {
  let price = null;
  try {
    price = await getLastPrice(req.body.symbol);
  } catch {
    // there are many errors possible like network call failure, but for now only assuming
    // compnay name is not valid
    throw new APIError('Invalid company name', httpStatus.BAD_REQUEST, true);
  }

  const data = await Portfolios.findOne({
    userid: res.locals.user.username,
    tickerSymbol: req.body.symbol,
  });

  if (!data || data.availableQuantity < req.body.quantity) {
    throw new APIError('Not sufficient stocks', httpStatus.PRECONDITION_FAILED, true);
  }

  const trade = new Trades({
    userid: res.locals.user.username,
    tradeType: 'sell',
    tickerSymbol: req.body.symbol,
    txAmount: price,
    quantity: req.body.quantity,
  });
  await trade.save();

  // Idealy updating portfolio and balance should not be part of api but rather a async job
  // may by listening to change data capture stream or either adding task in in queue
  await Portfolios.updateOne(
    { userid: res.locals.user.username, tickerSymbol: req.body.symbol },
    { availableQuantity: data.availableQuantity - req.body.quantity },
  );
  const returnFromTrade = (price - data.avgBuyPrice) * req.body.quantity;
  const balance = await Balance.findOne({ userid: res.locals.user.username });
  await Balance.updateOne(
    { userid: res.locals.user.username, tickerSymbol: req.body.symbol },
    { availableBal: (balance?.availableBal || 0) + returnFromTrade },
    { upsert: true },
  );

  res.status(httpStatus.CREATED).json({ txId: trade._id, price });
}

module.exports = sellTrade;
