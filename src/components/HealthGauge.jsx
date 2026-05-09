export default function HealthGauge({ label, value, color, detail }) {
  const safeValue = Math.max(0, Math.min(Number(value) || 0, 100));
  const background = `conic-gradient(${color} ${safeValue * 3.6}deg, rgba(148, 163, 184, 0.14) 0deg)`;

  return (
    <div className="panel panel-hover rounded-lg p-5">
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full" style={{ background }}>
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-surface-950">
          <span className="text-3xl font-semibold text-white">{safeValue}%</span>
          <span className="text-xs text-slate-500">used</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-medium text-white">{label}</h3>
        <p className="mt-1 text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  );
}
