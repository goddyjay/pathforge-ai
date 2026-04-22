import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

/**
 * Headless-ish dark-themed select. Replaces native <select> because browser
 * rendering of <option> on dark backgrounds is inconsistent (white-on-white on
 * some OSes). Accessible via keyboard (↑↓, Enter, Escape, Home/End) and clicks.
 *
 * options: [{ value, label, prefix?: ReactNode }]
 */
export function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon,
  placeholder = "Select...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const pick = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  const handleKey = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setHighlight(Math.max(0, options.findIndex((o) => o.value === value)));
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(options.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) pick(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKey}
        className={`field-input ${Icon ? "field-input-icon" : ""} pr-10 text-left flex items-center`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
        )}
        <span className="flex items-center gap-2 min-w-0 flex-1">
          {current?.prefix}
          <span className="truncate">{current?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            ref={listRef}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.2, 0.6, 0.2, 1] }}
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-white/[0.08]
                       bg-[#0a0b12]/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/40
                       max-h-64 overflow-y-auto"
          >
            {options.map((opt, i) => {
              const selected = opt.value === value;
              const active = i === highlight;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-idx={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(opt);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={
                    "w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition " +
                    (active
                      ? "bg-brand-500/15 text-white"
                      : "text-slate-300 hover:bg-white/[0.04]")
                  }
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {opt.prefix}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  {selected && <Check size={13} className="text-brand-300 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
