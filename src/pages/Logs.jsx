import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import LogsTerminal from '../components/LogsTerminal.jsx';

const logs = [];
const logSources = [];

export default function Logs() {
  const [source, setSource] = useState('all');
  const filteredLogs = useMemo(() => (source === 'all' ? logs : logs.filter((log) => log.source === source)), [source]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">Runtime telemetry</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Logs</h1>
        </div>
        <label className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 sm:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 outline-none sm:w-56"
          >
            <option value="all" className="bg-surface-900">All containers</option>
            {logSources.map((item) => (
              <option key={item} value={item} className="bg-surface-900">{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">
        No live logs endpoint is connected yet. Add a backend logs API to stream real container logs here.
      </div>
      <LogsTerminal logs={filteredLogs} />
    </div>
  );
}
