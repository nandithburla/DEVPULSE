const levelStyles = {
  info: 'text-cyan-300',
  debug: 'text-slate-400',
  warn: 'text-amber-300',
  error: 'text-rose-300'
};

export default function LogsTerminal({ logs }) {
  return (
    <div className="overflow-hidden rounded-lg border border-cyan-300/15 bg-black/70 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs text-slate-500">live-tail --follow</span>
      </div>
      <div className="h-[34rem] overflow-y-auto p-4 font-mono text-sm leading-7">
        {logs.map((log, index) => (
          <div key={`${log.time}-${index}`} className="grid grid-cols-[4.5rem_4.5rem_minmax(0,1fr)] gap-3 border-b border-white/[0.03] py-1.5">
            <span className="text-slate-500">{log.time}</span>
            <span className={levelStyles[log.level]}>{log.level.toUpperCase()}</span>
            <span className="min-w-0 break-words text-slate-300">
              <span className="text-emerald-300">[{log.source}]</span> {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
