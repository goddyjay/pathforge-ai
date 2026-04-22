import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  RotateCw,
  LayoutGrid,
  List,
  ChevronDown,
  Coins,
  Telescope,
  Sparkles,
} from "lucide-react";
import { CareerPathCard } from "./CareerPathCard.jsx";
import { HorizontalRoadmap } from "./HorizontalRoadmap.jsx";
import { CompareSidebar } from "./CompareSidebar.jsx";
import { ComparisonView } from "./ComparisonView.jsx";
import { TipsBar } from "./TipsBar.jsx";
import { CURRENCIES, CURRENCY_CODES } from "../lib/currency.js";
import { CountUp } from "./ui/CountUp.jsx";

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

export function CareerResults({
  loading,
  error,
  data,
  scenario,
  scenarioNumber,
  onTryAnother,
  currency,
  onCurrencyChange,
  view,
  onViewChange,
  showFullCompare,
  onShowFullCompare,
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Reset selection when a new scenario loads
  useEffect(() => {
    setSelectedIdx(0);
  }, [scenarioNumber]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingState key="loading" />
      ) : error ? (
        <ErrorState key="error" message={error} onRetry={onTryAnother} />
      ) : !data ? (
        <EmptyState key="empty" />
      ) : (
        <motion.section
          key={`results-${scenarioNumber}`}
          className="space-y-5"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <ResultsHeader
              scenario={scenario}
              scenarioNumber={scenarioNumber}
              pathCount={(data.career_paths ?? []).length}
              currency={currency}
              onCurrencyChange={onCurrencyChange}
              view={view}
              onViewChange={onViewChange}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <PersonalizedIntro scenario={scenario} paths={data.career_paths ?? []} />
          </motion.div>

          <CardsGrid
            paths={data.career_paths ?? []}
            view={view}
            currency={currency}
            selectedIdx={selectedIdx}
            onSelectIdx={setSelectedIdx}
          />

          {showFullCompare ? (
            <motion.div variants={fadeUp}>
              <ComparisonView paths={data.career_paths ?? []} currency={currency} />
            </motion.div>
          ) : (
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 xl:grid-cols-3 gap-4"
            >
              <div className="xl:col-span-2">
                <HorizontalRoadmap
                  path={(data.career_paths ?? [])[selectedIdx] ?? (data.career_paths ?? [])[0]}
                />
              </div>
              <div className="xl:col-span-1">
                <CompareSidebar
                  paths={data.career_paths ?? []}
                  currency={currency}
                  onViewFull={() => onShowFullCompare?.(true)}
                />
              </div>
            </motion.div>
          )}

          {showFullCompare && (
            <motion.div variants={fadeUp} className="flex justify-center">
              <button
                type="button"
                onClick={() => onShowFullCompare?.(false)}
                className="btn-secondary"
              >
                <ChevronDown size={14} className="rotate-180" />
                Collapse comparison
              </button>
            </motion.div>
          )}

          <motion.div variants={fadeUp}>
            <TipsBar />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function PersonalizedIntro({ scenario, paths }) {
  if (!scenario || !paths.length) return null;

  const topScore = paths[0]?.confidence_score;
  const interests = (scenario.interests ?? []).slice(0, 3).join(", ");
  const experienceLabel =
    scenario.experience_level === "beginner"
      ? "starting out"
      : scenario.experience_level === "intermediate"
      ? "at an intermediate level"
      : "with advanced experience";

  const sentence = [
    "Based on your profile as a",
    scenario.age + "-year-old",
    experienceLabel,
    scenario.location ? `in ${scenario.location}` : null,
    "— here are the paths that best fit your" ,
    interests ? `${interests} interests` : "interests",
    "and weekly time commitment.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className="card p-4 md:p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 w-72 h-40 bg-brand-500/15 blur-3xl rounded-full"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
             style={{
               background: "linear-gradient(140deg, #6366f1, #7c3aed)",
               boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 18px -6px rgba(99,102,241,0.5)",
             }}>
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="eyebrow text-brand-300/80">PathForge thinks</div>
          <p className="text-[13.5px] md:text-[14px] text-slate-200 mt-1 leading-relaxed">
            {sentence}
          </p>
        </div>
        {typeof topScore === "number" && (
          <div className="shrink-0 text-right">
            <div className="eyebrow text-slate-500">Top match</div>
            <div className="text-[22px] font-extrabold text-white mt-0.5 display tracking-extra-tight">
              <CountUp value={Math.round(topScore)} duration={1.1} delay={0.2} />
              <span className="text-brand-300 text-[14px]">%</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CardsGrid({ paths, view, currency, selectedIdx, onSelectIdx }) {
  const wrap =
    view === "list"
      ? "space-y-4"
      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
  return (
    <motion.div
      className={wrap}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {paths.map((path, i) => (
        <CareerPathCard
          key={path.title + i}
          path={path}
          index={i}
          currency={currency}
          isBestMatch={i === 0}
          isSelected={i === selectedIdx}
          onSelect={onSelectIdx}
        />
      ))}
    </motion.div>
  );
}

function ResultsHeader({
  scenario,
  scenarioNumber,
  pathCount,
  currency,
  onCurrencyChange,
  view,
  onViewChange,
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="display text-[22px] md:text-[26px] tracking-extra-tight text-white leading-tight">
            Your Career Map
          </h2>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-brand-200 bg-brand-500/10 border border-brand-400/30 tabular">
            {pathCount} paths
          </span>
        </div>
        <p className="text-[12px] text-slate-500 mt-1.5">
          {scenario
            ? `Scenario ${scenarioNumber} · ${scenarioToLabel(scenario)}`
            : "Personalized career paths based on your profile."}
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Ranked by fit · highest match first · click a card to focus the roadmap below.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-[11px] text-slate-400 hidden md:block">
          Projected in
        </div>
        <InlineCurrency value={currency} onChange={onCurrencyChange} />
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </header>
  );
}

function InlineCurrency({ value, onChange }) {
  return (
    <div className="relative">
      <Coins
        size={13}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-300"
      />
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none bg-white/[0.04] border border-white/10 text-slate-200 text-xs font-semibold
                   rounded-lg pl-7 pr-7 py-1.5 hover:bg-white/[0.08] transition"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code} className="bg-ink-900">
            {code}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <span className="sr-only">Current: {CURRENCIES[value]?.label}</span>
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  const active = "bg-white/10 text-white ring-1 ring-white/10";
  const base =
    "inline-flex items-center justify-center w-8 h-8 rounded-md transition";
  const inactive = "text-slate-400 hover:text-white";
  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-white/[0.04] ring-1 ring-white/10">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={`${base} ${view === "grid" ? active : inactive}`}
      >
        <LayoutGrid size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        className={`${base} ${view === "list" ? active : inactive}`}
      >
        <List size={14} />
      </button>
    </div>
  );
}

function scenarioToLabel(s) {
  const parts = [`${s.age}yo`, s.experience_level, s.location].filter(Boolean);
  return parts.join(" · ");
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
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <motion.div
          className="mx-auto w-16 h-16 rounded-2xl text-white flex items-center justify-center mb-5 ring-1 ring-white/20"
          style={{
            background: "linear-gradient(140deg, #6366f1, #7c3aed)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), 0 14px 30px -8px rgba(99,102,241,0.5)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Telescope size={28} />
        </motion.div>
        <h3 className="display text-xl tracking-extra-tight text-white">
          Your career map awaits
        </h3>
        <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Tell us a little about yourself and we'll draft three career paths
          tailored to your profile, budget, and goals.
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
            <button
              type="button"
              onClick={onRetry}
              className="btn-secondary mt-3"
            >
              <RotateCw size={14} />
              Try another scenario
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
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 text-brand-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400" />
          </span>
          <Sparkles size={14} className="text-brand-300" />
          <LoadingMessage />
        </div>
        <div className="text-[11px] text-slate-500 mt-1 ml-4">
          Usually takes 8–12 seconds · we're tailoring this to your profile.
        </div>
      </motion.div>

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
            <Shimmer />
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

function Shimmer() {
  return (
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
  );
}

const LOADING_MESSAGES = [
  "Consulting the AI...",
  "Analyzing your profile...",
  "Simulating market conditions...",
  "Mapping roadmaps...",
  "Finalizing your paths...",
];
function LoadingMessage() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-sm font-medium relative w-[240px] overflow-hidden inline-block">
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
