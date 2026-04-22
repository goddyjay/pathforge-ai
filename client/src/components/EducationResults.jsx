import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, GraduationCap, Lightbulb, RotateCw, Sparkles } from "lucide-react";
import { EducationCourseCard } from "./EducationCourseCard.jsx";
import { CountUp } from "./ui/CountUp.jsx";

const staggerContainer = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

export function EducationResults({ loading, error, data, scenario, onRetry }) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingState key="loading" />
      ) : error ? (
        <ErrorState key="error" message={error} onRetry={onRetry} />
      ) : !data ? (
        <EmptyState key="empty" />
      ) : (
        <motion.section
          key="results"
          className="space-y-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <BestPathBanner data={data} scenario={scenario} />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          >
            {data.recommended_courses.map((course, i) => (
              <EducationCourseCard
                key={course.course + i}
                course={course}
                index={i}
                isBest={course.course === data.best_path}
              />
            ))}
          </motion.div>

          {data.advice && (
            <motion.div variants={fadeUp}>
              <AdviceCard advice={data.advice} />
            </motion.div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function BestPathBanner({ data, scenario }) {
  const best = data.recommended_courses.find((c) => c.course === data.best_path);
  const pct = best?.fit_score ? Math.round(best.fit_score) : null;
  return (
    <motion.div
      className="card p-5 md:p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(140deg, #f59e0b, #ea580c)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 24px -8px rgba(245,158,11,0.55)",
            }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-amber-300/90">Best path for you</div>
            <h2 className="display text-[22px] md:text-[26px] tracking-extra-tight text-white mt-1 leading-tight">
              {data.best_path}
            </h2>
            {scenario && (
              <>
                <p className="text-[12px] text-slate-400 mt-1.5">
                  Based on {scenario.age}yo in {scenario.country} · {scenario.lifestyle} lifestyle · {scenario.budget} budget
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Programs ranked by fit · highest match first
                </p>
              </>
            )}
          </div>
        </div>
        {pct !== null && (
          <div className="text-right shrink-0">
            <div className="eyebrow text-slate-500">Fit score</div>
            <div className="display text-[28px] tracking-extra-tight text-white mt-0.5">
              <CountUp value={pct} duration={1.1} delay={0.2} />
              <span className="text-amber-300 text-[16px]">%</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AdviceCard({ advice }) {
  return (
    <div className="card p-5 flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(140deg, #6366f1, #7c3aed)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 20px -8px rgba(99,102,241,0.5)",
        }}
      >
        <Lightbulb size={17} className="text-white" />
      </div>
      <div className="min-w-0">
        <div className="eyebrow text-brand-300/80">Personal advice</div>
        <p className="text-[13.5px] text-slate-200 mt-1 leading-relaxed">
          {advice}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-10 text-center relative overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-sky-500/20 to-brand-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <motion.div
          className="mx-auto w-16 h-16 rounded-2xl text-white flex items-center justify-center mb-5 ring-1 ring-white/20"
          style={{
            background: "linear-gradient(140deg, #38bdf8, #2563eb)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), 0 14px 30px -8px rgba(56,189,248,0.5)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <GraduationCap size={28} />
        </motion.div>
        <h3 className="display text-xl tracking-extra-tight text-white">
          Let's find your course
        </h3>
        <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Share a few details about yourself and we'll map programs matched to
          your strengths, interests, and budget.
        </p>
      </div>
    </motion.div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, x: [0, -4, 4, -3, 3, 0] }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        x: { duration: 0.45, delay: 0.15, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      }}
      className="card p-6"
      style={{
        borderColor: "rgba(244, 63, 94, 0.3)",
        background: "rgba(244, 63, 94, 0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="text-rose-300 shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-rose-100">Something went wrong</h3>
          <p className="text-sm text-rose-200/80 mt-1">{message}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-secondary mt-3">
              <RotateCw size={14} />
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <div className="flex items-center gap-2 text-sky-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
          </span>
          <CyclingMessage />
        </div>
        <div className="text-[11px] text-slate-500 mt-1 ml-4">
          Usually takes 8–12 seconds · weighing programs against your profile.
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="card p-5 relative overflow-hidden"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.6, ease: "linear", repeat: Infinity, repeatDelay: 0.2 }}
              style={{
                background:
                  "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/5" />
              <div className="mt-4 h-5 w-2/3 rounded bg-white/5" />
              <div className="mt-2 h-3 w-full rounded bg-white/5" />
              <div className="mt-1.5 h-3 w-4/5 rounded bg-white/5" />
              <div className="mt-4 h-12 rounded-xl bg-white/5" />
              <div className="mt-4 h-9 rounded-xl bg-white/5" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

const LOADING_MESSAGES = [
  "Mapping programs to your strengths...",
  "Weighing time-to-completion...",
  "Matching careers to your interests...",
  "Finalizing your recommendations...",
];

function CyclingMessage() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % LOADING_MESSAGES.length),
      1800
    );
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-sm font-medium relative w-[280px] overflow-hidden inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="block"
        >
          {LOADING_MESSAGES[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
