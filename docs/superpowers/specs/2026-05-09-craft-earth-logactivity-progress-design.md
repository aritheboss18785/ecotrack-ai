# Craft Earth Theme — LogActivity, Progress, ActivityBreakdown

**Date:** 2026-05-09
**Scope:** Apply the Craft Earth design system to LogActivity.tsx, Progress.tsx, and ActivityBreakdown.tsx. Layout changes welcome; preserve the gamified/addicting feel.

---

## Design System Reference

Tokens (already in globals.css and tailwind.config.js):

| Token | Value | Usage |
|---|---|---|
| `--parchment` | `#f2ece0` | Page background |
| `--forest` | `#1c2b1e` | Dark tiles, borders, text |
| `--forest-light` | `#a8c5a0` | Text on dark tiles, bar fills |
| `--bark` | `#6b5d4f` | Secondary labels, meta text |
| `--cream` | `#fafaf8` | Light tile backgrounds |
| `--craft-shadow` | `4px 4px 0 #1c2b1e` | Hard offset shadow |

Utility classes: `.tile`, `.tile-forest`, `.tile-hover`, `.craft-label`, `.animate-craft-fade-in`

Classes to **remove** everywhere: `bg-nature-gradient`, `particles`, `glass`, `glass-green`, `gradient-text`, `btn-eco`, `animate-float`, `animate-pulse-green`, `animate-carbon-glow`, `animate-slideInUp`, `animate-fadeInScale`, `card-hover`

---

## Page Shell (both pages)

```
<div className="min-h-screen bg-parchment font-sans">
  <div className="p-4 flex flex-col gap-[14px] animate-craft-fade-in max-w-5xl mx-auto">
    ...
  </div>
</div>
```

---

## LogActivity.tsx

### Header
- Remove floating icon, gradient text, pulse animations
- craft-label `LOG ACTIVITY` above a `text-forest font-bold text-3xl` heading
- Bark-colored subtitle "Describe your daily activities naturally"

### Category Picker (2×3 grid)
- Grid of craft tiles: `tile tile-hover p-6 flex flex-col items-center gap-2`
- **Unselected:** cream bg, forest icon + forest label
- **Selected:** `tile-forest` (dark bg), forest-light icon + forest-light label
- Hard shadow on both states gives tactile feel — no `scale-105`, no glow
- Remove: `glass`, `glass-green`, `border-green-400`, `animate-fadeInScale`, `card-hover`

### Input Card (expanded when category selected)
- Wrapper: `tile overflow-hidden`
- **Forest header bar:** `bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light` — shows category name
- **Textarea:** `bg-cream border border-forest rounded-[8px]` — parchment/cream bg, forest border
- **Example phrases:** parchment-bg tile section instead of blue-50 box; bark-colored text, clickable rows
- **Loading state:** small `tile-forest` strip with spinner + `text-forest-light` "Analysing your activity..."
- **Results preview (AI result reveal):** `tile tile-forest` — big CO₂ number in `text-forest-light font-bold text-2xl`, "Gemini Analysis Result" in forest-light/60, breakdown list in forest-light/70. Dark tile makes the reveal feel like a reward moment.
- **"Analyse Activity" button:** `bg-forest text-parchment` + craft shadow, rounded-[8px], full width
- **"Log Activity" button:** same style — forest bg, parchment text, `+` icon prefix

### Quick Tips
- craft-label "HOW AI ANALYSIS WORKS"
- Light tile with each bullet as a bark-colored row (no blue-50, no blue-600)

---

## Progress.tsx

### Hero: Streak Tile (moved to top)
- Full-width `tile tile-forest p-[16px_20px]`
- Left: big flame emoji + streak number in `text-[clamp(2.5rem,5vw,4rem)] font-bold text-forest-light tracking-[-0.05em]`, "day streak" craft-label in forest-light/60 below
- Right: motivational line "Keep logging to maintain your streak" in `text-forest-light/50 text-xs`
- This is the first element on the page — makes streak feel like a live score

### Monthly Goal
- craft-label "MONTHLY GOAL"
- Light tile: big CO₂ number in forest, "of 250 kg CO₂e" in bark below
- Progress bar: `[&>div]:bg-forest` fill, parchment track
- If over 100% target: bar fill switches to amber `#c17f4a` (earthy, fits palette)
- Status text in bark

### Weekly Comparison
- Tile with forest header bar "WEEKLY PROGRESS"
- Four bar rows: under-target → forest-light fill; over-target → amber `#c17f4a` fill
- Week labels in bark, emission values in forest

### Achievements (elevated, 2-column grid)
- craft-label "ACHIEVEMENTS" section header
- **Earned:** `tile tile-forest tile-hover` — large emoji, title in `text-forest-light font-semibold text-sm`, `EARNED` micro-label in `text-[9px] uppercase tracking-wide text-forest-light/60`
- **Unearned:** `tile tile-hover opacity-50` — same layout, faded. The contrast earned/unearned makes earning feel genuinely rewarding.

### Eco Tips
- craft-label "ECO TIPS"
- Light tile, each tip a bark-colored row with a `·` bullet separator
- Remove all blue-50, blue-200, blue-700 colors

---

## ActivityBreakdown.tsx

This component is embedded in the Dashboard (already in a craft tile with forest header). Internals must match.

### Date Group Headers
- Remove Shadcn `Card`/`CardHeader`/`CardTitle`
- craft-label row: date left, "X.XX kg CO₂e · N activities" right in bark
- `border-b border-[#d8cfc0]` separator

### Activity Rows
- Each row: `tile tile-hover p-3` div (no Shadcn Card)
- Left: emoji + `text-forest font-medium text-sm capitalize` category + bark text-xs item name below
- Right: forest CO₂ value, bark time text-xs
- Expand chevron: forest color

### Expanded Detail Panel
- `border-t border-[#d8cfc0] pt-3 mt-2`
- 2-column grid: craft-label keys + forest-colored values
- "Based on scientific emission factors" in bark italic at bottom

### "AI Parsed" Badge
- Replace Shadcn Badge with: `text-[9px] uppercase tracking-wide text-forest-light bg-forest px-1.5 py-0.5 rounded-sm`

### Empty State
- Plain parchment div, bark text centered — no Shadcn Card wrapper

---

## What Does NOT Change
- All component logic, props, state management, data calculations
- The two-step UX flow on LogActivity (pick category → expand input)
- The existing `.glass`, `.glass-green`, `.gradient-text` classes in globals.css (still used by other components)
- Shadcn `Progress` bar component (restyled via Tailwind, not replaced)
- `Textarea`, `Label` Shadcn components (restyled only)
