import { Github, GitCommit, Timer } from 'lucide-react';
import DeploymentTimeline from '../components/DeploymentTimeline.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const deploymentHistory = [];

export default function Deployments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">GitHub Actions</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Deployment History</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 hover:border-cyan-300/30 hover:text-white">
          <Github className="h-4 w-4" />
          View workflow
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-3">
            <GitCommit className="h-5 w-5 text-cyan-300" />
            <span className="text-sm text-slate-400">Latest SHA</span>
          </div>
          <p className="mt-3 font-mono text-2xl text-white">N/A</p>
        </div>
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-cyan-300" />
            <span className="text-sm text-slate-400">Avg build time</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">N/A</p>
        </div>
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Github className="h-5 w-5 text-cyan-300" />
            <span className="text-sm text-slate-400">Build health</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-400">No endpoint</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-lg p-4">
          <h2 className="text-base font-semibold text-white">Build Status</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Commit Message</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {deploymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03]">
                    <td className="table-cell font-medium text-white">{item.service}</td>
                    <td className="table-cell max-w-[22rem] truncate text-slate-300">{item.commit}</td>
                    <td className="table-cell font-mono text-cyan-300">{item.branch}</td>
                    <td className="table-cell"><StatusBadge status={item.status} /></td>
                    <td className="table-cell text-slate-300">{item.duration}</td>
                  </tr>
                ))}
                {deploymentHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                      No live deployment endpoint is connected yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel rounded-lg p-4">
          <h2 className="text-base font-semibold text-white">Deployment Timeline</h2>
          <p className="mt-1 text-sm text-slate-400">Recent pipeline events ordered by start time</p>
          <div className="mt-4">
            {deploymentHistory.length ? (
              <DeploymentTimeline items={deploymentHistory} />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm text-slate-500">
                Add a backend GitHub Actions endpoint to show live deployment history here.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
