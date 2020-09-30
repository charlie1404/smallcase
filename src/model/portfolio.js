const mongoose = require('mongoose');

const generateRandomId = require('../utils/id-gen');

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
