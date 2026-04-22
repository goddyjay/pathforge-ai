import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  User,
  Wallet,
  TrendingUp,
  Clock,
  Target,
  UserCircle2,
  Lock,
  GraduationCap,
  Coins,
} from "lucide-react";
import { InterestsInput } from "./InterestsInput.jsx";
import { Input } from "./ui/Input.jsx";
import { CustomSelect } from "./ui/CustomSelect.jsx";
import { CountryAutocomplete } from "./ui/CountryAutocomplete.jsx";
import {
  CURRENCIES,
  CURRENCY_CODES,
  convertToNgn,
  convertFromNgn,
} from "../lib/currency.js";

const schema = z.object({
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int()
    .min(10, "Minimum age is 10")
    .max(80, "Maximum age is 80"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
  budget: z
    .number({ invalid_type_error: "Budget is required" })
    .min(0, "Budget can't be negative"),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  education_level: z.enum([
    "high_school",
    "undergraduate",
    "graduate",
    "self_taught",
    "other",
  ]),
  location: z.string().min(2, "Location is required"),
  time_commitment: z.enum(["1-5", "5-10", "10-20", "20+"]),
  goals: z.string().max(300, "Keep it under 300 characters").optional(),
});

const DEFAULT_BUDGET_NGN = 50000;

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const TIME_OPTIONS = [
  { value: "1-5", label: "1–5 hours / week" },
  { value: "5-10", label: "5–10 hours / week" },
  { value: "10-20", label: "10–20 hours / week" },
  { value: "20+", label: "20+ hours / week" },
];

const EDUCATION_OPTIONS = [
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "self_taught", label: "Self-taught" },
  { value: "other", label: "Other" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.05, duration: 0.35, ease: [0.2, 0.6, 0.2, 1] },
  }),
};

