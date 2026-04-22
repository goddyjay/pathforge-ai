import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, X, Zap } from "lucide-react";
import {
  DEMO_STEP_LABELS,
  DEMO_TOTAL_STEPS,
  demoStepIndex,
  useDemo,
} from "../lib/demo.jsx";

export function DemoOverlay() {
  const demo = useDemo();
  const visible = demo?.step !== null && demo?.step !== undefined;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="demo-overlay"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed bottom-4 right-4 z-50 card p-4 w-[300px]"
        >
          <DemoPanel demo={demo} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DemoPanel({ demo }) {
  const navigate = useNavigate();
  const idx = Math.max(0, demoStepIndex(demo.step));
  const label = DEMO_STEP_LABELS[demo.step] ?? "…";
  const isDone = demo.step === "done";
  const pct = Math.min(100, Math.round(((idx + 1) / DEMO_TOTAL_STEPS) * 100));

  function handleCustomize() {
    demo.stopDemo();
    navigate("/career");
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: isDone
                ? "linear-gradient(140deg, #10b981, #059669)"
                : "linear-gradient(140deg, #f59e0b, #ea580c)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 12px -4px rgba(245,158,11,0.5)",
            }}
          >
            {isDone ? (
              <CheckCircle2 size={13} className="text-white" />
            ) : (
              <Zap size={13} className="text-white" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-white leading-tight">
              {isDone ? "Demo complete" : "Demo running"}
            </div>
            <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5 truncate">
              {label}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={demo.stopDemo}
          aria-label="Stop demo"
          title="Stop demo"
          className="btn-ghost !p-1.5"
        >
          <X size={12} />
        </button>
      </div>

      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isDone
              ? "linear-gradient(90deg, #34d399, #10b981)"
              : "linear-gradient(90deg, #6366f1, #f59e0b)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 tabular">
        <span>
          Step {Math.min(idx + 1, DEMO_TOTAL_STEPS)} of {DEMO_TOTAL_STEPS}
        </span>
        <span>{pct}%</span>
      </div>

      <AnimatePresence>
        {isDone && (
          <motion.button
            key="customize-cta"
            type="button"
            onClick={handleCustomize}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 w-full inline-flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition"
          >
            <span>Tweak this scenario</span>
            <ArrowRight size={12} className="text-slate-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {!isDone && (
        <div className="mt-2 text-[10px] text-slate-600">
          Press <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> anywhere to restart.
        </div>
      )}
    </div>
  );
}

function Kbd({ children }) {
  return (
    <span className="inline-flex items-center justify-center px-1 min-w-[16px] h-[16px] mx-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] font-semibold text-slate-300">
      {children}
    </span>
  );
}
