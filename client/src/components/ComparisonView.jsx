import { Clock, TrendingUp, Gauge, Flame } from "lucide-react";
import { DifficultyBadge, DemandBadge } from "./ui/Badge.jsx";
import { formatFromNgn } from "../lib/currency.js";

const DIFFICULTY_RANK = { beginner: 1, intermediate: 2, advanced: 3 };
const DEMAND_RANK = { low: 1, medium: 2, high: 3 };

export function ComparisonView({ paths, currency }) {
  if (!paths?.length) return null;

  const incomeBestIdx = bestIndex(
    paths,
    (p) => p.monthly_income_ngn?.entry ?? null,
    "max"
  );
  const timeBestIdx = bestIndex(paths, (p) => lowMonths(p.time_to_first_income), "min");
  const difficultyBestIdx = bestIndex(
    paths,
    (p) => DIFFICULTY_RANK[(p.difficulty || "").toLowerCase()] ?? null,
    "min"
  );
  const demandBestIdx = bestIndex(
    paths,
    (p) => DEMAND_RANK[(p.demand || "").toLowerCase()] ?? null,
    "max"
  );

  const rows = [
    {
      key: "income",
      label: "Monthly income",
      icon: TrendingUp,
      bestIdx: incomeBestIdx,
      bestHint: "Highest",
      render: (p) => (
        <div>
          <div className="text-base font-bold text-white">
            {typeof p.monthly_income_ngn?.entry === "number"
              ? formatFromNgn(p.monthly_income_ngn.entry, currency, { compact: true })
              : "—"}
          </div>
          {typeof p.monthly_income_ngn?.senior === "number" && (
            <div className="text-[11px] text-slate-400 mt-0.5">
              up to {formatFromNgn(p.monthly_income_ngn.senior, currency, { compact: true })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "time",
      label: "Time to first job",
      icon: Clock,
      bestIdx: timeBestIdx,
      bestHint: "Fastest",
      render: (p) => <span className="text-slate-100">{p.time_to_first_income}</span>,
    },
    {
      key: "difficulty",
      label: "Difficulty",
      icon: Gauge,
      bestIdx: difficultyBestIdx,
      bestHint: "Easiest",
      render: (p) => <DifficultyBadge value={p.difficulty} />,
    },
    {
      key: "demand",
      label: "Market demand",
      icon: Flame,
      bestIdx: demandBestIdx,
      bestHint: "Strongest",
      render: (p) => <DemandBadge value={p.demand} />,
    },
  ];

  return (
    <section className="card p-5 md:p-6 animate-fade-in overflow-x-auto">
      <div
        className="grid gap-4 min-w-[640px]"
        style={{ gridTemplateColumns: `minmax(9rem, 11rem) repeat(${paths.length}, minmax(0, 1fr))` }}
      >
        <div />
        {paths.map((p, i) => (
          <div key={p.title + i} className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
              Path {i + 1}
            </div>
            <h4 className="text-sm md:text-base font-bold text-white mt-0.5 leading-snug break-words">
              {p.title}
            </h4>
          </div>
        ))}

        {rows.map((row) => (
          <Row key={row.key} row={row} paths={paths} />
        ))}
      </div>
    </section>
  );
}

function Row({ row, paths }) {
  const { label, icon: Icon, bestIdx, bestHint } = row;
  return (
    <>
      <div className="flex items-start gap-2 pt-4 border-t border-white/5 text-slate-400">
        <Icon size={13} className="mt-0.5 shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
          {label}
        </span>
      </div>
      {paths.map((p, i) => {
        const isBest = bestIdx !== null && bestIdx === i;
        return (
          <div
            key={p.title + i}
            className={
              "pt-4 border-t text-sm min-w-0 " +
              (isBest ? "border-brand-400/30" : "border-white/5")
            }
          >
            <div>{row.render(p)}</div>
            {isBest && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-brand-200 bg-brand-500/15 ring-1 ring-brand-400/30 rounded-full px-2 py-0.5">
                {bestHint}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function lowMonths(str) {
  if (!str) return null;
  const nums = String(str).match(/\d+(?:\.\d+)?/g);
  if (!nums) return null;
  const lower = Math.min(...nums.map(Number));
  if (/year/i.test(str)) return lower * 12;
  if (/week/i.test(str)) return lower / 4;
  return lower;
}

function bestIndex(items, score, mode) {
  const scored = items.map((it, i) => ({ i, s: score(it) }));
  const valid = scored.filter((x) => typeof x.s === "number" && !Number.isNaN(x.s));
  if (valid.length < 2) return null;
  const values = valid.map((v) => v.s);
  const allSame = values.every((v) => v === values[0]);
  if (allSame) return null;
  const chosen =
    mode === "max"
      ? valid.reduce((a, b) => (b.s > a.s ? b : a))
      : valid.reduce((a, b) => (b.s < a.s ? b : a));
  return chosen.i;
}
