import { RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ErrorPanel, LoadingPanel } from '../components/ApiState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { getContainers } from '../services/api.js';

function UsageBar({ value, color = 'bg-cyan-300' }) {
  const safeValue = Math.max(0, Math.min(Number(value) || 0, 100));

  return (
    <div className="flex min-w-[7rem] items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${safeValue}%` }} />
      </div>
      <span className="w-12 text-right text-sm text-slate-300">{safeValue.toFixed(1)}%</span>
    </div>
  );
}

function formatPorts(ports) {
  if (!ports?.length) return 'internal';

  return ports
    .map((port) => (port.publicPort ? `${port.publicPort}:${port.privatePort}/${port.type}` : `${port.privatePort}/${port.type}`))
    .join(', ');
}

export default function Containers() {
  const [query, setQuery] = useState('');
  const { data, error, loading, lastUpdated, refetch } = usePolling(getContainers, { interval: 5000 });
  const containers = data?.containers || [];
  const filtered = useMemo(
    () => containers.filter((item) => `${item.name} ${item.image} ${item.status}`.toLowerCase().includes(query.toLowerCase())),
    [containers, query]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">Docker runtime</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Containers</h1>
          <p className="mt-2 text-sm text-slate-500">
            {lastUpdated ? `Live Docker data updated ${lastUpdated.toLocaleTimeString()}` : 'Waiting for Docker API data'}
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
            placeholder="Search containers..."
          />
        </div>
      </div>

      {loading && !data ? <LoadingPanel label="Loading live Docker containers..." /> : null}
      {error ? <ErrorPanel message={error.message} onRetry={refetch} /> : null}
      {data && !data.dockerAvailable ? <ErrorPanel title="Docker unavailable" message={data.error || 'Start Docker Desktop to view live container stats.'} onRetry={refetch} /> : null}

      <section className="panel rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4">Container</th>
                <th className="px-4 py-4">Image</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">CPU</th>
                <th className="px-4 py-4">Memory</th>
                <th className="px-4 py-4">Ports</th>
                <th className="px-4 py-4">Uptime</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((container) => (
                <tr key={container.id} className="hover:bg-white/[0.03]">
                  <td className="table-cell">
                    <div className="font-medium text-white">{container.name}</div>
                    <div className="font-mono text-xs text-slate-500">{container.shortId}</div>
                  </td>
                  <td className="table-cell text-slate-300">{container.image}</td>
                  <td className="table-cell"><StatusBadge status={container.state} /></td>
                  <td className="table-cell"><UsageBar value={container.cpuPercent} /></td>
                  <td className="table-cell"><UsageBar value={container.memory?.usagePercent || 0} color="bg-blue-300" /></td>
                  <td className="table-cell font-mono text-slate-300">{formatPorts(container.ports)}</td>
                  <td className="table-cell text-slate-300">{container.status}</td>
                  <td className="table-cell text-right">
                    <button className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 hover:border-cyan-300/30 hover:text-white">
                      <RotateCcw className="h-4 w-4" />
                      Restart
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-sm text-slate-500">
                    {query ? 'No containers match your search.' : 'No live containers returned.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
