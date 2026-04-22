import { body } from "express-validator";
import { renderSharedContext } from "../services/claude.js";

const SYSTEM_PROMPT = `You are PathForge AI, a career advisor that maps personalized career paths.

Respond with ONLY a JSON object — no prose, no markdown, no code fences.

Use this EXACT schema:
{
  "career_paths": [
    {
      "title": "string — the career path name",
      "why_this_path": "string — 1-2 sentences explaining why this fits the user's profile",
      "starting_steps": ["string", "string"],
      "tools_to_learn": ["string", "string"],
      "income_progression": "string — short human-readable summary of entry / mid / senior income",
      "monthly_income_ngn": {
        "entry": 0,
        "mid": 0,
        "senior": 0
      },
      "time_to_first_income": "string — realistic timeline, e.g. '2-3 months'",
      "difficulty": "string — one of exactly: 'Beginner', 'Intermediate', 'Advanced'",
      "demand": "string — one of exactly: 'Low', 'Medium', 'High'",
      "confidence_score": 0,
      "fit_reasons": [
        {
          "dimension": "string — one of exactly: 'Interests', 'Budget', 'Experience', 'Time', 'Location'",
          "note": "string — one short sentence (max ~14 words) citing the user's actual input"
        }
      ],
      "two_year_projection": "string — 1-2 sentences describing likely situation after 2 years on this path",
      "pro_tips": ["string"],
      "roadmap": [
        {
          "period": "string — e.g. '0-3 months'",
          "focus": "string — 3-6 word theme for this phase",
          "milestones": ["string", "string"]
        }
      ]
    }
  ]
}

Rules:
- Return exactly 3 career paths, ORDERED BY BEST FIT FIRST (index 0 is the strongest match).
- starting_steps: 5-8 concrete, actionable first steps.
- tools_to_learn: 3-8 specific tools, skills, or technologies.
- income_progression: one string describing how income grows over time (for display flavor).
- monthly_income_ngn: ALWAYS in Nigerian Naira (NGN) monthly amounts. The frontend converts to the user's preferred currency.
- difficulty: exactly "Beginner", "Intermediate", or "Advanced".
- demand: exactly "Low", "Medium", or "High" — how in-demand this career is in the user's market.
- confidence_score: integer 0-100 — how strong a match this path is for the user's specific profile. Index 0 should be the highest score. Spread values so ranking is clear (e.g. 94 / 83 / 72).
- fit_reasons: exactly 3 entries. Each MUST reference one concrete fact from the user's profile (their interests list, budget amount, experience level, weekly time, or location). NO generic filler.
- two_year_projection: concrete, measurable outcome — mention a realistic monthly income, a likely role, or a tangible milestone.
- pro_tips: 3-4 short, actionable tips specific to breaking into this path (under ~18 words each).
- roadmap: 3-4 phases covering roughly the first 18-24 months. Each phase has 2-4 milestones.
- If the user has prior PathForge context (profile or past sessions), weave it into why_this_path and fit_reasons naturally — e.g. "Building on your education focus on data science…". Never invent context that isn't present.
- Do not include any keys other than those listed above.`;

const validators = [
  body("age").isInt({ min: 10, max: 80 }).withMessage("Age must be between 10 and 80"),
  body("interests").isArray({ min: 1 }).withMessage("Interests must be a non-empty array"),
  body("budget").isNumeric().withMessage("Budget must be a number"),
  body("experience_level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Experience level must be beginner, intermediate, or advanced"),
  body("education_level")
    .optional()
    .isIn(["high_school", "undergraduate", "graduate", "self_taught", "other"])
    .withMessage("Invalid education level"),
  body("location").optional().isString(),
  body("time_commitment")
    .optional()
    .isIn(["1-5", "5-10", "10-20", "20+"])
    .withMessage("Invalid time commitment"),
  body("goals").optional().isString().isLength({ max: 300 }),
];

function buildUserPrompt({
  age,
  interests,
  budget,
  experience_level,
  education_level,
  location,
  time_commitment,
  goals,
  shared_context,
}) {
  const lines = [
    `- Age: ${age}`,
    `- Interests: ${interests.join(", ")}`,
    `- Available learning budget (NGN): ₦${Number(budget).toLocaleString()}`,
    experience_level && `- Current experience level: ${experience_level}`,
    education_level && `- Education level: ${education_level.replace(/_/g, " ")}`,
    location && `- Location: ${location}`,
    time_commitment && `- Weekly time commitment: ${time_commitment} hours`,
    goals && `- Personal goals: ${goals}`,
  ].filter(Boolean);

  return `${renderSharedContext(shared_context)}Recommend 3 career paths for this profile:
${lines.join("\n")}

Tailor recommendations to their budget, available time, and experience level.`;
}

function validateResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }
  if (!Array.isArray(parsed.career_paths) || parsed.career_paths.length === 0) {
    throw new Error("career_paths must be a non-empty array");
  }

  const required = {
    title: "string",
    why_this_path: "string",
    starting_steps: "array",
    tools_to_learn: "array",
    income_progression: "string",
    time_to_first_income: "string",
    difficulty: "string",
    demand: "string",
    confidence_score: "number",
    fit_reasons: "array",
    two_year_projection: "string",
    pro_tips: "array",
    roadmap: "array",
    monthly_income_ngn: "object",
  };

  parsed.career_paths.forEach((path, i) => {
    for (const [key, type] of Object.entries(required)) {
      const value = path[key];
      let ok;
      if (type === "array") ok = Array.isArray(value);
      else if (type === "object") ok = value && typeof value === "object" && !Array.isArray(value);
      else ok = typeof value === type;
      if (!ok) {
        throw new Error(`career_paths[${i}].${key} is missing or not a ${type}`);
      }
    }

    const income = path.monthly_income_ngn;
    for (const tier of ["entry", "mid", "senior"]) {
      if (typeof income[tier] !== "number" || !Number.isFinite(income[tier])) {
        throw new Error(`career_paths[${i}].monthly_income_ngn.${tier} must be a number`);
      }
    }

    path.roadmap.forEach((phase, j) => {
      if (!phase || typeof phase !== "object") {
        throw new Error(`career_paths[${i}].roadmap[${j}] must be an object`);
      }
      if (typeof phase.period !== "string" || typeof phase.focus !== "string") {
        throw new Error(`career_paths[${i}].roadmap[${j}] missing period or focus`);
      }
      if (!Array.isArray(phase.milestones)) {
        throw new Error(`career_paths[${i}].roadmap[${j}].milestones must be an array`);
      }
    });

    path.fit_reasons.forEach((r, j) => {
      if (!r || typeof r !== "object") {
        throw new Error(`career_paths[${i}].fit_reasons[${j}] must be an object`);
      }
      if (typeof r.dimension !== "string" || typeof r.note !== "string") {
        throw new Error(`career_paths[${i}].fit_reasons[${j}] missing dimension or note`);
      }
    });

    if (path.confidence_score < 0 || path.confidence_score > 100) {
      throw new Error(`career_paths[${i}].confidence_score must be between 0 and 100`);
    }
  });
}

export default {
  type: "career_path",
  label: "Career Path",
  validators,
  systemPrompt: SYSTEM_PROMPT,
  buildUserPrompt,
  validateResponse,
  maxTokens: 4000,
};
