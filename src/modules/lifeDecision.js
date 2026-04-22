import { body } from "express-validator";
import { renderSharedContext } from "../services/claude.js";

const SYSTEM_PROMPT = `You are PathForge AI, a life-decision engine that simulates the long-term impact of major choices (career switch, relocation, retirement planning, financial direction, etc.).

Respond with ONLY a JSON object — no prose, no markdown, no code fences.

Use this EXACT schema:
{
  "options": [
    {
      "decision": "string — the concrete decision/option (e.g. 'Switch to product management in 2026', 'Keep renting for 5 more years')",
      "summary": "string — 1-2 sentence overview of what this choice entails",
      "pros": ["string"],
      "cons": ["string"],
      "risk_level": "string — one of exactly: 'Low', 'Medium', 'High'",
      "long_term_outcome": "string — 5-10 year outcome, with concrete numbers when possible",
      "confidence_score": 0
    }
  ],
  "recommended_choice": "string — MUST exactly match one of the options' 'decision' fields",
  "reasoning": "string — 2-4 sentences explaining why this is the recommended choice, citing at least one of the user's inputs (situation, goals, income, risk tolerance)"
}

Rules:
- Return 3-4 options, ORDERED BY BEST FIT FIRST. Options must be GENUINELY distinct — not variations of the same choice.
- Given the user's current situation and goals, infer which category of life decisions is most relevant (career, relocation, retirement, finances) and simulate options across that category.
- pros / cons: 3-5 concrete items each. No generic platitudes — reference numbers, timelines, or specific trade-offs.
- long_term_outcome: include a number or measurable outcome when realistic (monthly income, savings, age, retirement age, etc.). Match the user's country and income level.
- risk_level: exactly "Low", "Medium", or "High", and should ALIGN with the user's stated risk tolerance when the user asked for safer options, or disagree with clear justification in cons.
- confidence_score: integer 0-100; index 0 should have the highest score. Spread values so ranking is clear.
- recommended_choice MUST be a verbatim string match of one decision.
- reasoning MUST cite at least one of the user's inputs directly.
- If the user has prior PathForge context (profile or past sessions), weave it into reasoning naturally — e.g. "Given your education focus on finance…". Never invent context.
- Do not include any keys other than those listed above.`;

const validators = [
  body("age").isInt({ min: 18, max: 100 }).withMessage("Age must be between 18 and 100"),
  body("current_situation")
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage("Describe your current situation (10-500 chars)"),
  body("income_level")
    .isIn(["low", "medium", "high"])
    .withMessage("Income level must be low, medium, or high"),
  body("goals")
    .isString()
    .isLength({ min: 6, max: 500 })
    .withMessage("Describe your goals (6-500 chars)"),
  body("risk_tolerance")
    .isIn(["conservative", "moderate", "aggressive"])
    .withMessage("Risk tolerance must be conservative, moderate, or aggressive"),
  body("country").optional().isString(),
];

function buildUserPrompt({
  age,
  current_situation,
  income_level,
  goals,
  risk_tolerance,
  country,
  shared_context,
}) {
  const lines = [
    `- Age: ${age}`,
    country && `- Country: ${country}`,
    `- Current situation: ${current_situation}`,
    `- Income level: ${income_level}`,
    `- Goals: ${goals}`,
    `- Risk tolerance: ${risk_tolerance}`,
  ].filter(Boolean);

  return `${renderSharedContext(shared_context)}Simulate the best life-decision options for this person:
${lines.join("\n")}

Return distinct options, not variations. Ground numbers in their income level and country context.`;
}

function validateResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }
  if (!Array.isArray(parsed.options) || parsed.options.length === 0) {
    throw new Error("options must be a non-empty array");
  }
  if (typeof parsed.recommended_choice !== "string" || !parsed.recommended_choice.trim()) {
    throw new Error("recommended_choice must be a non-empty string");
  }
  if (typeof parsed.reasoning !== "string" || !parsed.reasoning.trim()) {
    throw new Error("reasoning must be a non-empty string");
  }

  const required = {
    decision: "string",
    summary: "string",
    pros: "array",
    cons: "array",
    risk_level: "string",
    long_term_outcome: "string",
    confidence_score: "number",
  };

  parsed.options.forEach((opt, i) => {
    for (const [key, type] of Object.entries(required)) {
      const value = opt[key];
      const ok = type === "array" ? Array.isArray(value) : typeof value === type;
      if (!ok) {
        throw new Error(`options[${i}].${key} is missing or not a ${type}`);
      }
    }
    if (!["Low", "Medium", "High"].includes(opt.risk_level)) {
      throw new Error(`options[${i}].risk_level must be Low, Medium, or High`);
    }
    if (opt.confidence_score < 0 || opt.confidence_score > 100) {
      throw new Error(`options[${i}].confidence_score must be between 0 and 100`);
    }
  });

  const decisions = parsed.options.map((o) => o.decision);
  if (!decisions.includes(parsed.recommended_choice)) {
    // Self-heal rather than fail the whole response.
    parsed.recommended_choice = decisions[0];
  }
}

export default {
  type: "life_decision",
  label: "Life Decision",
  validators,
  systemPrompt: SYSTEM_PROMPT,
  buildUserPrompt,
  validateResponse,
  maxTokens: 3000,
};
