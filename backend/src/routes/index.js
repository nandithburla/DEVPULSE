const express = require('express');
const healthRoutes = require('./healthRoutes');
const metricsRoutes = require('./metricsRoutes');
const containerRoutes = require('./containerRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/metrics', metricsRoutes);
router.use('/containers', containerRoutes);

module.exports = router;
