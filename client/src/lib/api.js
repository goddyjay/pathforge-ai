// Thanks to Vite's proxy (see vite.config.js), "/api" is forwarded to the
// Express backend during development. In production you'd set VITE_API_URL.
const API_BASE = import.meta.env.VITE_API_URL || "";

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!res.ok) {
    const fieldErrors = body.errors?.map((e) => `${e.path}: ${e.msg}`).join(", ");
    throw new Error(fieldErrors || body.message || `Request failed (${res.status})`);
  }

  return body.data;
}

/**
 * Single entry point for all AI recommendations. The backend dispatches on
 * `type` and applies the right module's validator + prompt.
 *
 * @param {"career_path"|"education_path"|"life_decision"} type
 * @param {object} payload   Module-specific fields
 * @param {object=} sharedContext  { profile, prior_results } — forwarded verbatim
 */
export function fetchRecommendation(type, payload, sharedContext) {
  const body = { type, ...payload };
  if (sharedContext) body.shared_context = sharedContext;
  return postJson("/api/recommendations", body);
}

// Thin wrappers kept for readability in page-level code.
export function fetchCareerPaths(payload, sharedContext) {
  return fetchRecommendation("career_path", payload, sharedContext);
}

export function fetchEducationPaths(payload, sharedContext) {
  return fetchRecommendation("education_path", payload, sharedContext);
}

export function fetchLifeDecisions(payload, sharedContext) {
  return fetchRecommendation("life_decision", payload, sharedContext);
}
