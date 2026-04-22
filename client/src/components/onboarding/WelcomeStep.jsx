import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { BrandMark } from "../Brand.jsx";

export function WelcomeStep({ onGetStarted, onStartDemo }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4"
    >
      <div className="max-w-3xl w-full text-center relative">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/25 rounded-full blur-[140px]"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative flex flex-col items-center"
        >
          <BrandMark variant="token" size={56} animate />
          <div className="eyebrow text-brand-300/90 mt-5 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-400" />
            </span>
            Welcome to PathForge
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative display text-[40px] md:text-[64px] leading-[1.02] tracking-tightest text-white mt-6"
        >
          Forge your <span className="text-gradient">life path</span>
          <br />
          with AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="relative text-[15px] md:text-[17px] text-slate-300 mt-5 max-w-xl mx-auto leading-relaxed"
        >
          Career, Education, and Life Decisions — all in one place. Built for
          people who'd rather simulate the future than guess at it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="relative mt-8 flex flex-wrap gap-3 justify-center"
        >
          <motion.button
            type="button"
            onClick={onGetStarted}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="btn-primary !px-6 !py-3 text-[14px]"
          >
            <Sparkles size={15} />
            Get Started
            <ArrowRight size={15} />
          </motion.button>
          <motion.button
            type="button"
            onClick={onStartDemo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="btn-secondary !px-6 !py-3 text-[14px]"
          >
            <Zap size={15} className="text-amber-300" />
            Start Demo
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative mt-10 flex flex-col items-center gap-2 text-[11px] text-slate-500 tracking-wide"
        >
          <span>No signup required · 30 seconds to your first result</span>
          <span className="flex items-center gap-1.5 text-slate-600">
            Or press
            <span className="inline-flex items-center justify-center px-1.5 h-[18px] rounded bg-white/[0.05] border border-white/[0.1] text-[10px] font-semibold text-slate-300">
              ⌘
            </span>
            <span className="inline-flex items-center justify-center px-1.5 h-[18px] rounded bg-white/[0.05] border border-white/[0.1] text-[10px] font-semibold text-slate-300">
              K
            </span>
            anywhere to start the demo
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
