const TONE_STYLES = {
  brand: "bg-brand-500/15 text-brand-200 ring-brand-400/30",
  slate: "bg-white/[0.04] text-slate-300 ring-white/10",
  green: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30",
  amber: "bg-amber-500/15 text-amber-200 ring-amber-400/30",
  rose: "bg-rose-500/15 text-rose-200 ring-rose-400/30",
  purple: "bg-purple-500/15 text-purple-200 ring-purple-400/30",
  gold: "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-amber-200 ring-amber-300/40",
};

export function Badge({ tone = "slate", icon: Icon, children, className = "" }) {
  return (
    <span className={`badge ${TONE_STYLES[tone] ?? TONE_STYLES.slate} ${className}`}>
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

export function DifficultyBadge({ value }) {
  if (!value) return null;
  const key = value.toLowerCase();
  const tone = key === "beginner" ? "green" : key === "intermediate" ? "amber" : "rose";
  return <Badge tone={tone}>{value}</Badge>;
}

export function DemandBadge({ value }) {
  if (!value) return null;
  const key = value.toLowerCase();
  const tone = key === "high" ? "green" : key === "medium" ? "amber" : "rose";
  return <Badge tone={tone}>{value} demand</Badge>;
}
