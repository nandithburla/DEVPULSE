import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { ErrorPanel, LoadingPanel } from '../components/ApiState.jsx';
import ChartCard from '../components/ChartCard.jsx';
import MetricCard from '../components/MetricCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { chartGrid, chartText, tooltipStyle } from '../charts/chartTheme.js';
import { usePolling } from '../hooks/usePolling.js';
import { getMetrics } from '../services/api.js';

const emptyDeploymentActivity = [
  { day: 'Mon', success: 0, failed: 0, rollback: 0 },
  { day: 'Tue', success: 0, failed: 0, rollback: 0 },
  { day: 'Wed', success: 0, failed: 0, rollback: 0 },
  { day: 'Thu', success: 0, failed: 0, rollback: 0 },
  { day: 'Fri', success: 0, failed: 0, rollback: 0 },
  { day: 'Sat', success: 0, failed: 0, rollback: 0 },
  { day: 'Sun', success: 0, failed: 0, rollback: 0 }
];

function percentageStatus(value) {
  if (value >= 90) return 'warning';
  if (value >= 75) return 'normal';
  return 'healthy';
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Dashboard() {
  const { data, error, loading, lastUpdated, refetch } = usePolling(getMetrics, { interval: 5000 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!data?.timestamp) return;

    setHistory((current) => {
      const point = {
        time: formatTime(data.timestamp),
        cpu: data.cpu?.usagePercent || 0,
        user: data.cpu?.userPercent || 0,
        system: data.cpu?.systemPercent || 0,
        ramUsed: data.ram?.usedPercent || 0,
        ramCached: data.ram?.totalGb ? Number(((data.ram.cachedGb / data.ram.totalGb) * 100).toFixed(2)) : 0
      };

      return [...current.slice(-11), point];
    });
  }, [data]);

  const dashboardMetrics = useMemo(() => {
    if (!data) return [];

    const storage = data.storage?.primary;

    return [
      {
        label: 'CPU Usage',
        value: `${data.cpu.usagePercent}%`,
        delta: `${data.cpu.cores} cores`,
        trend: 'up',
        status: percentageStatus(data.cpu.usagePercent),
        caption: data.cpu.brand || 'Live processor load'
      },
      {
        label: 'RAM Usage',
        value: `${data.ram.usedPercent}%`,
        delta: `${data.ram.availableGb} GB free`,
        trend: 'down',
        status: percentageStatus(data.ram.usedPercent),
        caption: `${data.ram.usedGb} GB / ${data.ram.totalGb} GB used`
      },
      {
        label: 'Storage',
        value: storage ? `${storage.usedPercent}%` : 'N/A',
        delta: storage ? `${storage.availableGb} GB free` : 'No disk',
        trend: 'down',
        status: storage ? percentageStatus(storage.usedPercent) : 'warning',
        caption: storage ? `${storage.mount} primary volume` : 'No storage data returned'
      },
      {
        label: 'Server Uptime',
        value: data.health.uptime.formatted,
        delta: 'live',
        trend: 'up',
        status: 'healthy',
        caption: data.health.host.hostname
      }
    ];
  }, [data]);

  const liveStatuses = useMemo(() => {
    if (!data) return [];

    return [
      { label: 'API Backend', state: data.health.status === 'ok' ? 'operational' : 'degraded' },
      { label: 'CPU Load', state: percentageStatus(data.cpu.usagePercent) === 'warning' ? 'degraded' : 'operational' },
      { label: 'Memory Pressure', state: percentageStatus(data.ram.usedPercent) === 'warning' ? 'degraded' : 'operational' },
      { label: 'Network Interfaces', state: data.network?.length ? 'operational' : 'degraded' }
    ];
  }, [data]);

  const uptimeStats = useMemo(() => {
    if (!data) return [];

    return [
      { name: 'DEVPULSE API', uptime: data.health.uptime.formatted, latency: 'live', status: 'healthy' },
      { name: data.health.host.hostname, uptime: data.health.host.platform, latency: data.health.host.release, status: 'healthy' },
      { name: 'CPU Service', uptime: `${data.cpu.cores} cores`, latency: `${data.cpu.usagePercent}%`, status: percentageStatus(data.cpu.usagePercent) },
      { name: 'Memory Service', uptime: `${data.ram.availableGb} GB free`, latency: `${data.ram.usedPercent}%`, status: percentageStatus(data.ram.usedPercent) }
    ];
  }, [data]);

  const cpuSeries = history.length ? history : [{ time: 'waiting', cpu: 0, user: 0, system: 0 }];
  const ramSeries = history.length ? history : [{ time: 'waiting', ramUsed: 0, ramCached: 0 }];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">Live operations</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Infrastructure Overview</h1>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
          {lastUpdated ? `Live data updated ${lastUpdated.toLocaleTimeString()}` : 'Connecting to backend'}
        </div>
      </div>

      {loading && !data ? <LoadingPanel label="Loading live system metrics..." /> : null}
      {error ? <ErrorPanel message={error.message} onRetry={refetch} /> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="CPU Utilization" subtitle="Service-level compute load across the production cluster">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cpuSeries}>
                <CartesianGrid stroke={chartGrid} vertical={false} />
                <XAxis dataKey="time" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="cpu" stroke="#22d3ee" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="user" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="system" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="RAM Pressure" subtitle="Used memory plus cache allocation">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ramSeries}>
                <CartesianGrid stroke={chartGrid} vertical={false} />
                <XAxis dataKey="time" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="ramUsed" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ramCached" stroke="#818cf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Deployment Activity" subtitle="Daily GitHub Actions outcomes">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emptyDeploymentActivity}>
                <CartesianGrid stroke={chartGrid} vertical={false} />
                <XAxis dataKey="day" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="success" stackId="a" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rollback" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Live Status" subtitle="External dependencies and platform services">
          <div className="space-y-3">
            {liveStatuses.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
                <span className="text-sm text-slate-200">{item.label}</span>
                <StatusBadge status={item.state} />
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard title="Recent Deployments" subtitle="No live deployment endpoint connected yet">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-slate-300">Deployment data is not mocked on this screen anymore.</p>
            <p className="mt-2 text-sm text-slate-500">Add a backend deployment endpoint later to populate GitHub Actions history here.</p>
          </div>
        </ChartCard>

        <ChartCard title="Server Uptime" subtitle="SLO performance this month">
          <div className="space-y-3">
            {uptimeStats.map((item) => (
              <div key={item.name} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{item.name}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-400">
                  <span>{item.uptime}</span>
                  <span>{item.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
