import { Activity, Boxes, Gauge, GitBranch, LayoutDashboard, Terminal, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Containers', to: '/containers', icon: Boxes },
  { label: 'Deployments', to: '/deployments', icon: GitBranch },
  { label: 'Logs', to: '/logs', icon: Terminal },
  { label: 'System Health', to: '/system-health', icon: Gauge }
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-surface-950/95 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
              <Activity className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.22em] text-white">DEVPULSE</span>
              <span className="text-xs text-slate-500">Ops Command Center</span>
            </span>
          </NavLink>
          <button className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-glow'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="m-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Prod Cluster</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
          </div>
          <p className="mt-2 text-xs text-slate-500">us-east-1 / 6 nodes / 128 pods</p>
        </div>
      </aside>
    </>
  );
}
