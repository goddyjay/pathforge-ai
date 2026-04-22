import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  User,
  Globe,
  Heart,
  Trophy,
  Laptop,
  Building2,
  Sparkle,
  Coins,
  Lock,
  UserCircle2,
  GraduationCap,
} from "lucide-react";
import { InterestsInput } from "./InterestsInput.jsx";
import { Input } from "./ui/Input.jsx";
import { CountryAutocomplete } from "./ui/CountryAutocomplete.jsx";

const schema = z.object({
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int()
    .min(10, "Minimum age is 10")
    .max(60, "Maximum age is 60"),
  country: z.string().min(2, "Country is required"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
  strengths: z.array(z.string()).min(1, "Pick at least one strength"),
  lifestyle: z.enum(["remote", "office", "flexible"]),
  budget: z.enum(["low", "medium", "high"]),
});

const STRENGTH_SUGGESTIONS = [
  "Math",
  "Writing",
  "Creativity",
  "Problem solving",
  "Communication",
  "Analysis",
  "Memory",
  "Public speaking",
  "Empathy",
  "Leadership",
  "Coding",
  "Drawing",
];

const LIFESTYLE_OPTIONS = [
  { value: "remote", label: "Remote", icon: Laptop, hint: "Work from anywhere" },
  { value: "office", label: "Office", icon: Building2, hint: "In-person, structured" },
  { value: "flexible", label: "Flexible", icon: Sparkle, hint: "Mix of both" },
];

const BUDGET_OPTIONS = [
  { value: "low", label: "Low", hint: "Free / scholarships / bootcamps" },
  { value: "medium", label: "Medium", hint: "Public uni / mid-tier programs" },
  { value: "high", label: "High", hint: "Top private / international" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.6, 0.2, 1] },
  },
};

export function EducationForm({ onSubmit, loading, defaults, seed }) {
  const baseDefaults = {
    age: 18,
    country: "Nigeria",
    interests: ["Technology", "Design"],
    strengths: ["Math", "Problem solving"],
    lifestyle: "flexible",
    budget: "medium",
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

  // Demo-mode plumbing: new seed version → reset + auto-submit.
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
        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-brand-300">
          <UserCircle2 size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Tell us about you</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            We'll suggest courses that match your profile and budget.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <Field label="Age" error={errors.age?.message}>
          <Input
            type="number"
            icon={User}
            {...register("age", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <CountryAutocomplete
                value={field.value}
                onChange={field.onChange}
                error={errors.country?.message}
              />
            )}
          />
        </Field>
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <InterestsInput
              label="Interests"
              value={field.value}
              onChange={field.onChange}
              error={errors.interests?.message}
              icon={Heart}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <Controller
          control={control}
          name="strengths"
          render={({ field }) => (
            <InterestsInput
              label="Strengths"
              value={field.value}
              onChange={field.onChange}
              error={errors.strengths?.message}
              suggestions={STRENGTH_SUGGESTIONS}
              placeholder="e.g. Math, writing, creativity"
              icon={Trophy}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <label className="field-label">Preferred lifestyle</label>
        <Controller
          control={control}
          name="lifestyle"
          render={({ field }) => (
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              options={LIFESTYLE_OPTIONS}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <label className="field-label flex items-center gap-1.5">
          <Coins size={11} className="text-brand-300" />
          Budget level
        </label>
        <Controller
          control={control}
          name="budget"
          render={({ field }) => (
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              options={BUDGET_OPTIONS}
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
              Finding the right courses...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Find My Best Course
            </>
          )}
        </motion.button>
      </motion.div>

      <motion.p
        variants={sectionVariants}
        className="mt-2 text-center text-[11px] text-slate-500"
      >
        ~10 seconds to run · 3–5 programs, ordered by fit
      </motion.p>

      <motion.p
        variants={sectionVariants}
        className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500"
      >
        <Lock size={11} />
        Your answers stay private. Used only to generate your recommendations.
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
          "radial-gradient(120% 100% at 100% 0%, rgba(56, 189, 248, 0.22) 0%, transparent 55%), radial-gradient(100% 80% at 0% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-sky-500/20 blur-3xl"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-start gap-4">
        <div className="flex-1">
          <div className="eyebrow text-sky-300/90 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
            </span>
            AI Education Planner
          </div>
          <h2 className="display text-[22px] md:text-[26px] leading-[1.05] tracking-extra-tight text-white mt-2">
            Pick the <span className="text-gradient">right course</span>
            <br />
            for the life you want.
          </h2>
          <p className="text-[13px] text-slate-400 mt-2.5 leading-relaxed max-w-[34ch]">
            Tell us about yourself and we'll map programs that match your
            interests, strengths, and budget.
          </p>
        </div>
        <motion.div
          className="shrink-0 w-[84px] h-[84px] rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(140deg, #38bdf8 0%, #2563eb 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.25), 0 18px 36px -10px rgba(56,189,248,0.55)",
          }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <GraduationCap size={36} className="text-white" />
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
                ? "bg-brand-500/15 border-brand-400/45 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "bg-white/[0.025] border-white/[0.07] text-slate-300 hover:bg-white/[0.05]")
            }
          >
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  size={14}
                  className={selected ? "text-brand-300" : "text-slate-500"}
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

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
