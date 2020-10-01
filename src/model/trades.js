const mongoose = require('mongoose');

const generateRandomId = require('../utils/id-gen');

// This model represents trade events,
// these are write only one and read,
// which is why on updating and removing a trade needs recomputaion of portfolio and returns
const TradesSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generateRandomId,
  },
  userid: {
    type: String,
    required: true,
  },
  tradeType: {
    type: String,
    required: true,
  },
  tickerSymbol: {
    type: String,
    required: true,
  },
  txAmount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString(),
  },
});

module.exports = mongoose.model('Trades', TradesSchema);
