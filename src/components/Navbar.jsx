import { Bell, Menu, Search, Server } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-950/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="h-10 w-full max-w-xl rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:bg-white/[0.07]"
            placeholder="Search services, containers, commits..."
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 sm:flex">
            <Server className="h-4 w-4 text-cyan-300" />
            <span>Production</span>
          </div>
          <button className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:border-cyan-300/30 hover:text-white" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
