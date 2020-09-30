const router = require('express').Router();

const injectUser = require('../../middlewares/inject-user');
const asyncErrorCapture = require('../../utils/async-error-capture');

const fetchPortfolio = require('./list-portfolio');
const fetchReturns = require('./returns');

router.get('/', injectUser, asyncErrorCapture(fetchPortfolio));
router.get('/returns', injectUser, asyncErrorCapture(fetchReturns));

module.exports = router;
