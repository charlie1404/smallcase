// idea is to iterate on updated trades to see if they can generate portfolio and returns,
// if so return then, else throw error and bail out.

function generatePortfolioAndReturnFromTrades(trades) {
  const portfolio = { avgBuyPrice: 0, availableQuantity: 0 };
  let returns = 0;

  trades.sort((a, b) => a.createdAt - b.createdAt);

  for (const trade of trades) {
    switch (trade.tradeType) {
      case 'buy': {
        const updatedStockCount = portfolio.availableQuantity + trade.quantity;
        const updatedAvgBuyPrice =
          (portfolio.avgBuyPrice * portfolio.availableQuantity + trade.txAmount * trade.quantity) /
          updatedStockCount;

        portfolio.availableQuantity = updatedStockCount;
        portfolio.avgBuyPrice = updatedAvgBuyPrice;
        break;
      }
      case 'sell': {
        portfolio.availableQuantity -= trade.quantity;
        returns = (trade.txAmount - portfolio.avgBuyPrice) * trade.quantity;
        break;
      }
      default:
        // invalid trade, should never reach here
        throw new TypeError('Invalid trade type');
    }

    // validation after every trade
    // if availableQuantity is less than zero after any trade,
    // then throw error indicating trade events are not valid
    if (portfolio.availableQuantity < 0) {
      throw new Error('Invalid Trade Events');
    }
  }
  return { portfolio, returns };
}

module.exports = generatePortfolioAndReturnFromTrades;
