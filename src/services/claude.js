import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Thrown when Claude returned text we couldn't parse or that failed a module's
// shape validator. The controller uses this to return a 502 and log the raw
// output for debugging.
export class ClaudeJsonError extends Error {
  constructor(message, rawText) {
    super(message);
    this.name = "ClaudeJsonError";
    this.rawText = rawText;
  }
}

/**
 * Render the user's cross-session context (profile + prior results) into a
 * prompt block that modules can prepend to their own user message. Returns an
 * empty string when there's nothing meaningful to share.
 */
export function renderSharedContext(shared) {
  if (!shared || typeof shared !== "object") return "";
  const blocks = [];

  if (shared.profile && typeof shared.profile === "object") {
    const lines = [];
    const p = shared.profile;
    if (p.age) lines.push(`- Age: ${p.age}`);
    if (p.country) lines.push(`- Country: ${p.country}`);
    if (Array.isArray(p.interests) && p.interests.length) {
      lines.push(`- Interests: ${p.interests.join(", ")}`);
    }
    if (p.goals) lines.push(`- Long-term goals: ${p.goals}`);
    if (lines.length) {
      blocks.push(`The user's saved profile:\n${lines.join("\n")}`);
    }
  }

  if (Array.isArray(shared.prior_results) && shared.prior_results.length) {
    const lines = shared.prior_results
      .slice(0, 5)
      .map((r) => {
        const label = PRIOR_LABELS[r.type] ?? r.type;
        const detail = r.top_result
          ? `${label} — top result: ${r.top_result}`
          : `${label} — ${r.summary}`;
        return `- ${detail}`;
      });
    blocks.push(`Prior PathForge sessions (most recent first):\n${lines.join("\n")}`);
  }

  if (!blocks.length) return "";

  return `${blocks.join("\n\n")}

When relevant, reference this context naturally (e.g. "Building on your earlier career session…"). Don't repeat it back verbatim, and don't invent details that aren't present.

---

`;
}

const PRIOR_LABELS = {
  career_path: "Career session",
  education_path: "Education session",
  life_decision: "Life-decision session",
};

function extractJson(text) {
  let cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("No JSON object found in response");
  }
  return cleaned.slice(firstBrace, lastBrace + 1);
}

/**
 * Generic runner. Knows nothing about career / education / life — it just
 * wires a module's system prompt, user prompt, and response validator through
 * the Anthropic SDK.
 *
 * @param {object} mod - A module from src/modules/*
 * @param {object} input - The validated request payload (no `type` key)
 * @returns {Promise<object>} The parsed + validated AI response
 */
export async function runClaudeModule(mod, input) {
  const userPrompt = mod.buildUserPrompt(input);

  const response = await anthropic.messages.create({
    model: mod.model ?? "claude-sonnet-4-6",
    max_tokens: mod.maxTokens ?? 4000,
    system: [
      {
        type: "text",
        text: mod.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawText = response.content[0].text;

  let jsonString;
  try {
    jsonString = extractJson(rawText);
  } catch (err) {
    throw new ClaudeJsonError(err.message, rawText);
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new ClaudeJsonError("Claude returned malformed JSON", rawText);
  }

  try {
    mod.validateResponse(parsed);
  } catch (err) {
    throw new ClaudeJsonError(
      `Invalid ${mod.type} response shape: ${err.message}`,
      rawText
    );
  }

  return parsed;
}
