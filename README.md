# Bridgy

**Transparent, rule-based resource matching for neurodivergent minds.**

Bridgy helps people with ADHD, autism, dyslexia, anxiety, depression, and related conditions find the right tools and support — without black-box algorithms, data collection, or tracking. Every recommendation is deterministic and explainable.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Data Model](#data-model)
- [Scoring Engine](#scoring-engine)
- [AI Integration](#ai-integration)
- [Design System](#design-system)
- [Scripts](#scripts)

---

## Overview

Bridgy is a **static-first**, **privacy-first** web app. Users describe what they need — either by answering a short guided questionnaire or typing freely — and Bridgy matches them to a curated set of 32+ resources using a fully transparent, deterministic scoring engine.

There is no backend database, no user accounts, no analytics, and no data sent to third parties beyond an optional LLM call to parse free-text input. The entire matching logic lives in client-side code that anyone can read.

---

## Features

- **Two input modes** — guided 3-question flow (community → problem → urgency) or free-text natural language
- **Deterministic scoring** — same input always produces the same ranked results
- **Tabbed results view** — filter matched resources by urgency level (All / Low / Medium / High / Crisis)
- **"Why this?" toggle** — every card explains exactly which criteria matched
- **Next action prompts** — each resource includes a concrete first step
- **LLM-assisted parsing** — free text is parsed into structured intent via OpenRouter (with keyword fallback if no API key)
- **Graceful degradation** — fully functional without any API key
- **No data storage** — intent is passed entirely via URL query param, nothing is saved
- **Light mode design system** — soft shadows, rounded corners, Inter font

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Font | Inter (Google Fonts) |
| Icons | Lucide React |
| LLM Gateway | OpenRouter (GLM-4.5 → Gemini 2.0 Flash) |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
bridgy/
├── app/
│   ├── globals.css          # Design tokens (@theme inline), animations
│   ├── layout.tsx           # Root layout — Inter font, metadata
│   ├── page.tsx             # Landing page (ImageCarouselHero)
│   ├── flow/
│   │   └── page.tsx         # Input page — guided or free-text
│   ├── results/
│   │   └── page.tsx         # Tabbed results page
│   └── api/
│       ├── parse-intent/
│       │   └── route.ts     # POST — text → Intent JSON
│       └── explain/
│           └── route.ts     # POST — resource + intent → explanation
├── components/
│   ├── QuestionCard.tsx     # Multi-select chip group
│   ├── ResourceCard.tsx     # Resource row card
│   ├── WhyThisToggle.tsx    # Expandable match explanation
│   ├── NextActionCard.tsx   # "Next step" callout
│   └── ui/
│       └── image-carousel-hero.tsx  # Animated landing hero
├── lib/
│   ├── types.ts             # Shared TypeScript types
│   ├── resources.ts         # Static curated resource dataset (~32 entries)
│   ├── rules.ts             # Deterministic scoring engine
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
└── public/                  # Static assets
```

---

## How It Works

### 1. User inputs their need

**Guided mode** — the user selects:
- One or more **communities** they identify with (ADHD, autism, dyslexia, anxiety, depression, student, professional, parent)
- Their **main challenge** (planning, focus, task-initiation, overwhelm, sleep, etc.)
- **Urgency** level (low → crisis)
- Whether they want resources with **human support**

**Text mode** — the user types freely. The text is sent to `/api/parse-intent`, which calls an LLM to extract a structured `Intent` object. If no API key is set, a keyword-based fallback parser runs locally.

### 2. Intent is encoded in the URL

The resulting `Intent` object is JSON-encoded and passed as a `?q=` query parameter to `/results`. No server state is involved.

### 3. Scoring engine matches resources

`routeResources(intent)` scores all 32 resources against the intent:

| Criterion | Points |
|---|---|
| Community match (any overlap) | +3 |
| Problem match | +3 |
| Urgency match | +1 |
| Human support (when requested) | +2 |

Resources with score 0 are excluded. The rest are sorted descending.

### 4. Results are displayed

Matched resources are shown in a tabbed list, filterable by urgency. Each card shows the resource name, tags, description, a next-action prompt, and an expandable "Why this?" explanation.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/your-username/bridgy.git
cd bridgy
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Optional | API key from [openrouter.ai](https://openrouter.ai). Enables LLM-powered free-text parsing and empathetic explanation rewrites. If omitted, keyword-based fallbacks are used automatically. |

The app is fully functional without an API key.

> **Never commit `.env.local` to version control.** It is already listed in `.gitignore` by default.

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page with animated image carousel and feature highlights |
| `/flow` | Input page — guided questionnaire or free-text |
| `/results?q=...` | Results page — tabbed, filtered list of matched resources |
| `POST /api/parse-intent` | Parses a free-text message into a structured `Intent` object |
| `POST /api/explain` | Returns an empathetic explanation of why a resource was matched |

---

## Data Model

Defined in `lib/types.ts`:

```typescript
// Communities a user may identify with
type Community = "adhd" | "autism" | "dyslexia" | "anxiety" | "depression"
               | "student" | "professional" | "parent";

// Challenges or problems the user is experiencing
type Problem = "planning" | "task-initiation" | "focus" | "sensory" | "social"
             | "emotional-regulation" | "time-management" | "organization"
             | "motivation" | "sleep" | "communication" | "overwhelm";

type Urgency = "low" | "medium" | "high" | "crisis";

// A curated resource (app, community, hotline, etc.)
interface Resource {
  id: string;
  name: string;
  communities: Community[];
  problems: Problem[];
  urgency: Urgency;
  humanSupport: boolean;
  description: string;
  link: string;
  nextAction: string;  // A concrete first step the user can take right now
}

// The parsed intent from user input
interface Intent {
  communities: Community[];
  problem: Problem;
  timeframe: string;
  urgency: Urgency;
  wantsHumanHelp: boolean;
}
```

---

## Scoring Engine

Located in `lib/rules.ts`. Fully deterministic — no randomness, no ML, no personalization.

```typescript
export function routeResources(intent: Intent): ScoredResource[] {
  return resources
    .map((resource) => {
      let score = 0;
      if (resource.communities.some((c) => intent.communities.includes(c))) score += 3;
      if (resource.problems.includes(intent.problem)) score += 3;
      if (resource.urgency === intent.urgency) score += 1;
      if (intent.wantsHumanHelp && resource.humanSupport) score += 2;
      return { resource, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
```

Maximum possible score per resource: **9** (community + problem + urgency + human support).

---

## AI Integration

AI is used as a **thin parsing layer only** — it never influences which resources are recommended or how they are ranked.

### `POST /api/parse-intent`

Converts a free-text message into a structured `Intent` JSON object.

- Tries **GLM-4.5** first, falls back to **Gemini 2.0 Flash**
- 10-second timeout per model
- If both fail or no API key is set, a local **keyword fallback** parser runs instead
- All output is validated against the known enum values before use

### `POST /api/explain`

Rewrites the match explanation in a more empathetic, human tone.

- Same model cascade (GLM-4.5 → Gemini 2.0 Flash)
- Static fallback explanation used if LLM is unavailable

---

## Design System

Defined via Tailwind CSS v4 `@theme inline` in `app/globals.css`.

| Token | Value | Usage |
|---|---|---|
| `--color-base` | `#F4F6FB` | Page background |
| `--color-surface` | `#FFFFFF` | Elevated surfaces |
| `--color-card` | `#FFFFFF` | Cards |
| `--color-edge` | `#E3E5EA` | Borders |
| `--color-accent` | `#5B7CFA` | Primary interactive colour |
| `--color-bright` | `#1E2030` | Primary text |
| `--color-soft` | `#555B6E` | Secondary text |
| `--color-muted` | `#9AA0AA` | Placeholder / metadata text |

**Button conventions:**
- Primary: `bg-accent` + `box-shadow: 0 6px 14px rgba(91,124,250,0.35)` + `-translate-y-px` hover lift
- Secondary: white bg, `#E3E5EA` border, `0 2px 6px rgba(0,0,0,0.06)` shadow
- Destructive: `#FF8A8A` background

**Input conventions:**
- `border-radius: 12px`, `1px solid #E3E5EA`
- Focus ring: `0 0 0 3px rgba(91,124,250,0.18)` via inline `onFocus`

---

## Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (Next.js flat config + TypeScript rules)
```

---

## License

Private — all rights reserved.
