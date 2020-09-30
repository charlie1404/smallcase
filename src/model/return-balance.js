const mongoose = require('mongoose');

const generateRandomId = require('../utils/id-gen');

const BalanceSchema = new mongoose.Schema({
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
  availableBal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Balance', BalanceSchema);
