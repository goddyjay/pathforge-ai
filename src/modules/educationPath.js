import { body } from "express-validator";
import { renderSharedContext } from "../services/claude.js";

const SYSTEM_PROMPT = `You are PathForge AI, an education advisor who helps students pick the right course of study.

Respond with ONLY a JSON object — no prose, no markdown, no code fences.

Use this EXACT schema:
{
  "recommended_courses": [
    {
      "course": "string — the name of the course / program of study",
      "why_it_fits": "string — 1-2 sentences citing the user's specific interests, strengths, budget, or lifestyle",
      "possible_careers": ["string"],
      "time_to_complete": "string — e.g. '4 years', '18 months', '6-12 months'",
      "income_potential": "string — short description of entry-to-senior earning potential",
      "difficulty": "string — one of exactly: 'Beginner friendly', 'Moderate', 'Rigorous'",
      "fit_score": 0
    }
  ],
  "best_path": "string — MUST exactly match one of the course names in recommended_courses",
  "advice": "string — 2-3 sentences of concrete, personalized advice for this student based on their inputs"
}

Rules:
- Return between 3 and 5 recommended_courses, ORDERED BY BEST FIT FIRST.
- Reference the user's country when discussing realistic cost and available institutions — local public university, regional bootcamps, global online programs.
- possible_careers: 3-5 concrete job titles, not generic descriptors.
- fit_score: integer 0-100; index 0 should be the highest and correspond to best_path.
- best_path must be a verbatim string match with one of the course names.
- advice should reference at least one of the user's actual inputs (country, budget, strengths, lifestyle, etc.).
- If the user has prior PathForge context (profile or past career/life sessions), weave it into why_it_fits and advice naturally — e.g. "Given your career focus on product management…". Never invent context.
- Do not include any keys other than those listed above.`;

const validators = [
  body("age").isInt({ min: 10, max: 80 }).withMessage("Age must be between 10 and 80"),
  body("country").isString().isLength({ min: 2 }).withMessage("Country is required"),
  body("interests").isArray({ min: 1 }).withMessage("Pick at least one interest"),
  body("strengths").isArray({ min: 1 }).withMessage("Pick at least one strength"),
  body("lifestyle")
    .isIn(["remote", "office", "flexible"])
    .withMessage("Lifestyle must be remote, office, or flexible"),
  body("budget")
    .isIn(["low", "medium", "high"])
    .withMessage("Budget must be low, medium, or high"),
];

function buildUserPrompt({
  age,
  country,
  interests,
  strengths,
  lifestyle,
  budget,
  shared_context,
}) {
  const lines = [
    `- Age: ${age}`,
    `- Country: ${country}`,
    `- Interests: ${interests.join(", ")}`,
    `- Strengths: ${strengths.join(", ")}`,
    `- Preferred lifestyle: ${lifestyle}`,
    `- Budget level: ${budget}`,
  ].filter(Boolean);

  return `${renderSharedContext(shared_context)}Recommend the best course(s) of study for this student:
${lines.join("\n")}

Tailor recommendations to their country's education landscape, realistic cost for their budget level, and desired lifestyle.`;
}

function validateResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }
  if (!Array.isArray(parsed.recommended_courses) || parsed.recommended_courses.length === 0) {
    throw new Error("recommended_courses must be a non-empty array");
  }
  if (typeof parsed.best_path !== "string" || !parsed.best_path.trim()) {
    throw new Error("best_path must be a non-empty string");
  }
  if (typeof parsed.advice !== "string" || !parsed.advice.trim()) {
    throw new Error("advice must be a non-empty string");
  }

  const required = {
    course: "string",
    why_it_fits: "string",
    possible_careers: "array",
    time_to_complete: "string",
    income_potential: "string",
    difficulty: "string",
    fit_score: "number",
  };

  parsed.recommended_courses.forEach((c, i) => {
    for (const [key, type] of Object.entries(required)) {
      const value = c[key];
      const ok = type === "array" ? Array.isArray(value) : typeof value === type;
      if (!ok) {
        throw new Error(`recommended_courses[${i}].${key} is missing or not a ${type}`);
      }
    }
    if (c.fit_score < 0 || c.fit_score > 100) {
      throw new Error(`recommended_courses[${i}].fit_score must be between 0 and 100`);
    }
  });

  const titles = parsed.recommended_courses.map((c) => c.course);
  if (!titles.includes(parsed.best_path)) {
    parsed.best_path = titles[0];
  }
}

export default {
  type: "education_path",
  label: "Education Path",
  validators,
  systemPrompt: SYSTEM_PROMPT,
  buildUserPrompt,
  validateResponse,
  maxTokens: 3000,
};
