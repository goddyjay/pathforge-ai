// Demo presets — each represents a plausible, judge-friendly PathForge user.
// budget_ngn is the single source of truth; it's converted into the preset's
// display currency on load so the form numbers look natural.
export const DEMO_PRESETS = [
  {
    id: "broke-student",
    emoji: "🎓",
    title: "Broke student in Nigeria",
    tagline: "Tight budget, big hustle energy",
    values: {
      age: 19,
      interests: ["Technology", "Writing"],
      budget_ngn: 5000,
      experience_level: "beginner",
      education_level: "undergraduate",
      location: "Nigeria",
      time_commitment: "10-20",
      goals: "Earn online while in school so I can support myself and build skills that pay.",
    },
    currency: "NGN",
  },
  {
    id: "remote-grad",
    emoji: "💻",
    title: "Graduate chasing remote work",
    tagline: "Wants an international remote role within a year",
    values: {
      age: 24,
      interests: ["Technology", "Design", "Product"],
      budget_ngn: 100000,
      experience_level: "intermediate",
      education_level: "graduate",
      location: "Nigeria",
      time_commitment: "20+",
      goals:
        "Land a remote job at an international company within 12 months and double my income.",
    },
    currency: "NGN",
  },
  {
    id: "career-switcher",
    emoji: "🔄",
    title: "Career switcher (teacher → tech)",
    tagline: "US-based, weekends only, 18-month window",
    values: {
      age: 32,
      interests: ["Data", "Finance", "Engineering"],
      budget_ngn: 800000, // ~$500 USD
      experience_level: "beginner",
      education_level: "graduate",
      location: "United States",
      time_commitment: "5-10",
      goals:
        "Transition from teaching into tech within 18 months without going broke during the switch.",
    },
    currency: "USD",
  },
];
