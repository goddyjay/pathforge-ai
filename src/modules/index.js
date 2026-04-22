import careerPath from "./careerPath.js";
import educationPath from "./educationPath.js";
import lifeDecision from "./lifeDecision.js";

// The single source of truth. To add a new module:
//   1. Create src/modules/<name>.js exporting { type, validators, systemPrompt,
//      buildUserPrompt, validateResponse }
//   2. Add it to the array below.
// The dispatcher, validator, and docs all read from MODULES.
const MODULE_LIST = [careerPath, educationPath, lifeDecision];

export const MODULES = Object.fromEntries(MODULE_LIST.map((m) => [m.type, m]));

export const MODULE_TYPES = MODULE_LIST.map((m) => m.type);

export function getModule(type) {
  return MODULES[type] ?? null;
}
