const Docker = require('dockerode');

const docker = new Docker(
  process.platform === 'win32'
    ? { socketPath: '//./pipe/docker_engine' }
    : undefined
);

function normalizeName(names) {
  if (!Array.isArray(names) || names.length === 0) {
    return 'unknown';
  }

  return names[0].replace(/^\//, '');
}

function mapPorts(ports) {
  if (!Array.isArray(ports) || ports.length === 0) {
    return [];
  }

  return ports.map((port) => ({
    privatePort: port.PrivatePort,
    publicPort: port.PublicPort || null,
    type: port.Type,
    ip: port.IP || null
  }));
}

function calculateCpuPercent(stats) {
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const cpuCount = stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage?.length || 1;

  if (systemDelta <= 0 || cpuDelta <= 0) {
    return 0;
  }

  return Number(((cpuDelta / systemDelta) * cpuCount * 100).toFixed(2));
}

function calculateMemory(stats) {
  const usage = stats.memory_stats.usage || 0;
  const limit = stats.memory_stats.limit || 0;
  const cache = stats.memory_stats.stats?.cache || 0;
  const adjustedUsage = Math.max(usage - cache, 0);

  return {
    usageBytes: adjustedUsage,
    limitBytes: limit,
    usageMb: Number((adjustedUsage / 1024 / 1024).toFixed(2)),
    limitMb: Number((limit / 1024 / 1024).toFixed(2)),
    usagePercent: limit ? Number(((adjustedUsage / limit) * 100).toFixed(2)) : 0
  };
}

async function getContainerStats(containerId) {
  const container = docker.getContainer(containerId);
  const stats = await container.stats({ stream: false });

  return {
    cpuPercent: calculateCpuPercent(stats),
    memory: calculateMemory(stats)
  };
}

async function getContainers() {
  try {
    const containerList = await docker.listContainers({ all: true });

    const containers = await Promise.all(
      containerList.map(async (container) => {
        const isRunning = container.State === 'running';
        const stats = isRunning
          ? await getContainerStats(container.Id).catch(() => ({ cpuPercent: 0, memory: null }))
          : { cpuPercent: 0, memory: null };

        return {
          id: container.Id,
          shortId: container.Id.slice(0, 12),
          name: normalizeName(container.Names),
          image: container.Image,
          imageId: container.ImageID,
          command: container.Command,
          createdAt: new Date(container.Created * 1000).toISOString(),
          state: container.State,
          status: container.Status,
          ports: mapPorts(container.Ports),
          labels: container.Labels || {},
          cpuPercent: stats.cpuPercent,
          memory: stats.memory
        };
      })
    );

    return {
      dockerAvailable: true,
      count: containers.length,
      containers
    };
  } catch (error) {
    return {
      dockerAvailable: false,
      count: 0,
      containers: [],
      error: 'Docker is not available or the Docker daemon is not running.',
      details: error.message
    };
  }
}

module.exports = { getContainers };
