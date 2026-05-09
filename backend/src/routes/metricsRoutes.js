const express = require('express');
const { getMetrics } = require('../controllers/metricsController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getMetrics));

module.exports = router;
