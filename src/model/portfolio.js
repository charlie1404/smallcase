const mongoose = require('mongoose');

const generateRandomId = require('../utils/id-gen');

// Aggregated view of trades
// As of now these are computed in api only but ideally should be a background/async task,
// and api should return after adding trade only.
const PortfoliosSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generateRandomId,
  },
  userid: {
    type: String,
    required: true,
  },
  tickerSymbol: {
    type: String,
    required: true,
  },
  avgBuyPrice: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Portfolios', PortfoliosSchema);
