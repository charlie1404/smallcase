const httpStatus = require('http-status');

const { getLastPrice } = require('../../services/nse-india');
const Trades = require('../../model/trades');
const Portfolios = require('../../model/portfolio');
const APIError = require('../../utils/api-error');

async function buyTrade(req, res, _next) {
  let price = null;
  try {
    price = await getLastPrice(req.body.symbol);
  } catch {
    // there are many errors possible like network call failure, but for now only assuming
    // compnay name is not valid
    throw new APIError('Invalid company name', httpStatus.BAD_REQUEST, true);
  }

  const trade = new Trades({
    userid: res.locals.user.username,
    tradeType: 'buy',
    tickerSymbol: req.body.symbol,
    txAmount: price,
    quantity: req.body.quantity,
  });
  await trade.save();

  // Idealy updating portfolio should not be part of api but rather a async job
  // may by listening to change data capture stream or either adding task in in queue
  let data = await Portfolios.findOne({
    userid: res.locals.user.username,
    tickerSymbol: req.body.symbol,
  });
  if (!data) {
    data = { availableQuantity: 0, avgBuyPrice: 0 };
  }

  const updatedStockCount = data.availableQuantity + req.body.quantity;
  const updatedAvgBuyPrice =
    (data.avgBuyPrice * data.availableQuantity + price * req.body.quantity) / updatedStockCount;
  await Portfolios.updateOne(
    { userid: res.locals.user.username, tickerSymbol: req.body.symbol },
    { avgBuyPrice: updatedAvgBuyPrice, availableQuantity: updatedStockCount },
    { upsert: true },
  );

  res.status(httpStatus.CREATED).json({ txId: trade._id, price });
}

module.exports = buyTrade;
