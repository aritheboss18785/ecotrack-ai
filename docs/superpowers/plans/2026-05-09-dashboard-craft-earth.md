# Dashboard Craft Earth Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Dashboard with the Craft Earth design system (parchment bg, forest green, hard offset shadows, Space Grotesk font) while keeping all data and functionality identical.

**Architecture:** Four files change — `globals.css` adds tokens and utility classes, `tailwind.config.js` adds named colours and shadows, `Navigation.tsx` becomes responsive (bottom bar on mobile, top bar on desktop), and `Dashboard.tsx` gets a full visual rewrite (no logic changes). `App.tsx` gets a minor flex-order tweak so the nav can move from bottom to top on desktop.

**Tech Stack:** React + TypeScript, Tailwind CSS v4, Recharts (LineChart kept; RadialBarChart and PieChart removed), Space Grotesk via Google Fonts.

**Spec:** `docs/superpowers/specs/2026-05-09-dashboard-craft-earth-redesign.md`

---

### Task 1: Design tokens, Space Grotesk, and Tailwind craft config

**Goal:** Add the Craft Earth design tokens, Space Grotesk font, and Tailwind colour/shadow extensions so every subsequent task can use named classes.

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.js`

**Acceptance Criteria:**
- [ ] `npm run build` passes with no new errors
- [ ] `bg-parchment`, `bg-forest`, `text-forest-light`, `text-bark`, `shadow-craft` are valid Tailwind classes
- [ ] `.tile`, `.tile-forest`, `.tile-hover`, `.craft-label`, `.animate-craft-fade-in` utility classes exist in globals.css

**Verify:** `npm run build` → `✓ built in` (no TypeScript errors)

**Steps:**

- [ ] **Step 1: Add Space Grotesk import and craft CSS vars to globals.css**

At the very top of `src/styles/globals.css`, before `@tailwind base`, add:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

Then add these vars inside the existing `:root` block (after the existing `--sidebar-ring` line):

```css
  /* Craft Earth design tokens */
  --parchment: #f2ece0;
  --forest: #1c2b1e;
  --forest-light: #a8c5a0;
  --bark: #6b5d4f;
  --cream: #ffffff;
  --craft-shadow: 4px 4px 0 #1c2b1e;
  --craft-shadow-sm: 3px 3px 0 #1c2b1e;
  --craft-shadow-lg: 6px 6px 0 #1c2b1e;
  --craft-radius: 10px;
```

- [ ] **Step 2: Add craft utility classes to globals.css**

Append to the end of `src/styles/globals.css`:

```css
/* ── Craft Earth utilities ── */

.tile {
  background: var(--cream);
  border: 1.5px solid var(--forest);
  border-radius: var(--craft-radius);
  box-shadow: var(--craft-shadow);
}

.tile-forest {
  background: var(--forest);
  border: 1.5px solid var(--forest);
  border-radius: var(--craft-radius);
  box-shadow: var(--craft-shadow);
}

.tile-hover {
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.tile-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--craft-shadow-lg);
}

.craft-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--bark);
}

