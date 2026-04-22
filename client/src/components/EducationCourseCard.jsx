import { motion } from "framer-motion";
import { BookOpen, Briefcase, Clock, Crown, Sparkles, Wallet } from "lucide-react";
import { CountUp } from "./ui/CountUp.jsx";

const THEMES = [
  {
    bg: "linear-gradient(140deg, #6366f1 0%, #7c3aed 100%)",
    ring: "#a5b4fc",
  },
  {
    bg: "linear-gradient(140deg, #38bdf8 0%, #2563eb 100%)",
    ring: "#7dd3fc",
  },
  {
    bg: "linear-gradient(140deg, #f59e0b 0%, #ea580c 100%)",
    ring: "#fbbf24",
  },
  {
    bg: "linear-gradient(140deg, #10b981 0%, #059669 100%)",
    ring: "#6ee7b7",
  },
  {
    bg: "linear-gradient(140deg, #f472b6 0%, #db2777 100%)",
    ring: "#fbcfe8",
  },
];

export const courseCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.09,
      duration: 0.5,
      ease: [0.2, 0.7, 0.2, 1],
    },
  }),
};

export function EducationCourseCard({ course, index, isBest }) {
  const theme = THEMES[index % THEMES.length];
  const fit = typeof course.fit_score === "number" ? course.fit_score : null;

  return (
    <motion.article
      custom={index}
      variants={courseCardVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="card p-5 relative overflow-hidden"
      style={
        isBest
          ? {
              borderColor: "rgba(251, 191, 36, 0.35)",
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(251, 191, 36, 0.10), transparent 55%), rgba(255,255,255,0.02)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -24px rgba(245,158,11,0.35)",
            }
          : null
      }
    >
      {isBest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.35 }}
          className="absolute top-3.5 right-3.5 z-10"
        >
          <motion.span
            animate={{ boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px -2px rgba(245,158,11,0.4)",
              "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 18px -2px rgba(245,158,11,0.75)",
              "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px -2px rgba(245,158,11,0.4)",
            ] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1 rounded-full pl-1.5 pr-2 py-0.5 text-[10px] font-semibold tracking-wide"
            style={{
              background:
                "linear-gradient(180deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))",
              color: "#422006",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <Crown size={10} />
            Best Path
          </motion.span>
        </motion.div>
      )}

      <header className="flex items-start justify-between gap-2">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: theme.bg,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.25), 0 10px 20px -8px rgba(0,0,0,0.4)",
          }}
        >
          <BookOpen size={20} className="text-white" strokeWidth={2.2} />
        </div>
        {fit !== null && <FitRing value={fit} stop={theme.ring} />}
      </header>

      <h3 className="display text-[19px] leading-[1.15] tracking-extra-tight text-white mt-4">
        {course.course}
      </h3>
      {course.difficulty && (
        <div className="mt-1 text-[11px] text-slate-400 tracking-wide">
          {course.difficulty}
        </div>
      )}

      <div className="mt-4">
        <div className="eyebrow text-brand-300/80 flex items-center gap-1 mb-1">
          <Sparkles size={10} />
          Why this fits you
        </div>
        <p className="text-[12.5px] text-slate-300 leading-relaxed">
          {course.why_it_fits}
        </p>
      </div>

      {course.possible_careers?.length > 0 && (
        <div className="mt-4">
          <div className="eyebrow text-slate-500 flex items-center gap-1 mb-2">
            <Briefcase size={10} />
            Possible careers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {course.possible_careers.map((career, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.25 }}
                className="chip-suggestion"
              >
                {career}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2.5">
        <Metric
          icon={Clock}
          label="Time to complete"
          value={course.time_to_complete}
        />
        <Metric
          icon={Wallet}
          label="Income potential"
          value={course.income_potential}
          accent="emerald"
        />
      </div>
    </motion.article>
  );
}

function Metric({ icon: Icon, label, value, accent }) {
  const color = accent === "emerald" ? "text-emerald-300" : "text-white";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-slate-500 tracking-tight flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-slate-500" />}
        {label}
      </span>
      <span className={`text-[13px] font-semibold ${color} tabular text-right`}>
        {value}
      </span>
    </div>
  );
}

function FitRing({ value, stop }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const circumference = 2 * Math.PI * 14;
  const dash = (pct / 100) * circumference;
  return (
    <div
      className="relative w-9 h-9 flex items-center justify-center"
      aria-label={`${pct} percent fit`}
      title={`${pct}% fit`}
    >
      <svg viewBox="0 0 32 32" width="36" height="36" className="-rotate-90">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          stroke={stop}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
          style={{ filter: `drop-shadow(0 0 4px ${stop}40)` }}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-white">
        <CountUp value={pct} duration={1} delay={0.15} />
      </span>
    </div>
  );
}
