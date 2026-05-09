const systemService = require('../services/systemService');

async function getMetrics(req, res) {
  const metrics = await systemService.getMetrics();
  res.json({
    success: true,
    data: metrics
  });
}

module.exports = { getMetrics };
