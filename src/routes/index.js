const router = require('express').Router();

const tradeRoutes = require('./trades');
const portfolioRoutes = require('./portfolio');

router.use('/trades', tradeRoutes);
router.use('/portfolio', portfolioRoutes);

module.exports = router;