@keyframes craftFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-craft-fade-in {
  animation: craftFadeIn 0.4s ease-out;
}
```

- [ ] **Step 3: Extend tailwind.config.js with craft colours and shadows**

Replace the `extend` block inside `tailwind.config.js` with:

```js
extend: {
  fontFamily: {
    sans: ['Space Grotesk', 'sans-serif'],
  },
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
    /* Craft Earth */
    parchment: '#f2ece0',
    forest: {
      DEFAULT: '#1c2b1e',
      light: '#a8c5a0',
    },
    bark: '#6b5d4f',
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
  boxShadow: {
    craft: '4px 4px 0 #1c2b1e',
    'craft-sm': '3px 3px 0 #1c2b1e',
    'craft-lg': '6px 6px 0 #1c2b1e',
  },
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
  },
},
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: `✓ built in` with no TypeScript errors (chunk size warning is pre-existing and fine).

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css tailwind.config.js
git commit -m "feat: add Craft Earth design tokens and Tailwind config"
```

---

### Task 2: Responsive Navigation + App layout

**Goal:** Make Navigation render as a bottom bar on mobile and a top bar (forest bg) on desktop; reorder App.tsx flex layout so the nav is at the top on desktop.

**Files:**
- Modify: `src/components/layout/Navigation.tsx`
- Modify: `src/App.tsx`

**Acceptance Criteria:**
- [ ] On mobile (< 768px): bottom nav bar with parchment background, forest border-top
- [ ] On desktop (≥ 768px): top nav bar with forest background, parchment wordmark, forest-light active links
- [ ] Active tab indicator works on both layouts
- [ ] `npm run build` passes

**Verify:** `npm run build` → `✓ built in`

**Steps:**

- [ ] **Step 1: Rewrite Navigation.tsx**

Replace the entire contents of `src/components/layout/Navigation.tsx` with:

```tsx
import React from 'react';
import { Home, Plus, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'log' | 'progress';
  onTabChange: (tab: 'dashboard' | 'log' | 'progress') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'log',       label: 'Log Activity', icon: Plus },
    { id: 'progress',  label: 'Progress', icon: TrendingUp },
  ] as const;

  return (
    <>
      {/* ── Mobile: bottom bar ── */}
      <div className="md:hidden bg-parchment border-t-2 border-forest px-4 py-3 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-150"
            >
              <Icon
                size={20}
                className={activeTab === id ? 'text-forest' : 'text-bark'}
              />
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                activeTab === id ? 'text-forest' : 'text-bark'
              }`}>
                {label}
              </span>
              {activeTab === id && (
                <div className="w-1 h-1 rounded-full bg-forest" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: top bar ── */}
      <div className="hidden md:flex bg-forest px-8 py-3 items-center justify-between z-50">
        <span className="text-parchment text-sm font-bold uppercase tracking-[0.12em]">
          EcoTrack
        </span>
        <div className="flex gap-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 ${
                activeTab === id
                  ? 'text-forest-light'
                  : 'text-parchment/40 hover:text-parchment/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-forest-light/40 uppercase tracking-[0.1em]">
          {new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Update App.tsx layout**

Replace the `return` block in `src/App.tsx` with:

```tsx
  return (
    <div className="h-screen bg-parchment flex flex-col">
      <div className="order-2 md:order-1 flex-shrink-0">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="order-1 md:order-2 flex-1 overflow-y-auto">
        {renderActiveScreen()}
      </div>
      <Toaster position="top-center" />
    </div>
  );
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 4: Visual check**

Open `http://localhost:5200`. Confirm:
- Mobile viewport (< 768px): bottom nav visible, parchment background, forest top border
- Desktop viewport (≥ 768px): top nav visible, forest background, EcoTrack wordmark on left, active link in forest-light

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navigation.tsx src/App.tsx
git commit -m "feat: responsive navigation — bottom bar mobile, top bar desktop"
```

---

### Task 3: Dashboard shell, hero section, and gamification tiles

**Goal:** Replace the Dashboard wrapper (parchment bg, no particles/glass), add the hero carbon budget tile, and the level + streak tiles.

**Files:**
- Modify: `src/components/features/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Dashboard background is parchment, no `bg-nature-gradient` or `particles` class
- [ ] Hero tile is dark (forest bg), shows `todayProgress.toFixed(1)` with stacked unit annotation
- [ ] Progress bar width reflects `usedPercentage` with a smooth transition
- [ ] Status badge shows correct text: `On track` / `Running low` / `Over budget`
- [ ] Level tile (light) and Streak tile (dark) render side-by-side on mobile, in hero grid on desktop
- [ ] All data calculations (todayProgress, gamificationStats) are unchanged
- [ ] `npm run build` passes

**Verify:** `npm run build` → `✓ built in`

**Steps:**

- [ ] **Step 1: Replace the Dashboard return — wrapper and hero section**

Keep all data calculation code (everything from `const today =` through `const gamificationStats = calculateGamificationStats();`) completely unchanged.

Replace only the `return (...)` block with the following. This step covers the wrapper + hero row only — subsequent tasks will add sections below `{/* weekly stats — added in Task 4 */}`:

