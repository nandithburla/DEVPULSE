const dockerService = require('../services/dockerService');

async function getContainers(req, res) {
  const containers = await dockerService.getContainers();
  res.json({
    success: true,
    data: containers
  });
}

module.exports = { getContainers };
