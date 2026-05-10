# EcoTrack AI

A carbon footprint tracker that lets you log activities by writing it out. Instead of filling out forms with dropdowns and unit conversions, you describe what you did, something like "drove 20 miles to work" or "had a burger and fries for lunch" and Gemini figures out the CO₂.

## What it does

Three screens:

**Dashboard** : your carbon budget for the day, a weekly trend chart, a breakdown by category, and your recent activity log. It also has a streak system and XP leveling.

**Log Activity** : It has 5 different categories available (Transport, Food, Energy, Shopping, Waste). After picking one, describe what you did in plain English and press analyse. Gemini parses it into components with emission factors (a cheeseburger becomes beef 150g + bread 60g + cheese 20g), shows you the total CO₂e, and you can log it.

**Progress** : Displays your streak, monthly goal, week-by-week comparison, and achievements that are either earned or visibly locked.

## Getting started

You need a Gemini API key. Free tier is fine. Get one at [aistudio.google.com](https://aistudio.google.com).

```bash
npm install
npm run dev
```

Create a `.env.local` file in the project root and put your Gemini key in it:

```bash
GEMINI_API_KEY=your_key_here
```

Do not use `VITE_GEMINI_API_KEY`. The Gemini key is only used by the serverless API route and should never be exposed to the browser.

There is no database yet. All state is in-memory, so it resets on refresh.

## Deploy

```bash
npm run deploy
```

Builds and pushes to GitHub Pages. The static app can run there, but GitHub Pages will not run the `/api/gemini` serverless route, so AI parsing will fall back to the offline parser.

For AI parsing in production, deploy on Vercel and set this environment variable in the Vercel project settings:

```bash
GEMINI_API_KEY=your_key_here
```

## Stack

React, TypeScript, Vite, Tailwind CSS, Recharts, Radix UI, and a Vercel serverless function. The AI parsing uses `gemini-2.5-flash-lite` with a structured JSON response. The client-side parser flow is in `src/lib/llmParser.ts`, and the server-side Gemini proxy is in `api/gemini.ts`. The emission factor database is in `src/lib/carbon/carbonEmissions.ts`.

## A few things worth knowing

Activity data doesn't persist between sessions yet. The streak counts consecutive days ending yesterday. Today's logs don't count until tomorrow. Emission factors are from EPA, FAO, and DEFRA sources.
