import { CheckCircle2, Route } from "lucide-react";

export function RoadmapTimeline({ roadmap }) {
  if (!roadmap?.length) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Route size={14} className="text-brand-300" />
        <span className="section-title">Your roadmap</span>
      </div>

      <ol className="relative space-y-5 before:content-[''] before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-px before:bg-gradient-to-b before:from-brand-400/60 before:via-purple-400/30 before:to-transparent">
        {roadmap.map((phase, i) => (
          <li key={i} className="relative pl-9">
            <div className="absolute left-0 top-0.5 w-[23px] h-[23px] rounded-full bg-gradient-to-br from-brand-500 to-purple-600 ring-4 ring-ink-900 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <span className="text-[10px] font-bold text-white">{i + 1}</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-brand-400/30 hover:bg-white/[0.05] transition">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h5 className="text-sm font-semibold text-white">{phase.focus}</h5>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-300 bg-brand-500/10 ring-1 ring-brand-400/30 rounded-full px-2 py-0.5">
                  {phase.period}
                </span>
              </div>
              {phase.milestones?.length > 0 && (
                <ul className="mt-2.5 space-y-1.5">
                  {phase.milestones.map((m, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                    >
                      <CheckCircle2
                        size={13}
                        className="mt-0.5 text-brand-300 shrink-0"
                      />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
