const styles = {
  healthy: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  running: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  operational: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  normal: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
  warning: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  degraded: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  restarting: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
  failed: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
  exited: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  created: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  paused: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  dead: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
  stopped: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  rollback: 'border-violet-400/25 bg-violet-400/10 text-violet-300'
};

export default function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[normalized] || styles.normal}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace('-', ' ')}
    </span>
  );
}
