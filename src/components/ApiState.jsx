import { RefreshCcw, WifiOff } from 'lucide-react';

export function LoadingPanel({ label = 'Loading live data...' }) {
  return (
    <div className="panel rounded-lg p-4 text-sm text-slate-400">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
        {label}
      </div>
    </div>
  );
}

export function ErrorPanel({ title = 'Backend unavailable', message, onRetry }) {
  return (
    <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-rose-200/80">{message || 'Start the backend on http://localhost:5000 and retry.'}</p>
          </div>
        </div>
        {onRetry ? (
          <button className="inline-flex items-center gap-2 rounded-md border border-rose-300/20 px-3 py-2 hover:bg-rose-300/10" onClick={onRetry}>
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
