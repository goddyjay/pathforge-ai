import { motion } from "framer-motion";
import {
  Check,
  Crown,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  X,
} from "lucide-react";
import { CountUp } from "./ui/CountUp.jsx";

export const cardVariants = {
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

const RISK_TONES = {
  Low: {
    icon: ShieldCheck,
    stroke: "#6ee7b7",
    tint: "rgba(16, 185, 129, 0.12)",
    ring: "rgba(52, 211, 153, 0.35)",
    text: "#a7f3d0",
  },
  Medium: {
    icon: ShieldHalf,
    stroke: "#fcd34d",
    tint: "rgba(245, 158, 11, 0.12)",
    ring: "rgba(251, 191, 36, 0.35)",
    text: "#fde68a",
  },
  High: {
    icon: ShieldAlert,
    stroke: "#fca5a5",
    tint: "rgba(244, 63, 94, 0.12)",
    ring: "rgba(248, 113, 113, 0.4)",
    text: "#fecaca",
  },
};

export function LifeDecisionCard({ option, index, isRecommended }) {
  const risk = RISK_TONES[option.risk_level] ?? RISK_TONES.Medium;
  const RiskIcon = risk.icon;
  const confidence =
    typeof option.confidence_score === "number"
      ? Math.round(option.confidence_score)
      : null;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="card p-5 relative overflow-hidden"
      style={
        isRecommended
          ? {
              borderColor: "rgba(251, 191, 36, 0.4)",
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(251, 191, 36, 0.10), transparent 55%), rgba(255,255,255,0.02)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -24px rgba(245,158,11,0.4)",
            }
          : null
      }
    >
      {isRecommended && (
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
            Recommended
          </motion.span>
        </motion.div>
      )}

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="eyebrow text-amber-300/80">Option {index + 1}</div>
          <h3 className="display text-[19px] leading-[1.2] tracking-extra-tight text-white mt-1">
            {option.decision}
          </h3>
          {option.summary && (
            <p className="text-[12.5px] text-slate-400 mt-1.5 leading-relaxed">
              {option.summary}
            </p>
          )}
        </div>

        <RiskBadge tone={risk} level={option.risk_level} Icon={RiskIcon} />
      </header>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProsConsColumn
          heading="Pros"
          items={option.pros}
          icon={Check}
          iconColor="text-emerald-300"
          iconBg="rgba(16, 185, 129, 0.12)"
          iconRing="rgba(52, 211, 153, 0.35)"
        />
        <ProsConsColumn
          heading="Cons"
          items={option.cons}
          icon={X}
          iconColor="text-rose-300"
          iconBg="rgba(244, 63, 94, 0.12)"
          iconRing="rgba(248, 113, 113, 0.4)"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-start gap-3">
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
          <div className="eyebrow text-brand-300/80">Long-term outcome</div>
          <p className="text-[12.5px] text-slate-200 mt-1 leading-relaxed">
            {option.long_term_outcome}
          </p>
        </div>
      </div>

      {confidence !== null && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">Engine confidence</span>
          <ConfidenceBar value={confidence} />
        </div>
      )}
    </motion.article>
  );
}

function ProsConsColumn({ heading, items, icon: Icon, iconColor, iconBg, iconRing }) {
  return (
    <div>
      <div className="eyebrow text-slate-500 mb-2">{heading}</div>
      <ul className="space-y-1.5">
        {items?.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.05, duration: 0.25 }}
            className="flex items-start gap-2 text-[12.5px] text-slate-300 leading-snug"
          >
            <span
              className={`mt-[1px] inline-flex items-center justify-center w-4 h-4 rounded ${iconColor} shrink-0`}
              style={{
                background: iconBg,
                border: `1px solid ${iconRing}`,
              }}
            >
              <Icon size={10} strokeWidth={2.5} />
            </span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function RiskBadge({ tone, level, Icon }) {
  const isHigh = level === "High";
  return (
    <motion.div
      className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular"
      style={{
        background: tone.tint,
        border: `1px solid ${tone.ring}`,
        color: tone.text,
      }}
      animate={
        isHigh
          ? {
              boxShadow: [
                `0 0 0 0 ${tone.ring}`,
                `0 0 0 6px rgba(248, 113, 113, 0)`,
                `0 0 0 0 ${tone.ring}`,
              ],
            }
          : undefined
      }
      transition={
        isHigh
          ? { duration: 2.4, repeat: Infinity, ease: "easeOut" }
          : undefined
      }
    >
      <Icon size={11} />
      {level} risk
    </motion.div>
  );
}

function ConfidenceBar({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 min-w-0 flex-1 max-w-[200px]">
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #f59e0b, #ea580c)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
        />
      </div>
      <span className="text-[11px] font-semibold text-white w-10 text-right">
        <CountUp value={pct} duration={1} delay={0.3} suffix="%" />
      </span>
    </div>
  );
}