```tsx
  return (
    <div className="min-h-screen bg-parchment font-sans">
      <div className="p-4 flex flex-col gap-[14px] animate-craft-fade-in max-w-5xl mx-auto">

        {/* Page heading — mobile only (desktop has top nav) */}
        <div className="md:hidden flex items-baseline justify-between">
          <span className="craft-label">Today's Overview</span>
          <span className="text-[10px] text-bark/60">
            {new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* ── Hero row: budget (2fr) + level (1fr) + streak (1fr) ── */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-[10px]">

          {/* Carbon budget tile (dark) */}
          <div className="tile tile-forest tile-hover p-[14px_16px]">
            <div className="craft-label" style={{ color: 'rgba(168,197,160,0.5)' }}>
              Carbon budget today
            </div>
            <div className="flex items-end gap-2 mt-1 mb-1">
              <div
                className="font-bold text-forest-light leading-none"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.05em' }}
              >
                {todayProgress.toFixed(1)}
              </div>
              <div className="flex flex-col pb-[3px]" style={{ gap: '5px' }}>
                <span className="text-[11px] font-semibold leading-none" style={{ color: 'rgba(168,197,160,0.7)' }}>
                  kg CO₂e
                </span>
                <span className="text-[9px] uppercase leading-none" style={{ color: 'rgba(168,197,160,0.4)', letterSpacing: '0.06em' }}>
                  of {dailyTarget} kg
                </span>
              </div>
            </div>
            <div
              className="h-[5px] rounded-sm overflow-hidden mt-2"
              style={{ background: 'rgba(168,197,160,0.15)', border: '1px solid rgba(168,197,160,0.2)' }}
            >
              <div
                className="h-full bg-forest-light rounded-sm transition-[width] duration-[600ms] ease-out"
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              />
            </div>
            <div className="text-[9px] mt-[5px]" style={{ color: 'rgba(168,197,160,0.45)' }}>
              {Math.min(usedPercentage, 100).toFixed(0)}% used · {remainingBudget.toFixed(1)} kg remaining
            </div>
            <div
              className="inline-flex items-center gap-[5px] mt-[10px] rounded-full px-[10px] py-[4px]"
              style={{ background: 'rgba(168,197,160,0.1)', border: '1px solid rgba(168,197,160,0.25)' }}
            >
              <div className={`w-[6px] h-[6px] rounded-full ${
                usedPercentage > 100 ? 'bg-red-400' : usedPercentage > 80 ? 'bg-yellow-400' : 'bg-forest-light'
              }`} />
              <span className="text-[10px] font-semibold text-forest-light uppercase tracking-[0.08em]">
                {usedPercentage > 100 ? 'Over budget' : usedPercentage > 80 ? 'Running low' : 'On track'}
              </span>
            </div>
          </div>

          {/* Level tile (light) */}
          <div className="tile tile-hover p-[10px_12px]">
            <div className="craft-label">Level</div>
            <div
              className="font-bold text-forest leading-none mt-1"
              style={{ fontSize: '30px', letterSpacing: '-0.04em' }}
            >
              {gamificationStats.level}
            </div>
            <div
              className="h-[4px] rounded-sm overflow-hidden mt-[8px]"
              style={{ background: '#e8e0d0', border: '1px solid #c8bca8' }}
            >
              <div
                className="h-full bg-forest rounded-sm transition-[width] duration-[600ms] ease-out"
                style={{ width: `${(gamificationStats.xp / gamificationStats.maxXp) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-bark mt-[5px]">
              {gamificationStats.xp} / {gamificationStats.maxXp} XP
            </div>
          </div>

          {/* Streak tile (dark) */}
          <div className="tile tile-forest tile-hover p-[10px_12px]">
            <div className="craft-label" style={{ color: 'rgba(168,197,160,0.5)' }}>Streak</div>
            <div
              className="font-bold text-forest-light leading-none mt-1"
              style={{ fontSize: '30px', letterSpacing: '-0.04em' }}
            >
              {gamificationStats.streak}
            </div>
            <div className="text-[9px] mt-[5px]" style={{ color: 'rgba(168,197,160,0.5)' }}>
              consecutive days 🔥
            </div>
          </div>
        </div>

        {/* weekly stats — added in Task 4 */}
        {/* category breakdown — added in Task 4 */}
        {/* weekly trend — added in Task 5 */}
        {/* activity breakdown — added in Task 5 */}
        {/* recent activities — added in Task 5 */}

      </div>
    </div>
  );
