import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CareerForm } from "../components/CareerForm.jsx";
import { CareerResults } from "../components/CareerResults.jsx";
import { ContextBanner } from "../components/ContextBanner.jsx";
import { TopLoader } from "../components/TopLoader.jsx";
import { fetchCareerPaths } from "../lib/api.js";
import {
  detectCurrencyFromLocation,
  convertFromNgn,
} from "../lib/currency.js";
import { DEMO_PRESETS } from "../lib/presets.js";
import { useProfile } from "../lib/profile.jsx";
import { DEMO_CAREER_VALUES, useDemo } from "../lib/demo.jsx";

export default function CareerPathsPage({ registerPageActions }) {
  const { profile, updateProfile, recordResult, buildSharedContext } = useProfile();
  const demo = useDemo();

  const [data, setData] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [scenarioNumber, setScenarioNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("NGN");
  const [currencyTouched, setCurrencyTouched] = useState(false);
  const [resultsView, setResultsView] = useState("grid");
  const [showFullCompare, setShowFullCompare] = useState(false);
  const [seed, setSeed] = useState(null);

  const formRef = useRef(null);
  const resultsRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Seed form defaults from the shared profile (shared fields only).
  const defaults = useMemo(
    () => ({
      age: profile.age,
      interests: profile.interests,
      location: profile.country,
      goals: profile.goals,
    }),
    // Capture once per mount so typing doesn't reset inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function handleSubmit(values) {
    setLoading(true);
    setError(null);

    if (!currencyTouched) {
      const detected = detectCurrencyFromLocation(values.location);
      if (detected) setCurrency(detected);
    }

    // Write the shared fields into the global profile before the request.
    updateProfile({
      age: values.age,
      country: values.location,
      interests: values.interests,
      goals: values.goals,
    });

    try {
      const result = await fetchCareerPaths(values, buildSharedContext());
      setData(result);
      setScenario(values);
      setScenarioNumber((n) => n + 1);
      setShowFullCompare(false);

      const top = result.career_paths?.[0];
      if (top?.title) {
        recordResult(
          "career_path",
          `Recommended: ${top.title}${
            typeof top.confidence_score === "number"
              ? ` (${Math.round(top.confidence_score)}% match)`
              : ""
          }`,
          top.title
        );
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCurrencyChange(code) {
    setCurrency(code);
    setCurrencyTouched(true);
  }

  function handleTryAnother() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      formRef.current?.querySelector("input, select, textarea")?.focus();
    }, 400);
  }

  function runDemo(preset) {
    const targetCurrency = preset.currency ?? currency;
    setCurrency(targetCurrency);
    setCurrencyTouched(true);

    const displayBudget = Math.round(
      convertFromNgn(preset.values.budget_ngn, targetCurrency)
    );

    setSeed({
      version: Date.now(),
      values: {
        age: preset.values.age,
        interests: preset.values.interests,
        budget: displayBudget,
        experience_level: preset.values.experience_level,
        education_level: preset.values.education_level,
        location: preset.values.location,
        time_commitment: preset.values.time_commitment,
        goals: preset.values.goals,
      },
    });

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const id = searchParams.get("preset");
    if (!id) return;
    const preset = DEMO_PRESETS.find((p) => p.id === id);
    if (preset) runDemo(preset);
    const next = new URLSearchParams(searchParams);
    next.delete("preset");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When it's this page's turn in the guided demo, seed the career form with
  // the demo payload and force NGN so the budget number reads correctly.
  useEffect(() => {
    if (!demo?.active || demo.step !== "career") return;
    setCurrency("NGN");
    setCurrencyTouched(false);
    setData(null);
    setError(null);
    setSeed({ version: Date.now(), values: DEMO_CAREER_VALUES });
  }, [demo?.active, demo?.step]);

  // After results land during the demo, dwell 6s then advance.
  useEffect(() => {
    if (!demo?.active || demo.step !== "career") return;
    if (!data) return;
    const t = setTimeout(() => demo.advanceDemo(), 6000);
    return () => clearTimeout(t);
  }, [data, demo?.active, demo?.step, demo?.advanceDemo]);

  useEffect(() => {
    registerPageActions?.({
      onTryAnother: handleTryAnother,
      onRunDemo: runDemo,
    });
    return () => registerPageActions?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <TopLoader />}

      <main className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div
          ref={formRef}
          className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24 self-start"
        >
          <CareerForm
            onSubmit={handleSubmit}
            loading={loading}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            seed={seed}
            defaults={defaults}
          />
        </div>
        <div ref={resultsRef} className="lg:col-span-8 xl:col-span-8 space-y-5">
          <ContextBanner currentType="career_path" />
          <CareerResults
            loading={loading}
            error={error}
            data={data}
            scenario={scenario}
            scenarioNumber={scenarioNumber}
            onTryAnother={handleTryAnother}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            view={resultsView}
            onViewChange={setResultsView}
            showFullCompare={showFullCompare}
            onShowFullCompare={setShowFullCompare}
          />
        </div>
      </main>
    </>
  );
}
