import { motion } from "framer-motion";
import { Lightbulb, ShieldCheck, Hammer, Telescope } from "lucide-react";

const TIPS = [
  {
    icon: Lightbulb,
    title: "Your future is not fixed",
    body: "Small consistent actions today create massive opportunities tomorrow.",
  },
  {
    icon: ShieldCheck,
    title: "Be consistent",
    body: "Tiny daily steps compound into outsized results.",
  },
  {
    icon: Hammer,
    title: "Keep building",
    body: "Projects and shipped work beat certificates every time.",
  },
  {
    icon: Telescope,
    title: "Stay curious",
    body: "The world changes fast. Keep learning and adapting.",
  },
];

export function TipsBar() {
  return (
    <div className="card p-5">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
      >
        {TIPS.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.title}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
              className={
                "flex items-start gap-3 py-3 sm:py-0 " +
                (i === 0 ? "sm:pr-5" : i === TIPS.length - 1 ? "sm:pl-5" : "sm:px-5")
              }
            >
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Icon size={14} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white tracking-tight">
                  {tip.title}
                </div>
                <div className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                  {tip.body}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
