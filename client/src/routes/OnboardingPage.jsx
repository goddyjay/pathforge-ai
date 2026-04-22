import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "../components/onboarding/WelcomeStep.jsx";
import { UserTypeStep } from "../components/onboarding/UserTypeStep.jsx";
import { markOnboarded } from "../lib/onboarding.js";
import { useDemo } from "../lib/demo.jsx";

export default function OnboardingPage() {
  const [localStep, setLocalStep] = useState("welcome");
  const navigate = useNavigate();
  const demo = useDemo();

  // In demo mode, the step shown is driven by the demo controller. Otherwise
  // it's just local view state.
  const demoStep = demo?.active ? demo.step : null;
  const step =
    demoStep === "user-type" ? "user-type" : demoStep === "welcome" ? "welcome" : localStep;

  // Auto-advance welcome → user-type while the demo is running.
  useEffect(() => {
    if (!demo?.active || demo.step !== "welcome") return;
    const t = setTimeout(() => demo.advanceDemo(), 3200);
    return () => clearTimeout(t);
  }, [demo?.active, demo?.step, demo?.advanceDemo]);

  // Auto-select Student on the user-type step during a demo.
  useEffect(() => {
    if (!demo?.active || demo.step !== "user-type") return;
    // Slight pause so the judge sees the cards land before selection.
    const t = setTimeout(() => {
      markOnboarded();
      demo.advanceDemo(); // advances to "education" → navigates to /education
    }, 2200);
    return () => clearTimeout(t);
  }, [demo?.active, demo?.step, demo?.advanceDemo]);

  function handleGetStarted() {
    setLocalStep("user-type");
  }

  function handleStartDemo() {
    demo?.startDemo();
  }

  function handleSelectType(option) {
    markOnboarded();
    navigate(option.to);
  }

  function handleBack() {
    setLocalStep("welcome");
  }

  return (
    <AnimatePresence mode="wait">
      {step === "welcome" ? (
        <WelcomeStep
          key="welcome"
          onGetStarted={handleGetStarted}
          onStartDemo={handleStartDemo}
        />
      ) : (
        <UserTypeStep
          key="user-type"
          onSelect={handleSelectType}
          onBack={handleBack}
          highlightKey={demo?.active && demo.step === "user-type" ? "student" : null}
        />
      )}
    </AnimatePresence>
  );
}
