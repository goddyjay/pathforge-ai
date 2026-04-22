import { motion } from "framer-motion";
import { AnimatedMoney } from "./ui/AnimatedMoney.jsx";

/**
 * Compact three-point sparkline for entry → mid → senior income. The line
 * draws itself in, the area fades, and the labels stagger beneath it.
 * Intentionally small so it fits inside a results card without dominating.
 */
export function IncomeChart({ monthlyNgn, currency, accent = "#a5b4fc" }) {
  const entry = monthlyNgn?.entry;
  const mid = monthlyNgn?.mid;
  const senior = monthlyNgn?.senior;
  if (typeof entry !== "number" || typeof mid !== "number" || typeof senior !== "number") {
    return null;
  }

  const values = [entry, mid, senior];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);

  // Chart coords (viewBox 300×60). 12px padding so the line/dots don't clip.
  const w = 300;
  const h = 60;
  const pad = { x: 20, top: 8, bottom: 12 };
  const innerW = w - pad.x * 2;
  const innerH = h - pad.top - pad.bottom;

  const points = values.map((v, i) => {
    const x = pad.x + (i * innerW) / (values.length - 1);
    const y = pad.top + innerH - ((v - min) / range) * innerH;
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  return (
    <div className="mt-4">
      <div className="eyebrow text-slate-500 mb-2">Income progression</div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="w-full h-14"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`pf-income-fill-${accent.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={accent} stopOpacity="0.35" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* baseline */}
          <line
            x1={pad.x}
            x2={w - pad.x}
            y1={h - pad.bottom + 2}
            y2={h - pad.bottom + 2}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="2 3"
          />

          {/* filled area */}
          <motion.path
            d={areaPath}
            fill={`url(#pf-income-fill-${accent.replace("#", "")})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />

          {/* line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          />

          {/* data points */}
          {points.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={3.2}
              fill={accent}
              stroke="#0a0b12"
              strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6 + i * 0.1,
                duration: 0.35,
                ease: [0.2, 1.2, 0.4, 1],
              }}
            />
          ))}
        </svg>

        <motion.div
          className="grid grid-cols-3 gap-2 mt-1.5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.7 } } }}
        >
          {["Entry", "Mid", "Senior"].map((label, i) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 4 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
              className="text-center"
            >
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                {label}
              </div>
              <div className="text-[12.5px] font-semibold text-white mt-0.5">
                <AnimatedMoney
                  amountNgn={values[i]}
                  currency={currency}
                  compact
                  duration={1}
                  delay={0.75 + i * 0.08}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
