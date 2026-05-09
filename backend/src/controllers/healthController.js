const systemService = require('../services/systemService');

async function getHealth(req, res) {
  const health = await systemService.getHealth();
  res.json({
    success: true,
    data: health
  });
}

module.exports = { getHealth };
