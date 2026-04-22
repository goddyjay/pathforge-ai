import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Animated number. Counts from 0 (or the previous value) up to `value` with
 * a smooth easing curve when it mounts or when `value` changes. Use for
 * confidence scores, fit percentages, or any numeric "reveal".
 *
 * Props:
 *   value    — target number
 *   duration — seconds (default 0.9)
 *   delay    — seconds to wait before starting (default 0)
 *   format   — fn(number) → string; defaults to Math.round
 *   suffix   — optional string appended (e.g. "%")
 */
export function CountUp({
  value,
  duration = 0.9,
  delay = 0,
  format = (v) => Math.round(v),
  suffix = "",
  className = "",
}) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current ?? 0;
    const controls = animate(from, value, {
      duration,
      delay,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        prevRef.current = value;
      },
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return (
    <span className={`tabular ${className}`}>
      {format(display)}
      {suffix}
    </span>
  );
}
