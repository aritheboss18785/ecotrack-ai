# EcoTrack AI

A carbon footprint tracker that lets you log activities by writing it out. Instead of filling out forms with dropdowns and unit conversions, you describe what you did, something like "drove 20 miles to work" or "had a burger and fries for lunch" and Gemini figures out the CO₂.

## What it does

Three screens:

**Dashboard** : your carbon budget for the day, a weekly trend chart, a breakdown by category, and your recent activity log. It also has a streak system and XP leveling.

**Log Activity** : It has 5 different categories available (Transport, Food, Energy, Shopping, Waste) After picking one, describe what you did in plain English and press analyse. Gemini parses it into components with emission factors (a cheeseburger becomes beef 150g + bread 60g + cheese 20g), shows you the total CO₂e, and you can log it.

**Progress** : Displays showing your streak, monthly goal, week-by-week comparison, and achievements that are either earned or visibly locked.

## Getting started

You need a Gemini API key. Free tier is fine. Get one at [aistudio.google.com](https://aistudio.google.com).

```bash
npm install
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
npm run dev
```

Currently there is no backend or no database. All state is in-memory, so it resets on refresh.

## Deploy

```bash
npm run deploy
```

Builds and pushes to GitHub Pages.

## Stack

React, TypeScript, Vite, Tailwind CSS, Recharts, Radix UI. The AI parsing is a single call to `gemini-2.5-flash-lite` with a structured JSON response — `src/lib/llmParser.ts` is where that lives if you want to add emission factors or new categories. The emission factor database is in `src/lib/carbon/carbonEmissions.ts`.

## A few things worth knowing

Activity data doesn't persist between sessions yet. The streak counts consecutive days ending yesterday. Today's logs don't count until tomorrow. Emission factors are from EPA, FAO, and DEFRA sources.
