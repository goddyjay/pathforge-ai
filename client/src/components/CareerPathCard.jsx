import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Code2,
  Palette,
  TrendingUp,
  Crown,
  ArrowUpRight,
  Sparkles,
  Heart,
  Wallet,
  GraduationCap,
  Clock,
  MapPin,
} from "lucide-react";
import { formatFromNgn } from "../lib/currency.js";
import { CountUp } from "./ui/CountUp.jsx";
import { AnimatedMoney } from "./ui/AnimatedMoney.jsx";
import { IncomeChart } from "./IncomeChart.jsx";

export const cardAnimVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.2, 0.7, 0.2, 1],
    },
  }),
};

const THEMES = [
  {
    iconBg: "linear-gradient(140deg, #6366f1 0%, #7c3aed 100%)",
    iconRing: "rgba(196, 181, 253, 0.25)",
    ringStop: "#a5b4fc",
    chartStop: "#a5b4fc",
    icon: Code2,
  },
  {
    iconBg: "linear-gradient(140deg, #38bdf8 0%, #2563eb 100%)",
    iconRing: "rgba(147, 197, 253, 0.22)",
    ringStop: "#7dd3fc",
    chartStop: "#7dd3fc",
    icon: Palette,
  },
  {
    iconBg: "linear-gradient(140deg, #f59e0b 0%, #ea580c 100%)",
    iconRing: "rgba(253, 186, 116, 0.22)",
    ringStop: "#fbbf24",
    chartStop: "#fbbf24",
    icon: TrendingUp,
  },
];

const DIMENSION_ICONS = {
  Interests: Heart,
  Budget: Wallet,
  Experience: GraduationCap,
  Time: Clock,
  Location: MapPin,
};

export function CareerPathCard({
  path,
  index,
  currency,
  isBestMatch,
  isSelected,
  onSelect,
}) {
  const [saved, setSaved] = useState(false);
  const theme = THEMES[index % THEMES.length];
  const Icon = theme.icon;
  const monthly = path.monthly_income_ngn ?? {};
  const confidence = typeof path.confidence_score === "number" ? path.confidence_score : null;

  return (
    <motion.article
      onClick={() => onSelect?.(index)}
      custom={index}
      variants={cardAnimVariants}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={"card p-5 relative overflow-hidden cursor-pointer"}
      style={{
        ...(isSelected
          ? {
              borderColor: "rgba(129, 140, 248, 0.45)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -24px rgba(99,102,241,0.4)",
            }
          : null),
        ...(isBestMatch
          ? {
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(124, 58, 237, 0.14), transparent 55%), rgba(255,255,255,0.02)",
            }
          : null),
      }}
    >
      {isBestMatch && (
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
              background: "linear-gradient(180deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))",
              color: "#422006",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <Crown size={10} />
            Best Match
          </motion.span>
        </motion.div>
      )}

      <header className="relative">
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: theme.iconBg,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.25), 0 10px 20px -8px ${theme.iconRing}`,
            }}
          >
            <Icon size={20} className="text-white" strokeWidth={2.25} />
          </div>
          <div className="flex items-center gap-1.5">
            {confidence !== null && (
              <ConfidenceRing value={confidence} stop={theme.ringStop} />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSaved((s) => !s);
              }}
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
              aria-label={saved ? "Remove from saved" : "Save this path"}
            >
              {saved ? (
                <BookmarkCheck size={13} className="text-brand-300" />
              ) : (
                <Bookmark size={13} />
              )}
            </button>
          </div>
        </div>

        <h3 className="display text-[19px] leading-[1.15] tracking-extra-tight text-white mt-3.5">
          {path.title}
        </h3>
        <p className="text-[12px] text-slate-400 mt-1 leading-snug">
          {shortTagline(path)}
        </p>
      </header>

      <div className="mt-4">
        <div className="eyebrow text-brand-300/80 mb-1 flex items-center gap-1">
          <Sparkles size={10} /> Why this fits you
        </div>
        <p className="text-[12.5px] text-slate-300 leading-relaxed line-clamp-2">
          {path.why_this_path}
        </p>

        {path.fit_reasons?.length > 0 && (
          <ul className="mt-2.5 space-y-1.5">
            {path.fit_reasons.slice(0, 3).map((r, i) => {
              const FI = DIMENSION_ICONS[r.dimension] ?? Sparkles;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
                  className="flex items-start gap-2 text-[11.5px] text-slate-400 leading-snug"
                >
                  <span className="mt-[1px] inline-flex items-center justify-center w-4 h-4 rounded bg-white/[0.04] border border-white/[0.08] text-brand-300 shrink-0">
                    <FI size={9} />
                  </span>
                  <span>
                    <span className="text-slate-500">{r.dimension}:</span>{" "}
                    <span className="text-slate-300">{r.note}</span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 space-y-2.5 pt-3 border-t border-white/[0.06]">
        <Metric label="Potential Monthly Income" accent="emerald">
          <AnimatedMoneyRange monthly={monthly} currency={currency} />
        </Metric>
        <Metric label="Time to First Income">
          <span className="tabular">{path.time_to_first_income || "—"}</span>
        </Metric>
        {path.time_to_first_income && (
          <div className="text-[10.5px] text-slate-500 -mt-1">
            You could start earning in {path.time_to_first_income.toLowerCase()}.
          </div>
        )}
      </div>

      {isBestMatch && (
        <IncomeChart
          monthlyNgn={monthly}
          currency={currency}
          accent={theme.chartStop}
        />
      )}

      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(index);
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="group mt-4 w-full inline-flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold
                   bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15]
                   text-white transition"
      >
        <span>View full path</span>
        <ArrowUpRight
          size={14}
          className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
        />
      </motion.button>
    </motion.article>
  );
}

function ConfidenceRing({ value, stop }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const circumference = 2 * Math.PI * 14; // r=14
  const dash = (pct / 100) * circumference;
  return (
    <div
      className="relative w-9 h-9 flex items-center justify-center"
      aria-label={`${pct} percent match`}
      title={`${pct}% match`}
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

function Metric({ label, accent, children }) {
  const valColor = accent === "emerald" ? "text-emerald-300" : "text-white";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-slate-500 tracking-tight">{label}</span>
      <span className={`text-[14px] font-semibold ${valColor}`}>{children}</span>
    </div>
  );
}

function AnimatedMoneyRange({ monthly, currency }) {
  const entry = monthly?.entry;
  const senior = monthly?.senior;
  if (typeof entry !== "number") {
    return <span className="tabular">—</span>;
  }
  if (typeof senior !== "number") {
    return (
      <AnimatedMoney amountNgn={entry} currency={currency} suffix="+" delay={0.15} />
    );
  }
  return (
    <span>
      <AnimatedMoney amountNgn={entry} currency={currency} delay={0.15} />
      <span className="text-slate-500"> – </span>
      <AnimatedMoney amountNgn={senior} currency={currency} suffix="+" delay={0.25} />
    </span>
  );
}

function shortTagline(path) {
  const txt = String(path.why_this_path || "").split(/[.!?]/)[0];
  if (txt.length > 54) return txt.slice(0, 52).trim() + "…";
  return txt || "Build. Grow. Thrive.";
}
