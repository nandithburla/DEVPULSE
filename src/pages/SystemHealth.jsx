import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { ErrorPanel, LoadingPanel } from '../components/ApiState.jsx';
import ChartCard from '../components/ChartCard.jsx';
import HealthGauge from '../components/HealthGauge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { chartGrid, chartText, tooltipStyle } from '../charts/chartTheme.js';
import { usePolling } from '../hooks/usePolling.js';
import { getMetrics } from '../services/api.js';

function percentageStatus(value) {
  if (value >= 90) return 'warning';
  if (value >= 75) return 'normal';
  return 'healthy';
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SystemHealth() {
  const { data, error, loading, lastUpdated, refetch } = usePolling(getMetrics, { interval: 5000 });
  const [networkHistory, setNetworkHistory] = useState([]);

  useEffect(() => {
    if (!data?.timestamp) return;

    const totals = (data.network || []).reduce(
      (acc, item) => ({
        ingress: acc.ingress + Math.max(item.rxSecKb || 0, 0),
        egress: acc.egress + Math.max(item.txSecKb || 0, 0)
      }),
      { ingress: 0, egress: 0 }
    );

    setNetworkHistory((current) => [
      ...current.slice(-11),
      {
        time: formatTime(data.timestamp),
        ingress: Number((totals.ingress / 1024).toFixed(2)),
        egress: Number((totals.egress / 1024).toFixed(2))
      }
    ]);
  }, [data]);

  const storage = data?.storage?.primary;
  const healthGauges = useMemo(() => {
    if (!data) return [];

    return [
      { label: 'CPU Usage', value: Math.round(data.cpu.usagePercent), color: '#22d3ee', detail: `${data.cpu.cores} cores active` },
      { label: 'RAM Usage', value: Math.round(data.ram.usedPercent), color: '#38bdf8', detail: `${data.ram.usedGb} GB / ${data.ram.totalGb} GB` },
      { label: 'Storage', value: Math.round(storage?.usedPercent || 0), color: '#34d399', detail: storage ? `${storage.availableGb} GB available` : 'No storage data' }
    ];
  }, [data, storage]);

  const services = useMemo(() => {
    if (!data) return [];

    return [
      { name: 'DEVPULSE API', replicas: '1/1', status: data.health.status === 'ok' ? 'healthy' : 'warning', latency: 'live' },
      { name: 'CPU Metrics', replicas: `${data.cpu.cores} cores`, status: percentageStatus(data.cpu.usagePercent), latency: `${data.cpu.usagePercent}%` },
      { name: 'RAM Metrics', replicas: `${data.ram.availableGb} GB free`, status: percentageStatus(data.ram.usedPercent), latency: `${data.ram.usedPercent}%` },
      { name: 'Storage Metrics', replicas: storage?.mount || 'N/A', status: percentageStatus(storage?.usedPercent || 0), latency: storage ? `${storage.usedPercent}%` : 'N/A' },
      { name: 'Network Metrics', replicas: `${data.network?.length || 0} interfaces`, status: data.network?.length ? 'healthy' : 'warning', latency: lastUpdated ? lastUpdated.toLocaleTimeString() : 'waiting' }
    ];
  }, [data, lastUpdated, storage]);

  const networkActivity = networkHistory.length ? networkHistory : [{ time: 'waiting', ingress: 0, egress: 0 }];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">Platform condition</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">System Health</h1>
        <p className="mt-2 text-sm text-slate-500">
          {lastUpdated ? `Live health data updated ${lastUpdated.toLocaleTimeString()}` : 'Waiting for backend health data'}
        </p>
      </div>

      {loading && !data ? <LoadingPanel label="Loading live health metrics..." /> : null}
      {error ? <ErrorPanel message={error.message} onRetry={refetch} /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {healthGauges.map((gauge) => <HealthGauge key={gauge.label} {...gauge} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Network Activity" subtitle="Ingress and egress throughput in MB/s">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkActivity}>
                <defs>
                  <linearGradient id="ingress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="egress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGrid} vertical={false} />
                <XAxis dataKey="time" stroke={chartText} tickLine={false} axisLine={false} />
                <YAxis stroke={chartText} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="ingress" stroke="#22d3ee" fill="url(#ingress)" strokeWidth={2} />
                <Area type="monotone" dataKey="egress" stroke="#38bdf8" fill="url(#egress)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Active Services" subtitle="Replica health and service latency">
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{service.name}</span>
                  <StatusBadge status={service.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Replicas</p>
                    <p className="mt-1 text-slate-200">{service.replicas}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Latency</p>
                    <p className="mt-1 text-slate-200">{service.latency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