```

- [ ] **Step 2: Fix imports — remove unused, import Activity from canonical type**

At the top of `src/components/features/Dashboard.tsx`:

1. Remove these imports (no longer used):
   - `RadialBarChart`, `RadialBar` from recharts
   - `PieChart`, `Pie`, `Cell` from recharts
   - `Progress` from `../ui/progress`
   - `Flame`, `Trophy`, `Calendar`, `Zap` from `lucide-react`

2. Remove the locally-defined `Activity` and `DashboardProps` interfaces from the file. Replace them with an import from the canonical type (which has `itemName?`):

```tsx
import { Activity } from '../../types/activity';

interface DashboardProps {
  activities: Activity[];
}
```

Keep: `React`, `Card`/`CardContent`/`CardHeader`/`CardTitle` (used in Task 5), `LineChart`, `Line`, `XAxis`, `YAxis`, `ResponsiveContainer`, `Tooltip`, `ActivityBreakdown`.

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 4: Visual check**

Open `http://localhost:5200`. Confirm:
- Parchment background on Dashboard
- Hero dark tile with large CO₂ number and stacked unit annotation
- Progress bar fills proportionally
- Level tile and Streak tile visible below hero on mobile

- [ ] **Step 5: Commit**

```bash
git add src/components/features/Dashboard.tsx
git commit -m "feat: Dashboard craft shell, hero budget tile, and gamification tiles"
```

---

### Task 4: Weekly stats row and category breakdown

**Goal:** Add the weekly stats tiles (3 on mobile, 4 on desktop) and replace the PieChart with a horizontal bar breakdown tile.

**Files:**
- Modify: `src/components/features/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Three stat tiles render on mobile: Weekly total, Daily avg, Best day (alternating light/dark)
- [ ] Four stat tiles render on desktop, adding Activities this week
- [ ] Category breakdown is a tile with forest header + horizontal bar rows (no PieChart)
- [ ] Muted per-category dot colours (not bright Tailwind palette)
- [ ] Empty state renders when no activities logged
- [ ] `npm run build` passes

**Verify:** `npm run build` → `✓ built in`

**Steps:**

- [ ] **Step 1: Add weeklyActivityCount derived value**

In `Dashboard.tsx`, after the line `const gamificationStats = calculateGamificationStats();`, add:

```tsx
  const weeklyActivityCount = activities.filter(a => {
    const actDate = new Date(a.date + 'T00:00:00');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    return actDate >= weekAgo;
  }).length;
```

- [ ] **Step 2: Add category dot colours constant**

After the `weeklyActivityCount` line, add:

```tsx
  const categoryDotColors: Record<string, string> = {
    transport: '#d4e8d4',
    food:      '#e8d4c4',
    energy:    '#e8e4c4',
    shopping:  '#d4d4e8',
    waste:     '#e8d4d4',
  };
