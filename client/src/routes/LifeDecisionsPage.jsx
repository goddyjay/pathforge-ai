import { useEffect, useMemo, useRef, useState } from "react";
import { LifeDecisionForm } from "../components/LifeDecisionForm.jsx";
import { LifeDecisionResults } from "../components/LifeDecisionResults.jsx";
import { ContextBanner } from "../components/ContextBanner.jsx";
import { TopLoader } from "../components/TopLoader.jsx";
import { fetchLifeDecisions } from "../lib/api.js";
import { useProfile } from "../lib/profile.jsx";
import { DEMO_LIFE_VALUES, useDemo } from "../lib/demo.jsx";

export default function LifeDecisionsPage() {
  const { profile, updateProfile, recordResult, buildSharedContext } = useProfile();
  const demo = useDemo();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(null);

  const formRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!demo?.active || demo.step !== "life") return;
    setData(null);
    setError(null);
    setSeed({ version: Date.now(), values: DEMO_LIFE_VALUES });
  }, [demo?.active, demo?.step]);

  useEffect(() => {
    if (!demo?.active || demo.step !== "life") return;
    if (!data) return;
    const t = setTimeout(() => demo.advanceDemo(), 6000);
    return () => clearTimeout(t);
  }, [data, demo?.active, demo?.step, demo?.advanceDemo]);

  const defaults = useMemo(
    () => ({
      age: profile.age,
      goals: profile.goals,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function handleSubmit(values) {
    setLoading(true);
    setError(null);

    updateProfile({
      age: values.age,
      goals: values.goals,
      country: profile.country, // pass-through; life form doesn't collect it
    });

    try {
      // Thread country through from the profile so Claude can reason about
      // local context (tax, cost of living) even though this form doesn't ask.
      const payload = profile.country
        ? { ...values, country: profile.country }
        : values;

      const result = await fetchLifeDecisions(payload, buildSharedContext());
      setData(result);

      if (result.recommended_choice) {
        recordResult(
          "life_decision",
          `Recommended: ${result.recommended_choice}`,
          result.recommended_choice
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

  function handleRetry() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      formRef.current?.querySelector("input, select, textarea")?.focus();
    }, 400);
  }

  return (
    <>
      {loading && <TopLoader />}

      <main className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div
          ref={formRef}
          className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24 self-start"
        >
          <LifeDecisionForm
            onSubmit={handleSubmit}
            loading={loading}
            defaults={defaults}
            seed={seed}
          />
        </div>
        <div ref={resultsRef} className="lg:col-span-8 xl:col-span-8 space-y-5">
          <ContextBanner currentType="life_decision" />
          <LifeDecisionResults
            loading={loading}
            error={error}
            data={data}
            onRetry={handleRetry}
          />
        </div>
      </main>
    </>
  );
}
