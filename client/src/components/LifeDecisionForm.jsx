import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Compass,
  Heart,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import { Input } from "./ui/Input.jsx";

const schema = z.object({
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int()
    .min(18, "Must be 18+")
    .max(100, "Max 100"),
  current_situation: z
    .string()
    .min(10, "Tell us a bit more about your current situation")
    .max(500, "Keep it under 500 characters"),
  income_level: z.enum(["low", "medium", "high"]),
  goals: z
    .string()
    .min(6, "What are you hoping for?")
    .max(500, "Keep it under 500 characters"),
  risk_tolerance: z.enum(["conservative", "moderate", "aggressive"]),
});

const INCOME_OPTIONS = [
  { value: "low", label: "Low", hint: "Just covering essentials" },
  { value: "medium", label: "Medium", hint: "Comfortable with some savings" },
  { value: "high", label: "High", hint: "Disposable income / investing" },
];

const RISK_OPTIONS = [
  {
    value: "conservative",
    label: "Conservative",
    hint: "Prioritize stability",
    icon: Shield,
  },
  {
    value: "moderate",
    label: "Moderate",
    hint: "Balanced trade-offs",
    icon: Compass,
  },
  {
    value: "aggressive",
    label: "Aggressive",
    hint: "Chase upside",
    icon: Zap,
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.6, 0.2, 1] },
  },
};

export function LifeDecisionForm({ onSubmit, loading, defaults, seed }) {
  const baseDefaults = {
    age: 32,
    current_situation:
      "Mid-career software engineer in Lagos, renting, no kids, decent savings.",
    income_level: "medium",
    goals:
      "Own a home in 5 years, retire comfortably by 55, build a side business.",
    risk_tolerance: "moderate",
  };
  const defaultValues = { ...baseDefaults };
  for (const [k, v] of Object.entries(defaults ?? {})) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    defaultValues[k] = v;
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const lastSeedVersionRef = useRef(null);
  useEffect(() => {
    if (!seed || seed.version === lastSeedVersionRef.current) return;
    lastSeedVersionRef.current = seed.version;
    reset(seed.values);
    const t = setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="card p-5 md:p-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <motion.div variants={sectionVariants}>
        <FormHero />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="mt-5 flex items-start gap-3 mb-5"
      >
        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-amber-300">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Tell the engine about you</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Be honest — the more specific, the sharper the simulation.
          </p>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Field label="Age" error={errors.age?.message}>
          <Input
            type="number"
            icon={User}
            {...register("age", { valueAsNumber: true })}
          />
        </Field>
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <Field
          label="Current situation"
          hint="Career, family, location, finances — the shape of your life today."
          error={errors.current_situation?.message}
        >
          <Textarea
            icon={Heart}
            rows={3}
            placeholder="e.g. Senior designer in Lagos, renting, married, one kid, ₦12M in savings."
            {...register("current_situation")}
          />
        </Field>
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <label className="field-label flex items-center gap-1.5">
          <Wallet size={11} className="text-amber-300" />
          Income level
        </label>
        <Controller
          control={control}
          name="income_level"
          render={({ field }) => (
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              options={INCOME_OPTIONS}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <Field
          label="Goals"
          hint="What does success in the next 5-10 years look like?"
          error={errors.goals?.message}
        >
          <Textarea
            icon={Target}
            rows={2}
            placeholder="e.g. Own a home, retire by 55, launch a side business."
            {...register("goals")}
          />
        </Field>
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <label className="field-label flex items-center gap-1.5">
          <TrendingUp size={11} className="text-amber-300" />
          Risk tolerance
        </label>
        <Controller
          control={control}
          name="risk_tolerance"
          render={({ field }) => (
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              options={RISK_OPTIONS}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.015 } : {}}
          whileTap={!loading ? { scale: 0.985 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="btn-primary w-full mt-5 relative overflow-hidden"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Simulating your options...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Simulate My Options
            </>
          )}
        </motion.button>
      </motion.div>

      <motion.p
        variants={sectionVariants}
        className="mt-2 text-center text-[11px] text-slate-500"
      >
        ~10 seconds · distinct options with pros, cons, and 5-year outcomes
      </motion.p>

      <motion.p
        variants={sectionVariants}
        className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500"
      >
        <Lock size={11} />
        Your answers stay private. Used only to run the simulation.
      </motion.p>
    </motion.form>
  );
}

function FormHero() {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-5 md:p-6 border border-white/[0.08]"
      style={{
        background:
          "radial-gradient(120% 100% at 100% 0%, rgba(251, 191, 36, 0.22) 0%, transparent 55%), radial-gradient(100% 80% at 0% 100%, rgba(244, 63, 94, 0.18) 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-amber-500/20 blur-3xl"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-start gap-4">
        <div className="flex-1">
          <div className="eyebrow text-amber-300/90 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
            </span>
            AI Decision Engine
          </div>
          <h2 className="display text-[22px] md:text-[26px] leading-[1.05] tracking-extra-tight text-white mt-2">
            Simulate the <span className="text-gradient">big choices</span>
            <br />
            before you commit.
          </h2>
          <p className="text-[13px] text-slate-400 mt-2.5 leading-relaxed max-w-[34ch]">
            Career switch, relocation, retirement, money moves — see how each
            plays out over the next decade.
          </p>
        </div>
        <motion.div
          className="shrink-0 w-[84px] h-[84px] rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(140deg, #f59e0b 0%, #ea580c 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.25), 0 18px 36px -10px rgba(245,158,11,0.55)",
          }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Compass size={36} className="text-white" />
        </motion.div>
      </div>
    </div>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div
      role="radiogroup"
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        const Icon = opt.icon;
        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={
              "relative text-left rounded-xl px-3 py-2.5 transition border " +
              (selected
                ? "bg-amber-500/10 border-amber-400/45 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "bg-white/[0.025] border-white/[0.07] text-slate-300 hover:bg-white/[0.05]")
            }
          >
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  size={14}
                  className={selected ? "text-amber-300" : "text-slate-500"}
                />
              )}
              <span className="text-[13px] font-semibold">{opt.label}</span>
            </div>
            {opt.hint && (
              <div className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                {opt.hint}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function Textarea({ icon: Icon, rows = 3, className = "", ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-3 text-slate-500"
        />
      )}
      <textarea
        rows={rows}
        className={`field-input ${Icon ? "field-input-icon" : ""} resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-slate-500 mt-1">{hint}</p>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