```

- [ ] **Step 3: Replace the weekly stats placeholder comment in the return**

Replace `{/* weekly stats — added in Task 4 */}` with:

```tsx
        {/* ── Section label ── */}
        <div className="craft-label border-b border-[#d8cfc0] pb-[6px]">This week</div>

        {/* ── Weekly stats tiles ── */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-[10px]">
          <div className="tile tile-hover p-[10px_12px]">
            <div className="craft-label">Weekly</div>
            <div className="text-[26px] font-bold text-forest leading-none mt-1" style={{ letterSpacing: '-0.04em' }}>
              {weeklyData.total}
            </div>
            <div className="text-[9px] text-bark mt-[3px]">kg CO₂e</div>
          </div>
          <div className="tile tile-forest tile-hover p-[10px_12px]">
            <div className="craft-label" style={{ color: 'rgba(168,197,160,0.5)' }}>Avg/day</div>
            <div className="text-[26px] font-bold text-forest-light leading-none mt-1" style={{ letterSpacing: '-0.04em' }}>
              {weeklyData.average}
            </div>
            <div className="text-[9px] mt-[3px]" style={{ color: 'rgba(168,197,160,0.5)' }}>kg CO₂e</div>
          </div>
          <div className="tile tile-hover p-[10px_12px]">
            <div className="craft-label">Best day</div>
            <div className="text-[26px] font-bold text-forest leading-none mt-1" style={{ letterSpacing: '-0.04em' }}>
              {weeklyData.bestDay}
            </div>
            <div className="text-[9px] text-bark mt-[3px]">kg CO₂e</div>
          </div>
          {/* desktop-only 4th tile */}
          <div className="hidden md:block tile tile-hover p-[10px_12px]">
            <div className="craft-label">Activities</div>
            <div className="text-[26px] font-bold text-forest leading-none mt-1" style={{ letterSpacing: '-0.04em' }}>
              {weeklyActivityCount}
            </div>
            <div className="text-[9px] text-bark mt-[3px]">this week</div>
          </div>
        </div>
```

- [ ] **Step 4: Replace the category breakdown placeholder comment**

Replace `{/* category breakdown — added in Task 4 */}` with:

```tsx
        {/* ── Category breakdown ── */}
        <div className="craft-label border-b border-[#d8cfc0] pb-[6px]">Breakdown</div>

        <div className="tile overflow-hidden">
          <div className="bg-forest px-[16px] py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            By Category
          </div>
          {categoryData.length === 0 ? (
            <div className="p-[16px] text-[11px] text-bark text-center">
              Log your first activity to see your breakdown
            </div>
          ) : (
            <div className="p-0">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-[10px] px-[16px] py-[8px] border-b border-[#ede7da] last:border-b-0"
                >
                  <div
                    className="w-[8px] h-[8px] rounded-sm flex-shrink-0"
                    style={{
                      background: categoryDotColors[cat.name.toLowerCase()] ?? '#e0d8cc',
                      border: '1.5px solid #1c2b1e',
                    }}
                  />
                  <span className="text-[11px] font-medium text-forest flex-1">{cat.name}</span>
                  <div className="w-[80px] h-[4px] bg-[#ede7da] rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-forest rounded-sm transition-[width] duration-[600ms] ease-out"
                      style={{ width: `${cat.value}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-forest w-[28px] text-right">{cat.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 6: Visual check**

Open `http://localhost:5200`. Confirm:
- Three stat tiles on mobile, four on desktop (Activities this week hidden on mobile)
- Category breakdown shows horizontal bar rows, no pie chart
- Empty state message shown when no activities logged

- [ ] **Step 7: Commit**

```bash
git add src/components/features/Dashboard.tsx
git commit -m "feat: Dashboard weekly stats grid and category breakdown tile"
```

---

### Task 5: Weekly trend, Activity Breakdown wrapper, and Recent Activities

**Goal:** Restyle the LineChart tile, wrap ActivityBreakdown in a craft tile, and add the Recent Activities section. This completes the Dashboard rewrite.

**Files:**
- Modify: `src/components/features/Dashboard.tsx`

**Acceptance Criteria:**
- [ ] Weekly trend is inside a cream tile; line colour is `#1c2b1e`, axis text is `#6b5d4f`, no Recharts default background
- [ ] ActivityBreakdown is wrapped in a craft tile with a forest header
- [ ] Recent Activities tile has a forest header, emoji + name + meta + CO₂ rows with `#ede7da` dividers
- [ ] "Showing 3 of N" footer appears when more than 3 activities exist
- [ ] No `Card`, `CardContent`, `CardHeader`, `CardTitle` imports remain in Dashboard (replaced by craft tiles)
- [ ] `npm run build` passes

**Verify:** `npm run build` → `✓ built in`

**Steps:**

- [ ] **Step 1: Replace the weekly trend placeholder comment**

Replace `{/* weekly trend — added in Task 5 */}` with:

```tsx
        {/* ── Weekly trend ── */}
        <div className="craft-label border-b border-[#d8cfc0] pb-[6px]">Weekly trend</div>

        <div className="tile p-[14px_16px]">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b5d4f' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b5d4f' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  formatter={(value) => [`${value} kg CO₂e`, 'Emissions']}
                  contentStyle={{
                    background: '#fff',
                    border: '1.5px solid #1c2b1e',
                    borderRadius: '8px',
                    boxShadow: '3px 3px 0 #1c2b1e',
                    fontSize: '11px',
                    color: '#1c2b1e',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1c2b1e"
                  strokeWidth={2}
                  dot={{ fill: '#1c2b1e', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#1c2b1e', strokeWidth: 2, stroke: '#f2ece0' }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
```

- [ ] **Step 2: Replace the activity breakdown placeholder comment**

Replace `{/* activity breakdown — added in Task 5 */}` with:

```tsx
        {/* ── Activity breakdown ── */}
        <div className="tile overflow-hidden">
          <div className="bg-forest px-[16px] py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            Activity Breakdown
          </div>
          <div className="p-[14px_16px]">
            <ActivityBreakdown activities={activities} />
          </div>
        </div>
```

- [ ] **Step 3: Replace the recent activities placeholder comment**

Replace `{/* recent activities — added in Task 5 */}` with:

```tsx
        {/* ── Recent activities ── */}
        {activities.length > 0 && (
          <>
            <div className="craft-label border-b border-[#d8cfc0] pb-[6px]">Recent</div>
            <div className="tile overflow-hidden">
              <div className="bg-forest px-[16px] py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
                Recent Activities
              </div>
              {activities
                .slice(-3)
                .reverse()
                .map((activity) => {
                  const categoryEmoji: Record<string, string> = {
                    transport: '🚗',
                    food:      '🍽️',
                    energy:    '⚡',
                    shopping:  '🛍️',
                    waste:     '🗑️',
                  };
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-[12px] px-[16px] py-[9px] border-b border-[#ede7da] last:border-b-0"
                    >
                      <span className="text-base w-[28px] text-center">
                        {categoryEmoji[activity.category] ?? '📝'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-forest truncate">
                          {activity.itemName ?? activity.category} · {activity.amount} {activity.unit}
                        </div>
                        <div className="text-[10px] text-bark mt-[1px]">
                          {activity.date === today ? 'Today' : activity.date} at {activity.time}
                        </div>
                      </div>
                      <div className="text-[12px] font-bold text-forest flex-shrink-0">
                        {activity.co2Impact.toFixed(1)} kg
                      </div>
                    </div>
                  );
                })}
              {activities.length > 3 && (
                <div className="px-[16px] py-[8px] text-center text-[10px] text-bark border-t border-[#ede7da]">
                  Showing 3 of {activities.length} activities
                </div>
              )}
            </div>
          </>
        )}
```

- [ ] **Step 4: Remove unused Card imports**

At the top of `src/components/features/Dashboard.tsx`, remove the import line for Card components (no longer used):

```tsx
// Remove this line:
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 6: Full visual check**

Open `http://localhost:5200`. Scroll through the full Dashboard and verify every section:
1. Parchment background throughout
2. Hero tile (dark): CO₂ number, stacked unit, progress bar, status badge
3. Level tile (light) and Streak tile (dark) in hero row on desktop
4. Three stat tiles on mobile, four on desktop
5. Category breakdown: horizontal bar rows, forest header
6. Weekly trend: dark line on cream tile, styled tooltip
7. Activity breakdown wrapped in craft tile with forest header
8. Log some activities via Log Activity tab, return to Dashboard — all data populates correctly
9. Recent activities shows rows with emoji, name, meta, CO₂; footer appears after 3+ activities

- [ ] **Step 7: Commit**

```bash
git add src/components/features/Dashboard.tsx
git commit -m "feat: Dashboard weekly trend, activity breakdown, recent activities — Craft Earth complete"
```
