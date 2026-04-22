import Anthropic from "@anthropic-ai/sdk";
import { body, validationResult } from "express-validator";
import { runClaudeModule, ClaudeJsonError } from "../services/claude.js";
import { getModule, MODULE_TYPES } from "../modules/index.js";

// Top-level validators that always run first. Module-specific validators
// are applied once we know which module to dispatch to.
const typeValidator = body("type")
  .exists({ checkFalsy: true })
  .isIn(MODULE_TYPES)
  .withMessage(`type must be one of: ${MODULE_TYPES.join(", ")}`);

// Optional: the frontend may send a bundle of cross-session context so Claude
// can reference prior sessions. We validate shape loosely and trust frontend
// to curate what's in it.
const sharedContextValidator = body("shared_context")
  .optional()
  .isObject()
  .withMessage("shared_context must be an object");

async function runChains(req, chains) {
  for (const chain of chains) {
    await chain.run(req);
  }
}

export async function handleRecommendations(req, res) {
  // Step 1: validate `type` + shared_context envelope so we can dispatch
  await typeValidator.run(req);
  await sharedContextValidator.run(req);
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const mod = getModule(req.body.type);
  if (!mod) {
    // Shouldn't happen after typeValidator, but guard anyway.
    return res
      .status(400)
      .json({ success: false, message: `Unknown type: ${req.body.type}` });
  }

  // Step 2: run module-specific validators
  await runChains(req, mod.validators);
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Strip envelope fields before passing to the module. Modules receive their
  // own domain inputs plus the shared_context (so they can weave it into the
  // prompt without each module reimplementing the logic).
  // eslint-disable-next-line no-unused-vars
  const { type: _t, shared_context, ...payload } = req.body;
  payload.shared_context = shared_context;

  try {
    const aiResponse = await runClaudeModule(mod, payload);
    return res.status(200).json({
      success: true,
      data: { type: mod.type, user: payload, ...aiResponse },
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({
        success: false,
        message: "AI service authentication failed. Check your API key.",
      });
    }

    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({
        success: false,
        message: "AI service rate limit reached. Please try again shortly.",
      });
    }

    if (err instanceof ClaudeJsonError) {
      console.error(`[Recommendations:${mod.type}] JSON error:`, err.message);
      console.error(`[Recommendations:${mod.type}] Raw output:`, err.rawText);
      return res.status(502).json({
        success: false,
        message: "AI returned an unexpected response. Please try again.",
      });
    }

    console.error(`[Recommendations:${mod.type}]`, err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
