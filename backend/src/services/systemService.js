const os = require('os');
const si = require('systeminformation');

function round(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function bytesToGb(bytes) {
  return round(bytes / 1024 / 1024 / 1024);
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

async function getCpuUsage() {
  const [load, cpu] = await Promise.all([si.currentLoad(), si.cpu()]);

  return {
    usagePercent: round(load.currentLoad),
    userPercent: round(load.currentLoadUser),
    systemPercent: round(load.currentLoadSystem),
    cores: cpu.cores,
    physicalCores: cpu.physicalCores,
    manufacturer: cpu.manufacturer,
    brand: cpu.brand,
    speedGhz: cpu.speed
  };
}

async function getRamUsage() {
  const memory = await si.mem();
  const usedPercent = (memory.used / memory.total) * 100;

  return {
    totalGb: bytesToGb(memory.total),
    usedGb: bytesToGb(memory.used),
    freeGb: bytesToGb(memory.free),
    availableGb: bytesToGb(memory.available),
    usedPercent: round(usedPercent),
    activeGb: bytesToGb(memory.active),
    cachedGb: bytesToGb(memory.cached)
  };
}

async function getStorageUsage() {
  const disks = await si.fsSize();
  const primaryDisk = disks[0] || null;

  return {
    disks: disks.map((disk) => ({
      filesystem: disk.fs,
      mount: disk.mount,
      type: disk.type,
      sizeGb: bytesToGb(disk.size),
      usedGb: bytesToGb(disk.used),
      availableGb: bytesToGb(disk.available),
      usedPercent: round(disk.use)
    })),
    primary: primaryDisk
      ? {
          filesystem: primaryDisk.fs,
          mount: primaryDisk.mount,
          sizeGb: bytesToGb(primaryDisk.size),
          usedGb: bytesToGb(primaryDisk.used),
          availableGb: bytesToGb(primaryDisk.available),
          usedPercent: round(primaryDisk.use)
        }
      : null
  };
}

async function getNetworkUsage() {
  const interfaces = await si.networkStats();

  return interfaces.map((item) => ({
    interface: item.iface,
    rxBytes: item.rx_bytes,
    txBytes: item.tx_bytes,
    rxMb: round(item.rx_bytes / 1024 / 1024),
    txMb: round(item.tx_bytes / 1024 / 1024),
    rxSecKb: round(item.rx_sec / 1024),
    txSecKb: round(item.tx_sec / 1024),
    operational: item.operstate
  }));
}

async function getHealth() {
  const uptimeSeconds = os.uptime();

  return {
    status: 'ok',
    service: 'devpulse-api',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds)
    },
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      arch: os.arch()
    }
  };
}

async function getMetrics() {
  const [health, cpu, ram, storage, network] = await Promise.all([
    getHealth(),
    getCpuUsage(),
    getRamUsage(),
    getStorageUsage(),
    getNetworkUsage()
  ]);

  return {
    timestamp: new Date().toISOString(),
    health,
    cpu,
    ram,
    storage,
    network
  };
}

module.exports = {
  getHealth,
  getMetrics,
  getCpuUsage,
  getRamUsage
};
