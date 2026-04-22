import { CalendarDays, Lightbulb, Rocket, Zap } from "lucide-react";
import { motion } from "framer-motion";

const phaseVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] },
  }),
};

export function HorizontalRoadmap({ path }) {
  if (!path?.roadmap?.length) return null;

  return (
    <motion.div
      key={path.title}
      className="card p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <header className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <div className="eyebrow text-slate-500">Path Preview</div>
          <h4 className="display text-[17px] tracking-extra-tight text-white mt-1 leading-tight">
            {path.title}
          </h4>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08] tabular">
          <CalendarDays size={11} />
          {path.roadmap.length}-phase journey
        </span>
      </header>

      <div className="relative overflow-x-auto pb-2 -mx-1 px-1">
        <motion.div
          className="flex gap-4 min-w-max"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {path.roadmap.map((phase, i) => (
            <Phase key={i} phase={phase} index={i} total={path.roadmap.length} />
          ))}
        </motion.div>
      </div>

      {path.two_year_projection && (
        <motion.div
          className="mt-5 pt-4 border-t border-white/[0.06] flex items-start gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(140deg, #6366f1, #7c3aed)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 16px -6px rgba(99,102,241,0.5)",
            }}
          >
            <Rocket size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-brand-300/80 flex items-center gap-1">
              <Zap size={10} /> If you follow this path for 2 years
            </div>
            <p className="text-[13px] text-slate-200 mt-1 leading-relaxed">
              {path.two_year_projection}
            </p>
          </div>
        </motion.div>
      )}

      {path.pro_tips?.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <div className="eyebrow text-slate-500 mb-2.5 flex items-center gap-1">
            <Lightbulb size={10} /> Pro tips to succeed in this path
          </div>
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {path.pro_tips.slice(0, 4).map((tip, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 4 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
                className="flex items-start gap-2 rounded-lg p-2.5 bg-white/[0.025] border border-white/[0.06]"
              >
                <span className="mt-0.5 w-5 h-5 rounded flex items-center justify-center bg-amber-400/10 border border-amber-400/25 text-amber-300 shrink-0">
                  <Lightbulb size={10} />
                </span>
                <span className="text-[12px] text-slate-300 leading-snug">{tip}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {path.tools_to_learn?.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <div className="eyebrow text-slate-500 mb-2">Essential tools to learn</div>
          <div className="flex flex-wrap gap-1.5">
            {path.tools_to_learn.map((tool, i) => (
              <span key={i} className="chip-suggestion">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Phase({ phase, index, total }) {
  return (
    <motion.div
      variants={phaseVariants}
      custom={index}
      className="relative w-44 md:w-48 shrink-0"
    >
      {index < total - 1 && (
        <div
          aria-hidden="true"
          className="absolute top-4 left-10 right-[-1rem] h-px bg-gradient-to-r from-white/15 to-white/[0.02]"
        />
      )}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 tabular"
        style={{
          background: "linear-gradient(140deg, #6366f1, #7c3aed)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.25), 0 6px 14px -6px rgba(99,102,241,0.6)",
        }}
      >
        <span className="text-[11px] font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="eyebrow text-slate-500 tabular">{phase.period}</div>
      <h5 className="text-[13.5px] font-bold text-white mt-0.5 tracking-tight leading-tight">
        {phase.focus}
      </h5>
      {phase.milestones?.length > 0 && (
        <motion.ul
          className="mt-2 space-y-1"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 + index * 0.1 } } }}
        >
          {phase.milestones.slice(0, 3).map((m, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, x: -6 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
              }}
              className="text-[11.5px] text-slate-400 leading-snug pl-3 relative"
            >
              <span className="absolute left-0 top-[7px] w-1 h-1 rounded-full bg-slate-600" />
              {m}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