export function CareerForm({ onSubmit, loading, currency, onCurrencyChange, seed, defaults }) {
  // Base defaults, overridden by any fields we received from the shared
  // profile. Undefined overrides are ignored so the base values stand.
  const baseDefaults = {
    age: 22,
    interests: ["Technology", "Design"],
    budget: Math.round(convertFromNgn(DEFAULT_BUDGET_NGN, currency)),
    experience_level: "beginner",
    education_level: "undergraduate",
    location: "Nigeria",
    time_commitment: "5-10",
    goals: "",
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

  const submit = (values) => {
    const budgetNgn = Math.round(convertToNgn(values.budget, currency));
    onSubmit({ ...values, budget: budgetNgn });
  };

  // Demo-mode plumbing: when the parent hands down a new seed version, fill
  // the visible form AND kick off a submission on the user's behalf. A ref
  // guards against re-running when React re-renders without a new seed.
  const lastSeedVersionRef = useRef(null);
  useEffect(() => {
    if (!seed || seed.version === lastSeedVersionRef.current) return;
    lastSeedVersionRef.current = seed.version;
    reset(seed.values);
    // Give the reset one paint to land in the DOM before submitting, so the
    // judge visibly sees the form populate.
    const t = setTimeout(() => {
      handleSubmit(submit)();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const currencySymbol = CURRENCIES[currency]?.symbol ?? "₦";

  const currencyOptions = CURRENCY_CODES.map((code) => ({
    value: code,
    label: `${code} — ${CURRENCIES[code].label}`,
    prefix: (
      <span className="text-slate-400 text-[13px] w-3.5 text-center">
        {CURRENCIES[code].symbol}
      </span>
    ),
  }));

  return (
    <motion.form
      onSubmit={handleSubmit(submit)}
      className="card p-5 md:p-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
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
          <h3 className="text-sm font-semibold text-white">Tell us about yourself</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The more accurate your answers, the better your future map.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <Field label="Age" error={errors.age?.message}>
          <Input
            type="number"
            icon={User}
            {...register("age", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <CountryAutocomplete
                value={field.value}
                onChange={field.onChange}
                onSelectCountry={(c) => {
                  if (c.currency && CURRENCIES[c.currency]) {
                    onCurrencyChange?.(c.currency);
                  }
                }}
                error={errors.location?.message}
              />
            )}
          />
        </Field>
        <Field label="Preferred Currency">
          <CustomSelect
            icon={Coins}
            value={currency}
            onChange={(v) => onCurrencyChange?.(v)}
            options={currencyOptions}
          />
        </Field>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"
      >
        <Field label="Budget (Per Month)" error={errors.budget?.message}>
          <Input
            type="number"
            icon={Wallet}
            suffix={currencySymbol}
            {...register("budget", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Experience Level">
          <Controller
            control={control}
            name="experience_level"
            render={({ field }) => (
              <CustomSelect
                icon={TrendingUp}
                value={field.value}
                onChange={field.onChange}
                options={EXPERIENCE_OPTIONS}
              />
            )}
          />
        </Field>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"
      >
        <Field label="Weekly Time Commitment">
          <Controller
            control={control}
            name="time_commitment"
            render={({ field }) => (
              <CustomSelect
                icon={Clock}
                value={field.value}
                onChange={field.onChange}
                options={TIME_OPTIONS}
              />
            )}
          />
        </Field>
        <Field label="Education Level">
          <Controller
            control={control}
            name="education_level"
            render={({ field }) => (
              <CustomSelect
                icon={GraduationCap}
                value={field.value}
                onChange={field.onChange}
                options={EDUCATION_OPTIONS}
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
              value={field.value}
              onChange={field.onChange}
              error={errors.interests?.message}
            />
          )}
        />
      </motion.div>

      <motion.div variants={sectionVariants} className="mt-4">
        <label className="field-label flex items-center gap-1.5">
          Career Goals <span className="text-slate-500 normal-case tracking-normal">(Optional)</span>
        </label>
        <div className="relative">
          <Target
            size={16}
            className="pointer-events-none absolute left-3.5 top-3 text-slate-500"
          />
          <textarea
            rows={2}
            placeholder="e.g. I want to work remotely with international clients within 2 years."
            className="field-input field-input-icon resize-none"
            {...register("goals")}
          />
        </div>
        {errors.goals && <p className="field-error">{errors.goals.message}</p>}
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
              Generating your future...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate My Career Map
            </>
          )}
          {!loading && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{
                duration: 2.4,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 1.2,
              }}
              style={{
                background:
                  "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
              }}
            />
          )}
        </motion.button>
      </motion.div>

      <motion.p
        variants={sectionVariants}
        className="mt-2 text-center text-[11px] text-slate-500"
      >
        ~10 seconds to simulate · 3 paths ranked by fit
      </motion.p>

      <motion.p
        variants={sectionVariants}
        className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500"
      >
        <Lock size={11} />
        Your data is private. We use it only to generate your career paths.
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
          "radial-gradient(120% 100% at 100% 0%, rgba(124, 58, 237, 0.22) 0%, transparent 55%), radial-gradient(100% 80% at 0% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex items-start gap-4">
        <div className="flex-1">
          <div className="eyebrow text-brand-300/90 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-400" />
            </span>
            AI Career Simulation
          </div>
          <h2 className="display text-[22px] md:text-[26px] leading-[1.05] tracking-extra-tight text-white mt-2">
            See your <span className="text-gradient">next 5 years</span>
            <br />
            before you live them.
          </h2>
          <p className="text-[13px] text-slate-400 mt-2.5 leading-relaxed max-w-[34ch]">
            Simulate personalized career paths based on your real situation, goals, and the world today.
          </p>
        </div>
        <HeroOrb />
      </div>
    </div>
  );
}

function HeroOrb() {
  return (
    <motion.div
      className="relative shrink-0 w-[88px] h-[88px]"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(196,181,253,0.6) 25%, rgba(99,102,241,0.9) 55%, rgba(59,7,100,0.95) 85%)",
          boxShadow:
            "inset 0 -8px 14px rgba(0,0,0,0.35), 0 18px 36px -10px rgba(99,102,241,0.55)",
        }}
      />
      <div className="absolute top-3 left-4 w-4 h-3 rounded-full bg-white/75 blur-[2px]" />
      <div className="absolute top-[14px] left-[22px] w-1.5 h-1.5 rounded-full bg-white" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-black/60 blur-md" />
      <TrendingUp
        size={20}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.45))" }}
      />
    </motion.div>
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
