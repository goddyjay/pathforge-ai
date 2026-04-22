import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Briefcase, GraduationCap, Repeat } from "lucide-react";

const OPTIONS = [
  {
    key: "student",
    emoji: "🎓",
    icon: GraduationCap,
    title: "Student",
    subtitle: "I'm choosing what to study.",
    description:
      "Get course recommendations matched to your strengths, interests, and budget.",
    to: "/education",
    accent: {
      bg: "linear-gradient(140deg, #38bdf8 0%, #2563eb 100%)",
      glow: "rgba(56, 189, 248, 0.35)",
      halo: "rgba(56, 189, 248, 0.2)",
    },
    features: ["Best-fit programs", "Career outcomes", "Time to complete"],
  },
  {
    key: "career",
    emoji: "💼",
    icon: Briefcase,
    title: "Career Builder",
    subtitle: "I want my next career move.",
    description:
      "Personalized career paths with income projections, timelines, and a roadmap.",
    to: "/career",
    accent: {
      bg: "linear-gradient(140deg, #6366f1 0%, #7c3aed 100%)",
      glow: "rgba(99, 102, 241, 0.45)",
      halo: "rgba(124, 58, 237, 0.22)",
    },
    features: ["Income simulator", "2-year roadmap", "Pro tips"],
  },
  {
    key: "life",
    emoji: "🔄",
    icon: Repeat,
    title: "Life Planner",
    subtitle: "I'm weighing a big decision.",
    description:
      "Simulate career switches, relocation, retirement, or finances with pros, cons, and outcomes.",
    to: "/life",
    accent: {
      bg: "linear-gradient(140deg, #f59e0b 0%, #ea580c 100%)",
      glow: "rgba(245, 158, 11, 0.4)",
      halo: "rgba(234, 88, 12, 0.22)",
    },
    features: ["Distinct options", "Pros vs cons", "Long-term outcome"],
  },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] },
  },
};

export function UserTypeStep({ onSelect, onBack, highlightKey = null }) {
  return (
    <motion.div
      key="user-type"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className="min-h-[calc(100vh-0px)] flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="max-w-5xl w-full">
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="btn-ghost mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow text-brand-300/80"
          >
            Which one are you?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="display text-[30px] md:text-[44px] leading-[1.05] tracking-extra-tight text-white mt-3"
          >
            Pick the path that <span className="text-gradient">fits you today</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[14px] text-slate-400 mt-3 max-w-xl mx-auto"
          >
            You can always switch later — but starting in the right place makes
            the first run much sharper.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={listVariants}
        >
          {OPTIONS.map((option) => (
            <PathCard
              key={option.key}
              option={option}
              onSelect={onSelect}
              highlighted={highlightKey === option.key}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function PathCard({ option, onSelect, highlighted }) {
  const Icon = option.icon;
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option)}
      variants={cardVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      animate={
        highlighted
          ? { scale: [1, 1.03, 1], y: [0, -6, 0] }
          : undefined
      }
      transition={
        highlighted
          ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", stiffness: 300, damping: 24 }
      }
      className={
        "card card-hover p-6 text-left relative overflow-hidden group " +
        (highlighted ? "ring-2 ring-brand-400/60" : "")
      }
      style={
        highlighted
          ? {
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -24px rgba(99,102,241,0.5)",
            }
          : undefined
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: option.accent.halo }}
      />

      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: option.accent.bg,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.22), 0 14px 30px -10px ${option.accent.glow}`,
        }}
      >
        <Icon size={24} className="text-white" strokeWidth={2.2} />
      </div>

      <div className="relative mt-5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xl">
            {option.emoji}
          </span>
          <h3 className="display text-[20px] tracking-extra-tight text-white leading-tight">
            {option.title}
          </h3>
        </div>
        <p className="text-[13px] text-slate-300 mt-1.5 leading-relaxed">
          {option.subtitle}
        </p>
        <p className="text-[12.5px] text-slate-400 mt-2.5 leading-relaxed">
          {option.description}
        </p>
      </div>

      <ul className="relative mt-4 space-y-1.5">
        {option.features.map((f, i) => (
          <li
            key={i}
            className="text-[11.5px] text-slate-400 flex items-center gap-1.5"
          >
            <span className="w-1 h-1 rounded-full bg-brand-300/70" />
            {f}
          </li>
        ))}
      </ul>

      <div className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-200 group-hover:text-white transition">
        Continue as {option.title}
        <ArrowUpRight
          size={14}
          className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </motion.button>
  );
}
