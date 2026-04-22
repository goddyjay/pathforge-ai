import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Sparkles } from "lucide-react";

export function PagePlaceholder({
  eyebrow,
  title,
  subtitle,
  description,
  icon: Icon,
  gradient,
  previewCards = [],
  primaryCta,
  onPrimaryCta,
}) {
  return (
    <motion.main
      className="max-w-[1400px] mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 md:p-10"
           style={{
             background: gradient,
             boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
           }}>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="max-w-2xl">
            <div className="eyebrow text-brand-300/90 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-400" />
              </span>
              {eyebrow}
            </div>
            <h1 className="display text-[28px] md:text-[36px] leading-[1.05] tracking-extra-tight text-white mt-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[15px] text-slate-300 mt-2 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-[13px] text-slate-400 mt-3 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
            {primaryCta && (
              <motion.button
                type="button"
                onClick={onPrimaryCta}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="btn-primary mt-5"
              >
                <Sparkles size={15} />
                {primaryCta}
                <ArrowUpRight size={14} />
              </motion.button>
            )}
          </div>

          {Icon && (
            <motion.div
              className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), 0 20px 40px -16px rgba(0,0,0,0.5)",
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon size={36} className="text-white" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Coming-soon banner */}
      <div className="mt-5 card p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "rgba(251, 191, 36, 0.12)",
            border: "1px solid rgba(251, 191, 36, 0.25)",
          }}
        >
          <Bell size={15} className="text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-white">
            This tool is in active development.
          </div>
          <div className="text-[12px] text-slate-400 mt-0.5">
            The AI engine is ready — the UI here is a preview of what's landing next.
            Try the Career Paths tool in the meantime.
          </div>
        </div>
      </div>

      {/* Preview cards */}
      {previewCards.length > 0 && (
        <motion.div
          className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {previewCards.map((card, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="card p-5"
            >
              <div className="eyebrow text-brand-300/80">{card.eyebrow}</div>
              <h3 className="display text-[17px] tracking-extra-tight text-white mt-1 leading-tight">
                {card.title}
              </h3>
              <p className="text-[12.5px] text-slate-400 mt-2 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.main>
  );
}
