import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "pathforge:profile-v1";
const MAX_PRIOR_RESULTS = 5;

/**
 * Shape of the globally shared user profile. All fields optional — they get
 * populated as the user interacts with the three modules and are reused as
 * form defaults on subsequent visits.
 *
 * @typedef {object} UserProfile
 * @property {number=} age
 * @property {string=} country
 * @property {string[]=} interests
 * @property {string=} goals
 *
 * @typedef {object} PriorResult
 * @property {"career_path"|"education_path"|"life_decision"} type
 * @property {string} summary      Short human-readable summary ("Top match: Full Stack Developer")
 * @property {string} topResult    The winner's label (decision / course / path title)
 * @property {number} timestamp    Date.now() when recorded
 */

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: {}, priorResults: [] };
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile ?? {},
      priorResults: Array.isArray(parsed.priorResults) ? parsed.priorResults : [],
    };
  } catch {
    return { profile: {}, priorResults: [] };
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const ProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const initial = useRef(loadFromStorage());
  const [profile, setProfile] = useState(initial.current.profile);
  const [priorResults, setPriorResults] = useState(initial.current.priorResults);

  // Persist on any change.
  useEffect(() => {
    saveToStorage({ profile, priorResults });
  }, [profile, priorResults]);

  /** Merge new fields into the shared profile. Undefined values are ignored. */
  const updateProfile = useCallback((patch) => {
    setProfile((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(patch ?? {})) {
        if (v === undefined || v === null) continue;
        if (Array.isArray(v) && v.length === 0) continue;
        if (typeof v === "string" && v.trim() === "") continue;
        next[k] = v;
      }
      return next;
    });
  }, []);

  /** Add a summary of a completed module run to the prior-results history. */
  const recordResult = useCallback((type, summary, topResult) => {
    setPriorResults((prev) => {
      const entry = { type, summary, topResult, timestamp: Date.now() };
      // Keep the newest-first, capped at MAX_PRIOR_RESULTS. Replace any prior
      // entry of the same type so we don't spam duplicates.
      const filtered = prev.filter((r) => r.type !== type);
      return [entry, ...filtered].slice(0, MAX_PRIOR_RESULTS);
    });
  }, []);

  const clearAll = useCallback(() => {
    setProfile({});
    setPriorResults([]);
  }, []);

  /** Package the profile + prior results into the payload sent to the API. */
  const buildSharedContext = useCallback(() => {
    const ctx = {};
    if (Object.keys(profile).length > 0) ctx.profile = profile;
    if (priorResults.length > 0) {
      ctx.prior_results = priorResults.map((r) => ({
        type: r.type,
        summary: r.summary,
        top_result: r.topResult,
      }));
    }
    return Object.keys(ctx).length > 0 ? ctx : undefined;
  }, [profile, priorResults]);

  const value = useMemo(
    () => ({
      profile,
      priorResults,
      updateProfile,
      recordResult,
      clearAll,
      buildSharedContext,
    }),
    [profile, priorResults, updateProfile, recordResult, clearAll, buildSharedContext]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside UserProfileProvider");
  return ctx;
}
