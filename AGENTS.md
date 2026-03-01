# AGENTS.md

## Build & Run Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint (flat config with next/core-web-vitals + typescript)
- No test framework is configured yet.

## Architecture
- **Next.js 16** App Router, React 19, TypeScript strict, Tailwind CSS v4.
- **Static-first**: SSG where possible. AI = interpreter, NOT recommender. No backend DB, no scraping.
- `lib/types.ts` — shared types (Resource, Intent, Community, Problem, Urgency).
- `lib/resources.ts` — static curated dataset (~32 resources). No external data.
- `lib/rules.ts` — deterministic scoring engine (`routeResources(intent)`). Heart of the app.
- `app/api/parse-intent/route.ts` — LLM text→Intent JSON (OpenRouter, keyword fallback if no key).
- `app/api/explain/route.ts` — LLM empathetic explanation rewrite (static fallback).
- `components/` — QuestionCard, ResourceCard, NextActionCard, WhyThisToggle.
- Pages: `/` (landing), `/flow` (input), `/results` (matched resources via URL `?q=` param).

## Code Style
- TypeScript strict. Use `import type { X }` for type-only imports.
- `export default function` for pages/components. Functional only, no classes.
- Tailwind utility classes only — custom theme tokens in `globals.css` `@theme inline` block.
- Double quotes, semicolons, 2-space indent. Props: inline `Readonly<{ ... }>`.
- Design: dark theme (bg-base/surface/card), accent (#6366f1), pill-shaped buttons, rounded-2xl cards.
