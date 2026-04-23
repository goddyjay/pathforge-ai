# PathForge AI

**Simulate your career, education, and life decisions — before you live them.**

PathForge AI is a single AI-powered planning surface with three modules
(Career Paths, Education Paths, Life Decisions) that share one user profile,
one API, and one design language. Give it your age, interests, and goals — it
returns ranked, personalized options with confidence scores, pros/cons,
5-year projections, roadmaps, and actionable next steps.

Built as a hackathon-ready demo: no sign-up, all client-side state, and a
30-second guided tour (`⌘K`) that walks a judge through the full experience.

---

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/goddyjay/pathforge-ai.git
cd pathforge-ai
npm install
cd client && npm install && cd ..

# 2. Configure your Claude API key
cp .env.example .env
# then edit .env and set ANTHROPIC_API_KEY=...

# 3. Run the API (terminal 1)
npm run dev

# 4. Run the frontend (terminal 2)
cd client && npm run dev
```

Open http://localhost:5173.

- First visit → guided onboarding at `/welcome`.
- Press `⌘K` (or the **Start Demo** button) anywhere to play the scripted tour.
- Press `?` to see all keyboard shortcuts.

---

## What's inside

**Three AI planning modules — one system:**

- **Career Paths** — personalized career options with monthly income ranges,
  difficulty, market demand, a phase-by-phase roadmap, pro tips, and a
  2-year projection.
- **Education Paths** — program recommendations matched to interests,
  strengths, budget, and lifestyle; outputs time-to-complete, income
  potential, and possible careers per program.
- **Life Decisions** — simulates distinct options for big choices (career
  switch, relocation, retirement, finances) with pros, cons, risk level,
  and 5-year outcomes.

**Product polish:**

- Shared user profile that persists across modules — each module sees prior
  sessions and tunes its response (`"Building on your career session…"`).
- Smart currency system (NGN / USD / EUR / GBP) with country autocomplete
  and automatic detection from location.
- Guided onboarding flow (Student / Career Builder / Life Planner).
- Scripted demo mode that walks through all three modules in ~60 seconds.
- Framer Motion animations throughout: staggered card reveals, count-up
  numbers, draw-in SVG chart for income progression, pulsing risk badges.
- Keyboard shortcuts: `⌘K` to restart demo, `?` for help.

---

## Architecture

**Backend (Express)**

```
POST /api/recommendations
{ "type": "career_path" | "education_path" | "life_decision", ...payload, "shared_context"? }
```

Single entry point. The controller reads `type`, looks up the module in a
registry (`src/modules/index.js`), runs that module's `express-validator`
chain, calls Claude with the module's system prompt, validates the response
shape, and returns. Adding a new planning domain is a new file in `src/modules/`
plus a line in the registry — no controller or route changes.

**Frontend (React + Vite + Tailwind)**

- React Router 7 with three main routes and an onboarding route.
- `UserProfileProvider` (localStorage-backed) holds the cross-session profile
  and prior-results history, and packages them into `shared_context` on
  every request.
- Zod-validated forms (React Hook Form) with a shared `CountryAutocomplete`
  and dark-themed `CustomSelect`.
- Dark UI with glass surfaces, hairline borders, and `Inter` / `Inter Tight`
  typography.

---

## Project structure

```
pathforge-ai/
├── src/                                # Express backend
│   ├── app.js                          # single /api/recommendations route
│   ├── controllers/
│   │   └── recommendationsController.js
│   ├── modules/                        # one file per planning domain
│   │   ├── careerPath.js
│   │   ├── educationPath.js
│   │   ├── lifeDecision.js
│   │   └── index.js                    # registry
│   ├── routes/recommendations.js
│   ├── services/claude.js              # Anthropic SDK wrapper + renderSharedContext()
│   └── middleware/validate.js
├── client/                             # React frontend (Vite)
│   └── src/
│       ├── App.jsx                     # Router shell
│       ├── routes/                     # Route components
│       ├── components/                 # Cards, forms, results, onboarding, demo, UI
│       └── lib/                        # profile, demo, currency, presets, api, countries
└── server.js                           # entrypoint
```

---

## Stack

- **Backend:** Node 22 · Express 5 · express-validator · Anthropic SDK
- **Frontend:** React 18 · Vite · Tailwind · Framer Motion · React Router 7 · React Hook Form · Zod
- **Runtime AI model:** Claude Sonnet 4.6 (used by the app at inference time)

---

## Environment

Required in `.env` at the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

See `.env.example`.

---

## Credits

Designed and built pair-programming with **Claude Opus 4.7 (1M context)**.
The deployed app itself makes inference calls to **Claude Sonnet 4.6** for
the career, education, and life-decision modules.
