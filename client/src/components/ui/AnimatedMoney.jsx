import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatFromNgn } from "../../lib/currency.js";

/**
 * Counts a money value (stored in NGN) from its previous value to the new
 * value, re-formatting via the selected currency on every frame so the
 * symbol + grouping always look right.
 */
export function AnimatedMoney({
  amountNgn,
  currency,
  compact = true,
  duration = 1,
  delay = 0,
  suffix = "",
  className = "",
}) {
  const [value, setValue] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current ?? 0;
    const controls = animate(from, amountNgn, {
      duration,
      delay,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setValue(v),
      onComplete: () => {
        prevRef.current = amountNgn;
      },
    });
    return () => controls.stop();
    // Re-run when the target changes OR when currency changes (locale symbol).
  }, [amountNgn, currency, duration, delay]);

  return (
    <span className={`tabular ${className}`}>
      {formatFromNgn(value, currency, { compact })}
      {suffix}
    </span>
  );
}
