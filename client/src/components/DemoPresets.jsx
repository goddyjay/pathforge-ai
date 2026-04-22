import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Play, Zap } from "lucide-react";
import { DEMO_PRESETS } from "../lib/presets.js";

export function DemoPresets({ onRun }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="btn-secondary !py-2 !px-3 text-[13px]"
      >
        <Zap size={13} className="text-amber-300" />
        <span className="hidden sm:inline">Try Demo</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
            className="absolute right-0 mt-2 w-[320px] rounded-xl border border-white/[0.08]
                       bg-[#0a0b12]/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/40 overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-white">Demo scenarios</div>
                <div className="text-[11px] text-slate-400">
                  Auto-fills the form and runs instantly.
                </div>
              </div>
              <Zap size={14} className="text-amber-300" />
            </div>

            <ul>
              {DEMO_PRESETS.map((preset, i) => (
                <motion.li
                  key={preset.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onRun?.(preset);
                      setOpen(false);
                    }}
                    className="group w-full text-left flex items-start gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-white/[0.035] border border-white/[0.08] shrink-0">
                      <span aria-hidden="true">{preset.emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-white leading-tight">
                        {preset.title}
                      </div>
                      <div className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">
                        {preset.tagline}
                      </div>
                    </div>
                    <Play
                      size={12}
                      className="text-slate-500 group-hover:text-brand-300 mt-1 shrink-0 transition"
                    />
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="px-3 py-2 border-t border-white/[0.06] text-[10px] text-slate-500">
              Perfect for a 30-second demo.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
