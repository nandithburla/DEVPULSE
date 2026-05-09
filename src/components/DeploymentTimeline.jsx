import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

const icons = {
  success: CheckCircle2,
  failed: XCircle,
  rollback: RotateCcw
};

const colors = {
  success: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
  failed: 'text-rose-300 bg-rose-400/10 border-rose-400/25',
  rollback: 'text-violet-300 bg-violet-400/10 border-violet-400/25'
};

export default function DeploymentTimeline({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = icons[item.status] || CheckCircle2;
        return (
          <article key={item.id} className="relative grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto]">
            <div className={`flex h-11 w-11 items-center justify-center rounded-md border ${colors[item.status]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-white">{item.service}</h3>
                <StatusBadge status={item.status} />
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">{item.environment}</span>
              </div>
              <p className="mt-2 truncate text-sm text-slate-300">{item.commit}</p>
              <p className="mt-2 text-xs text-slate-500">
                {item.branch} / {item.sha} by {item.actor}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-white">{item.startedAt}</p>
              <p className="mt-1 text-xs text-slate-500">{item.duration}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
