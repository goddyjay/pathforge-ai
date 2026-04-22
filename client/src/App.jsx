import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/Navbar.jsx";
import CareerPathsPage from "./routes/CareerPathsPage.jsx";
import EducationalPathsPage from "./routes/EducationalPathsPage.jsx";
import LifeDecisionsPage from "./routes/LifeDecisionsPage.jsx";
import OnboardingPage from "./routes/OnboardingPage.jsx";
import { isOnboarded } from "./lib/onboarding.js";
import { UserProfileProvider } from "./lib/profile.jsx";
import { DemoProvider } from "./lib/demo.jsx";
import { DemoOverlay } from "./components/DemoOverlay.jsx";
import { KeyboardHelp } from "./components/KeyboardHelp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <UserProfileProvider>
        <DemoProvider>
          <Shell />
          <DemoOverlay />
          <KeyboardHelp />
        </DemoProvider>
      </UserProfileProvider>
    </BrowserRouter>
  );
}

function Shell() {
  const [pageActions, setPageActions] = useState(null);
  const location = useLocation();
  const isOnboarding = location.pathname === "/welcome";

  return (
    <motion.div
      className="min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/15 rounded-full blur-[140px]"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 grid-bg opacity-[0.18] mask-fade-b" />
      </div>

      {!isOnboarding && (
        <Navbar
          onTryAnother={pageActions?.onTryAnother}
          onRunDemo={pageActions?.onRunDemo}
        />
      )}

      <RoutedContent registerPageActions={setPageActions} />

      {!isOnboarding && (
        <footer className="max-w-[1400px] mx-auto px-4 py-8 text-center text-xs text-slate-500 border-t border-white/5">
          <span className="text-slate-400">PathForge AI</span> · Built with React,
          Express & Claude.
        </footer>
      )}
    </motion.div>
  );
}

function RoutedContent({ registerPageActions }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<InitialRedirect />} />
          <Route path="/welcome" element={<OnboardingPage />} />
          <Route
            path="/career"
            element={<CareerPathsPage registerPageActions={registerPageActions} />}
          />
          <Route path="/education" element={<EducationalPathsPage />} />
          <Route path="/life" element={<LifeDecisionsPage />} />
          <Route path="*" element={<Navigate to="/career" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// First-visit users land on the guided onboarding; returning users go
// straight to the career dashboard.
function InitialRedirect() {
  return <Navigate to={isOnboarded() ? "/career" : "/welcome"} replace />;
}
