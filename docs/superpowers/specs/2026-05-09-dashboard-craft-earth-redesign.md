# Dashboard Redesign — Craft Earth

**Date:** 2026-05-09
**Scope:** `src/components/features/Dashboard.tsx` + `src/styles/globals.css` + `tailwind.config.js`
**Status:** Approved

---

## Goal

Redesign the Dashboard to use the **Craft Earth** visual system — a deliberate, human-feeling aesthetic that avoids the generic "AI vibe-coded" look (dark bg + neon + glassmorphism). All existing functionality is preserved; only the visual presentation changes.

---

## Design System

### Tokens

| Token | Value | Usage |
|---|---|---|
| `--parchment` | `#f2ece0` | Page background |
| `--forest` | `#1c2b1e` | Borders, dark tiles, nav bar |
| `--forest-light` | `#a8c5a0` | Text on dark tiles, bar fills on dark bg |
| `--bark` | `#6b5d4f` | Secondary labels, meta text |
| `--cream` | `#ffffff` | Tile backgrounds |
| `--shadow` | `4px 4px 0 #1c2b1e` | Standard tile offset shadow |
| `--shadow-sm` | `3px 3px 0 #1c2b1e` | Small tile offset shadow |
| `--radius` | `10px` | Standard tile border radius |

### Typography

- **Font:** Space Grotesk (Google Fonts) — loaded via `@import` in `globals.css`
- **Big numbers:** `font-size: clamp(2.5rem, 5vw, 4rem)`, `font-weight: 700`, `letter-spacing: -0.05em`
- **Section labels:** `8–9px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.12em`, color `--bark`
- **Body / meta:** `10–11px`, `font-weight: 400–500`, color `--bark`

### Tile (core UI unit)

Every card is a "craft tile":

```
background: --cream
border: 1.5px solid --forest
border-radius: 10px
box-shadow: 4px 4px 0 --forest   ← the craft signature
```

Dark variant (`.tile-forest`):
```
background: --forest
(same border + shadow)
text color: --forest-light
```

No glassmorphism. No gradient text. No floating animations.

---

## Layout

### Mobile (default, < 768px)

- Single column, bottom navigation bar
- Sections stack vertically with `gap: 14px`
- Navigation: bottom bar with Dashboard / Log / Progress tabs

### Desktop (≥ 768px, `md:` breakpoint)

- **Top navigation bar** (forest green, full width): wordmark left, nav links centre, date right
- **3-column hero row:**
  - Col 1 (2fr): Carbon budget tile (dark)
  - Col 2 (1fr): Level + XP tile
  - Col 3 (1fr): Streak tile (dark)
- **4-column stats row:** Weekly total, Daily avg, Best day, Activities this week
- **2-column lower row:** Category breakdown (1.2fr) + Recent activities (1fr)
- Bottom navigation bar hidden on desktop; replaced by top nav

---

## Sections & Components

All existing sections are kept. Visual treatment per section:

### 1. Navigation

- **Mobile:** bottom bar, parchment background, forest icons, forest-light active state
- **Desktop:** top bar, forest background, parchment wordmark, forest-light active link

### 2. Hero — Carbon Budget Today

Replaces the `RadialBarChart`. Reason: the radial chart conflicts with the grid-native aesthetic and is harder to read at a glance.

- **Dark tile** (left / main on desktop)
- Big number: today's CO₂ used (`todayProgress.toFixed(1)`)
- Unit annotation: `kg CO₂e` + `of 12 kg` stacked beside the number with `gap: 5px` between lines — **not** inline
- Linear progress bar below the number (height 4–6px, forest-light fill on dark bg)
- Status badge: `On track` / `Running low` / `Over budget` with coloured dot
- Remaining budget shown as secondary stat in the same tile (desktop) or a paired tile (mobile)

### 3. Weekly Stats

Three tiles in a row: **Weekly total**, **Daily avg**, **Best day** (alternating light/dark)
- On desktop expands to four tiles, adding **Activities this week** (derived from `activities.filter(a => last7Days.includes(a.date)).length`)
- Data source: unchanged (`getWeekData()`, `weeklyData`)

### 4. Category Breakdown

Replaces the `PieChart`. Reason: pie chart wedges fight the rectilinear tile grid.

- Table-style rows inside a tile: dot · name · horizontal bar · percentage
- Forest tile header: "By Category"
- Bar fills use muted per-category colours (not the bright Tailwind palette)
- Empty state: same copy, styled consistently

### 5. Weekly Trend (Line Chart)

Kept as-is functionally. Restyled:
- Background: cream tile
- Line colour: `--forest`
- Axis text: `--bark`
- Remove default Recharts border/background

### 6. Gamification — Level & Streak

Two tiles side by side (both mobile and desktop):
- **Level tile** (dark): large level number, XP progress bar, `200 / 500 XP` sub-label
- **Streak tile** (light): large streak number, `consecutive days 🔥` sub-label

### 7. Activity Breakdown

Existing `<ActivityBreakdown>` component — apply craft tile wrapper, forest tile header.

### 8. Recent Activities

Forest tile header + row list:
- emoji · name · meta (category + time) · CO₂ value
- Dividers: `1px solid #ede7da`
- "Showing X of Y" footer if > 3 items

---

## Animations

Remove all existing `animate-float`, `animate-carbon-glow`, `animate-pulse-green`, `card-hover` CSS classes from Dashboard.

Replacements:
- **Entrance:** single `fadeInUp` (opacity 0→1, translateY 12px→0, duration 0.4s ease-out) applied once to `.app-content` wrapper — not per-card
- **Hover:** tiles get `transition: box-shadow 0.15s ease, transform 0.15s ease` with hover state `translateY(-2px)` and shadow `6px 6px 0 --forest`
- Progress bars: CSS width transition `0.6s ease-out` on mount

---

## Files Changed

| File | Change |
|---|---|
| `src/styles/globals.css` | Add Space Grotesk import; add craft token CSS vars; add `.tile`, `.tile-forest`, `.craft-shadow` utility classes. **Do not remove** existing `.glass`, `.glass-green`, `.gradient-text` etc. — they are still used by LogActivity and other pages. |
| `tailwind.config.js` | Add `Space Grotesk` to `fontFamily`; extend colours with craft tokens |
| `src/components/features/Dashboard.tsx` | Full visual rewrite — layout, tiles, replaced charts, responsive classes |
| `src/components/layout/Navigation.tsx` | Responsive: hide bottom nav on `md:`, add top nav on `md:` |

---

## What Does Not Change

- All data calculations (`getWeekData`, `getCategoryData`, `calculateGamificationStats`, `todayProgress`)
- `<ActivityBreakdown>` internal logic
- Activity data model and props interface
- Recharts `LineChart` (weekly trend) — restyled only
- Toast notifications
- All other pages (Log Activity, Progress)

---

## Acceptance Criteria

- [ ] Parchment background visible on Dashboard, no green gradient
- [ ] All tiles have hard offset shadow (`4px 4px 0 #1c2b1e`)
- [ ] Space Grotesk loads and applies to all Dashboard text
- [ ] RadialBarChart replaced with linear progress bar + split tile layout
- [ ] PieChart replaced with horizontal bar row breakdown
- [ ] Responsive: single column on mobile, top-nav + bento grid on `md:`
- [ ] Bottom nav hidden on desktop, top nav shown
- [ ] No `animate-float`, `gradient-text`, or `glass` classes on Dashboard
- [ ] All existing data (weekly stats, streak, level, activities) still displays correctly
- [ ] Empty states render correctly when no activities logged
