const router = require('express').Router();

const injectUser = require('../../middlewares/inject-user');
const asyncErrorCapture = require('../../utils/async-error-capture');

const buyTrade = require('./buy');
const sellTrade = require('./sell');
const fetchTrades = require('./list-trades');
const updateTrade = require('./update');
const deleteTrade = require('./delete');

const validateBuyParams = require('../../middlewares/validations/trades/buy');
const validateSellParams = require('../../middlewares/validations/trades/sell');
const validateDeleteParams = require('../../middlewares/validations/trades/delete');
const validateUpdateParams = require('../../middlewares/validations/trades/update');

router.post('/buy', injectUser, validateBuyParams, asyncErrorCapture(buyTrade));
router.post('/sell', injectUser, validateSellParams, asyncErrorCapture(sellTrade));

router.get('/', injectUser, asyncErrorCapture(fetchTrades));
router.post('/', injectUser, validateUpdateParams, asyncErrorCapture(updateTrade));
router.delete('/', injectUser, validateDeleteParams, asyncErrorCapture(deleteTrade));

module.exports = router;
