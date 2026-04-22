import { useEffect, useMemo, useRef, useState } from "react";
import { EducationForm } from "../components/EducationForm.jsx";
import { EducationResults } from "../components/EducationResults.jsx";
import { ContextBanner } from "../components/ContextBanner.jsx";
import { TopLoader } from "../components/TopLoader.jsx";
import { fetchEducationPaths } from "../lib/api.js";
import { useProfile } from "../lib/profile.jsx";
import { DEMO_EDUCATION_VALUES, useDemo } from "../lib/demo.jsx";

export default function EducationalPathsPage() {
  const { profile, updateProfile, recordResult, buildSharedContext } = useProfile();
  const demo = useDemo();

  const [data, setData] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(null);

  const formRef = useRef(null);
  const resultsRef = useRef(null);

  // When it's this page's turn in the demo, seed the form with the demo
  // payload. The form resets and auto-submits 500ms later.
  useEffect(() => {
    if (!demo?.active || demo.step !== "education") return;
    setData(null);
    setError(null);
    setSeed({ version: Date.now(), values: DEMO_EDUCATION_VALUES });
  }, [demo?.active, demo?.step]);

  // Once results arrive during a demo, linger for ~6s then advance.
  useEffect(() => {
    if (!demo?.active || demo.step !== "education") return;
    if (!data) return;
    const t = setTimeout(() => demo.advanceDemo(), 6000);
    return () => clearTimeout(t);
  }, [data, demo?.active, demo?.step, demo?.advanceDemo]);

  const defaults = useMemo(
    () => ({
      age: profile.age,
      country: profile.country,
      interests: profile.interests,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function handleSubmit(values) {
    setLoading(true);
    setError(null);

    updateProfile({
      age: values.age,
      country: values.country,
      interests: values.interests,
    });

    try {
      const result = await fetchEducationPaths(values, buildSharedContext());
      setData(result);
      setScenario(values);

      if (result.best_path) {
        recordResult(
          "education_path",
          `Best path: ${result.best_path}`,
          result.best_path
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
          <EducationForm
            onSubmit={handleSubmit}
            loading={loading}
            defaults={defaults}
            seed={seed}
          />
        </div>
        <div ref={resultsRef} className="lg:col-span-8 xl:col-span-8 space-y-5">
          <ContextBanner currentType="education_path" />
          <EducationResults
            loading={loading}
            error={error}
            data={data}
            scenario={scenario}
            onRetry={handleRetry}
          />
        </div>
      </main>
    </>
  );
}
