import { motion } from "framer-motion";
import { Star, Check, X } from "lucide-react";
import { formatFromNgn } from "../lib/currency.js";

const DEMAND_TO_STARS = { high: 4.5, medium: 3.5, low: 2.5 };

export function CompareSidebar({ paths, currency, onViewFull }) {
  if (!paths?.length) return null;
  const cols = paths.slice(0, 3);

  const rows = [
    {
      key: "time",
      label: "Time to Income",
      render: (p) => (
        <span className="text-slate-100 text-xs font-semibold">
          {shortenTime(p.time_to_first_income)}
        </span>
      ),
    },
    {
      key: "income",
      label: "Monthly Income",
      render: (p) => (
        <span className="text-emerald-300 text-xs font-bold">
          {typeof p.monthly_income_ngn?.entry === "number"
            ? formatFromNgn(p.monthly_income_ngn.entry, currency, { compact: true }) + "+"
            : "—"}
        </span>
      ),
    },
    {
      key: "demand",
      label: "Skill Demand",
      render: (p) => <Stars value={DEMAND_TO_STARS[(p.demand || "").toLowerCase()] ?? 3} />,
    },
    {
      key: "remote",
      label: "Remote Friendly",
      render: (p) => <Bool value={isRemoteFriendly(p)} />,
    },
    {
      key: "startup",
      label: "Startup Friendly",
      render: (p) => <Bool value={isStartupFriendly(p)} />,
    },
  ];

  return (
    <div className="card p-5">
      <header className="mb-4">
        <div className="eyebrow text-slate-500">Side by side</div>
        <h4 className="display text-[17px] tracking-extra-tight text-white mt-1">
          Compare Paths
        </h4>
        <p className="text-[11px] text-slate-500 mt-1">
          Numbers reflect market rates in your region.
        </p>
      </header>

      <div className="grid gap-3" style={{ gridTemplateColumns: `minmax(7rem, 1fr) repeat(${cols.length}, minmax(0, 1fr))` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 pb-2 border-b border-white/5">
          Metric
        </div>
        {cols.map((p, i) => (
          <div key={p.title + i} className="pb-2 border-b border-white/5 flex justify-center">
            <PathChip index={i} />
          </div>
        ))}

        {rows.map((row) => (
          <Row key={row.key} row={row} cols={cols} />
        ))}
      </div>

      <button
        type="button"
        onClick={onViewFull}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-300 hover:text-white transition"
      >
        View Full Comparison →
      </button>
    </div>
  );
}

function Row({ row, cols }) {
  return (
    <>
      <div className="text-xs text-slate-400 py-2.5 border-b border-white/5">
        {row.label}
      </div>
      {cols.map((p, i) => (
        <div
          key={p.title + i}
          className="py-2.5 border-b border-white/5 text-center"
        >
          {row.render(p)}
        </div>
      ))}
    </>
  );
}

const PATH_THEMES = [
  "linear-gradient(140deg, #6366f1, #7c3aed)",
  "linear-gradient(140deg, #38bdf8, #2563eb)",
  "linear-gradient(140deg, #f59e0b, #ea580c)",
];

function PathChip({ index }) {
  return (
    <div
      className="w-6 h-6 rounded-md flex items-center justify-center tabular"
      style={{
        background: PATH_THEMES[index] ?? PATH_THEMES[0],
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.25), 0 4px 8px -3px rgba(0,0,0,0.4)",
      }}
    >
      <span className="text-[9px] font-bold text-white">P{index + 1}</span>
    </div>
  );
}

function Stars({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full;
        const half = i === full && hasHalf;
        const lit = filled || half;
        return (
          <motion.span
            key={i}
            initial={lit ? { opacity: 0.35, scale: 0.8 } : undefined}
            animate={lit ? { opacity: 1, scale: 1 } : undefined}
            transition={
              lit
                ? {
                    delay: 0.25 + i * 0.08,
                    duration: 0.3,
                    ease: [0.2, 1.3, 0.4, 1],
                  }
                : undefined
            }
            className="inline-flex"
          >
            <Star
              size={11}
              className={
                lit ? "text-amber-400 fill-amber-400" : "text-slate-600"
              }
              strokeWidth={1.5}
            />
          </motion.span>
        );
      })}
    </div>
  );
}

function Bool({ value }) {
  if (value) {
    return (
      <div className="inline-flex w-5 h-5 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/40 items-center justify-center">
        <Check size={11} className="text-emerald-300" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="inline-flex w-5 h-5 rounded-full bg-rose-500/15 ring-1 ring-rose-400/40 items-center justify-center">
      <X size={11} className="text-rose-300" strokeWidth={3} />
    </div>
  );
}

function shortenTime(str) {
  if (!str) return "—";
  return String(str)
    .replace(/months?/i, "m")
    .replace(/years?/i, "y")
    .replace(/weeks?/i, "w")
    .replace(/\s+/g, "");
}

const REMOTE_KEYWORDS = /(develop|software|engineer|design|writer|marketer|data|product|analyst|remote|digital|web|UX|UI|content)/i;
const STARTUP_KEYWORDS = /(develop|engineer|design|product|growth|marketer|founder|full[-\s]?stack)/i;

function isRemoteFriendly(path) {
  if (REMOTE_KEYWORDS.test(path.title || "")) return true;
  return (path.tools_to_learn || []).some((t) => REMOTE_KEYWORDS.test(t));
}

function isStartupFriendly(path) {
  if (STARTUP_KEYWORDS.test(path.title || "")) return true;
  return (path.demand || "").toLowerCase() === "high";
}
