import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Start the guided demo", alt: ["Ctrl", "K"] },
  { keys: ["?"], label: "Toggle this help" },
  { keys: ["Esc"], label: "Close this help" },
];

/**
 * Global keyboard shortcut help. Mounted once at the app level. Opens on
 * `?` (Shift+/) anywhere except inside editable fields. Closes on Esc, the
 * same key, clicking the backdrop, or the X button.
 */
export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e) {
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        document.activeElement?.isContentEditable;

      if (e.key === "Escape") {
        if (open) setOpen(false);
        return;
      }
      if (isEditable) return;
      // Shift+/ produces "?" on most layouts.
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="kbd-backdrop"
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="kbd-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="fixed left-1/2 top-1/2 z-[61] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 card p-5"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <header className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(140deg, #6366f1, #7c3aed)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 14px -6px rgba(99,102,241,0.5)",
                  }}
                >
                  <Keyboard size={15} className="text-white" />
                </div>
                <div>
                  <div className="eyebrow text-brand-300/80">Keyboard shortcuts</div>
                  <h3 className="display text-[17px] tracking-extra-tight text-white mt-0.5">
                    Get around faster
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost !p-1.5"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </header>

            <ul className="space-y-2">
              {SHORTCUTS.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.25 }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 bg-white/[0.025] border border-white/[0.06]"
                >
                  <span className="text-[13px] text-slate-200">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <Kbd key={j}>{k}</Kbd>
                    ))}
                    {s.alt && (
                      <>
                        <span className="text-[10px] text-slate-500 mx-1">or</span>
                        {s.alt.map((k, j) => (
                          <Kbd key={`alt-${j}`}>{k}</Kbd>
                        ))}
                      </>
                    )}
                  </span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] text-slate-500">
              Shortcuts are disabled while you're typing in a field.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }) {
  return (
    <span className="inline-flex items-center justify-center px-1.5 min-w-[22px] h-[22px] rounded bg-white/[0.06] border border-white/[0.1] text-[11px] font-semibold text-slate-200 tabular">
      {children}
    </span>
  );
}
