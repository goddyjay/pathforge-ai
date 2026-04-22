import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Coins } from "lucide-react";
import { CURRENCIES, CURRENCY_CODES } from "../lib/currency.js";

export function CurrencySelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = CURRENCIES[value] ?? CURRENCIES.NGN;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium
                   text-slate-200 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]
                   transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Coins size={14} className="text-brand-300" />
        <span className="font-semibold">{current.code}</span>
        <span className="text-slate-500">{current.symbol}</span>
        <ChevronDown size={14} className={`text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10
                     bg-ink-900/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/30
                     overflow-hidden animate-fade-in z-50"
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-500 border-b border-white/5">
            Display currency
          </div>
          {CURRENCY_CODES.map((code) => {
            const c = CURRENCIES[code];
            const selected = code === value;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange?.(code);
                  setOpen(false);
                }}
                className={
                  "w-full flex items-center justify-between px-3 py-2 text-sm transition " +
                  (selected
                    ? "bg-brand-500/10 text-white"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white")
                }
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 text-center text-slate-400">{c.symbol}</span>
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-xs text-slate-500">{c.label}</span>
                </span>
                {selected && <Check size={14} className="text-brand-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
