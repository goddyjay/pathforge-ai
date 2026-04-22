import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, RotateCw, Zap } from "lucide-react";
import { Brand } from "./Brand.jsx";
import { useDemo } from "../lib/demo.jsx";

const NAV_ITEMS = [
  { to: "/career", label: "Career" },
  { to: "/education", label: "Education" },
  { to: "/life", label: "Life" },
];

export function Navbar({ onTryAnother }) {
  const location = useLocation();
  const navigate = useNavigate();
  const demo = useDemo();
  const isCareer = location.pathname.startsWith("/career");

  function handleNewScenario() {
    if (isCareer && onTryAnother) {
      onTryAnother();
    } else {
      navigate("/career");
    }
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-0 -z-10 bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.06]" />
      <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between gap-6">
        <NavLink to="/career" className="flex items-center gap-2.5 group">
          <Brand size="sm" />
          <div className="text-left hidden sm:block">
            <div className="text-[15px] font-bold tracking-tight text-white leading-none display">
              PathForge<span className="text-brand-300">.</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 tracking-wide">
              Simulate. Plan. Shape Your Future.
            </div>
          </div>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "relative px-3 py-2 text-[13px] font-medium transition-colors duration-200 " +
                (isActive ? "text-white" : "text-slate-400 hover:text-white")
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-[5px] h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => {
              // Dispatch a "?" key event so KeyboardHelp's global listener opens it.
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="btn-ghost !p-2 hidden sm:inline-flex"
            title="Keyboard shortcuts (?)"
            aria-label="Show keyboard shortcuts"
          >
            <HelpCircle size={14} />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => demo?.startDemo()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            disabled={demo?.active}
            className="btn-primary !py-2 !px-4 text-[13px] disabled:opacity-60"
            style={{
              background: demo?.active
                ? "linear-gradient(180deg, #475569 0%, #334155 100%)"
                : "linear-gradient(180deg, #f59e0b 0%, #ea580c 100%)",
              boxShadow: demo?.active
                ? "none"
                : "inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 24px -8px rgba(245,158,11,0.5)",
            }}
          >
            <Zap size={13} />
            <span className="hidden sm:inline">
              {demo?.active ? "Demo running" : "Start Demo"}
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleNewScenario}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="btn-secondary !py-2 !px-3 text-[13px]"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">New</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
