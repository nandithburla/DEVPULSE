import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function MetricCard({ metric }) {
  const isUp = metric.trend === 'up';
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const trendClass = metric.status === 'warning' ? 'text-amber-300' : isUp ? 'text-cyan-300' : 'text-emerald-300';

  return (
    <article className="panel panel-hover rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{metric.label}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-semibold tracking-normal text-white">{metric.value}</span>
            <span className={`mb-1 inline-flex items-center text-sm font-medium ${trendClass}`}>
              <TrendIcon className="h-4 w-4" />
              {metric.delta}
            </span>
          </div>
        </div>
        <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">
          <Activity className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{metric.caption}</p>
    </article>
  );
}
