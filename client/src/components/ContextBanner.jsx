import { motion } from "framer-motion";
import { Brain, X } from "lucide-react";
import { useProfile } from "../lib/profile.jsx";

const LABELS = {
  career_path: "Career",
  education_path: "Education",
  life_decision: "Life Decision",
};

/**
 * Subtle "we remember you" strip shown above result sections when the user
 * has any profile data or prior-session history. Skips rendering when there's
 * nothing meaningful to surface.
 */
export function ContextBanner({ currentType, onClear }) {
  const { profile, priorResults, clearAll } = useProfile();

  const priorElsewhere = priorResults.filter((r) => r.type !== currentType);
  const hasProfile = Object.keys(profile).length > 0;

  if (!hasProfile && priorElsewhere.length === 0) return null;

  const profileChips = [
    profile.age && `${profile.age} years old`,
    profile.country,
    profile.interests?.length && `${profile.interests.slice(0, 2).join(", ")}${profile.interests.length > 2 ? "…" : ""}`,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-3 md:p-4 flex items-start gap-3"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(140deg, #6366f1, #7c3aed)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 14px -6px rgba(99,102,241,0.5)",
        }}
      >
        <Brain size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300/80">
          PathForge remembers you
        </div>
        <div className="text-[12.5px] text-slate-300 mt-1 leading-snug">
          {profileChips.length > 0 && (
            <>
              Using your profile{" "}
              <span className="text-slate-400">({profileChips.join(" · ")})</span>
            </>
          )}
          {profileChips.length > 0 && priorElsewhere.length > 0 && (
            <span className="text-slate-500"> + </span>
          )}
          {priorElsewhere.length > 0 && (
            <>
              context from{" "}
              {priorElsewhere.map((r, i) => (
                <span key={r.type}>
                  <span className="text-slate-200">{LABELS[r.type]}</span>
                  {i < priorElsewhere.length - 1 ? ", " : ""}
                </span>
              ))}
            </>
          )}
          . Recommendations are refined, not restarted.
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          clearAll();
          onClear?.();
        }}
        title="Clear saved profile"
        aria-label="Clear saved profile"
        className="btn-ghost !p-1.5"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
