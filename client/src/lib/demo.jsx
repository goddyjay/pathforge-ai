import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./profile.jsx";
import { markOnboarded } from "./onboarding.js";

const DemoContext = createContext(null);

/**
 * Demo state machine. Each step maps to either a route or a sub-view:
 *   welcome    → OnboardingPage, welcome view
 *   user-type  → OnboardingPage, user-type view (auto-picks Student)
 *   education  → /education
 *   career     → /career
 *   life       → /life
 *   done       → terminal state; overlay shows "Demo complete"
 */
const STEP_SEQUENCE = [
  "welcome",
  "user-type",
  "education",
  "career",
  "life",
  "done",
];

/** 19-year-old Nigerian student, into tech + business. */
export const DEMO_EDUCATION_VALUES = {
  age: 19,
  country: "Nigeria",
  interests: ["Technology", "Business"],
  strengths: ["Math", "Problem solving", "Communication"],
  lifestyle: "flexible",
  budget: "low",
};

export const DEMO_CAREER_VALUES = {
  age: 19,
  interests: ["Technology", "Business"],
  budget: 50000, // NGN
  experience_level: "beginner",
  education_level: "undergraduate",
  location: "Nigeria",
  time_commitment: "10-20",
  goals:
    "Earn remotely while in school, break into tech or entrepreneurship within 2 years.",
};

export const DEMO_LIFE_VALUES = {
  age: 19,
  current_situation:
    "First-year university student in Lagos, living with family, passionate about tech and starting a business. Modest savings from side gigs.",
  income_level: "low",
  goals:
    "Graduate debt-free, start earning internationally by age 22, financial independence by 28.",
  risk_tolerance: "moderate",
};

export function DemoProvider({ children }) {
  const [step, setStep] = useState(null); // null = not running
  const active = step !== null && step !== "done";
  const navigate = useNavigate();
  const { clearAll } = useProfile();

  const startDemo = useCallback(() => {
    // Reset so the "PathForge remembers you" banner has a clean starting point
    // and accumulates context as the demo progresses — that itself is part of
    // the demo.
    clearAll();
    markOnboarded();
    setStep("welcome");
    navigate("/welcome");
  }, [clearAll, navigate]);

  const stopDemo = useCallback(() => {
    setStep(null);
  }, []);

  const advanceDemo = useCallback(() => {
    setStep((prev) => {
      if (prev === null) return null;
      const idx = STEP_SEQUENCE.indexOf(prev);
      return STEP_SEQUENCE[idx + 1] ?? "done";
    });
  }, []);

  // Side effect: navigate when step enters a route-bound stage. Welcome and
  // user-type both live on /welcome and are handled by OnboardingPage itself.
  useEffect(() => {
    if (step === "education") navigate("/education");
    else if (step === "career") navigate("/career");
    else if (step === "life") navigate("/life");
    else if (step === "done") {
      // Leave the user on /life so they can still read the final result.
    }
  }, [step, navigate]);

  // Auto-stop ~5 seconds after "done" so the completion toast has time to land.
  useEffect(() => {
    if (step !== "done") return;
    const t = setTimeout(() => setStep(null), 5000);
    return () => clearTimeout(t);
  }, [step]);

  // Global shortcut: ⌘K / Ctrl+K anywhere restarts the demo. Ignored when a
  // text input is focused so it doesn't hijack normal typing.
  useEffect(() => {
    function handler(e) {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        document.activeElement?.isContentEditable;
      if (isEditable) return;
      e.preventDefault();
      startDemo();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [startDemo]);

  const value = useMemo(
    () => ({ step, active, startDemo, stopDemo, advanceDemo }),
    [step, active, startDemo, stopDemo, advanceDemo]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  return useContext(DemoContext);
}

export function demoStepIndex(step) {
  return STEP_SEQUENCE.indexOf(step);
}

export const DEMO_STEP_LABELS = {
  welcome: "Welcome",
  "user-type": "Picking a persona",
  education: "Education Path",
  career: "Career Path",
  life: "Life Decisions",
  done: "Demo complete",
};

export const DEMO_TOTAL_STEPS = STEP_SEQUENCE.length - 1; // exclude "done"
