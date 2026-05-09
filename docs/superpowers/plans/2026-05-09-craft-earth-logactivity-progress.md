# Craft Earth Theme — LogActivity, Progress, ActivityBreakdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Craft Earth design system to LogActivity.tsx, Progress.tsx, and ActivityBreakdown.tsx, replacing the old glassmorphism/gradient aesthetic while preserving all logic and the gamified feel.

**Architecture:** Pure visual rewrite of the three component `return` statements and their imports. No logic, state, props, or data calculations change. The existing design tokens (globals.css + tailwind.config.js) are already in place.

**Tech Stack:** React, TypeScript, Tailwind CSS (craft colors: `parchment`, `forest`, `forest-light`, `bark`), CSS utility classes (`.tile`, `.tile-forest`, `.tile-hover`, `.craft-label`, `.animate-craft-fade-in`).

**Spec:** `docs/superpowers/specs/2026-05-09-craft-earth-logactivity-progress-design.md`

**Verify gate:** `npm run build` — must exit 0 after each task.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/components/features/LogActivity.tsx` | Modify | Imports, full return JSX |
| `src/components/features/Progress.tsx` | Modify | Imports, full return JSX |
| `src/components/features/ActivityBreakdown.tsx` | Modify | Imports, full return JSX |

---

## Task 1: Restyle LogActivity.tsx

**Goal:** Replace the old glassmorphism LogActivity UI with Craft Earth tiles, keeping all AI-parse logic intact.

**Files:**
- Modify: `src/components/features/LogActivity.tsx`

**Acceptance Criteria:**
- [ ] Page uses `bg-parchment` background, no `bg-nature-gradient` or `particles`
- [ ] Category picker is a 2×3 grid of `.tile` / `.tile-forest` buttons — no `glass`, `glass-green`, `scale-105`
- [ ] Selected category renders a `.tile` with a forest header bar and craft-styled textarea
- [ ] AI result preview uses `.tile.tile-forest` (dark tile reveal)
- [ ] Action button uses `bg-forest text-parchment shadow-craft`
- [ ] `npm run build` exits 0

**Verify:** `npm run build` → `✓ built in` with no TypeScript errors

**Steps:**

- [ ] **Step 1: Update imports — remove Shadcn Card components**

Replace the import block at the top of `src/components/features/LogActivity.tsx`:

```tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Car, Utensils, Zap, ShoppingBag, Trash2, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ParsedActivity } from '../../lib/activityParser';
import { parseActivityWithAI } from '../../lib/llmParser';
import { Activity } from '../../types/activity';
```

(Removed: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `../ui/card`)

- [ ] **Step 2: Replace the entire return statement**

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <div className="min-h-screen bg-parchment font-sans">
      <div className="p-4 flex flex-col gap-[14px] animate-craft-fade-in max-w-5xl mx-auto">

        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="craft-label mb-1">LOG ACTIVITY</div>
          <h1 className="text-3xl font-bold text-forest tracking-tight">Log Activity</h1>
          <p className="text-bark text-sm mt-1">Describe your daily activities naturally</p>
        </div>

        {/* Category Selection */}
        <div>
          <div className="craft-label border-b border-[#d8cfc0] pb-[6px] mb-3">SELECT CATEGORY</div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(selectedCategory === id ? '' : id)}
                className={`tile tile-hover p-5 flex flex-col items-center gap-2 ${
                  selectedCategory === id ? 'tile-forest' : ''
                }`}
              >
                <Icon size={32} className={selectedCategory === id ? 'text-forest-light' : 'text-forest'} />
                <span className={`text-sm font-medium ${selectedCategory === id ? 'text-forest-light' : 'text-forest'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Input Card */}
        {selectedCategory && (
          <div className="tile overflow-hidden">
            <div className="bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
              Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor={`${selectedCategory}-text`} className="text-forest text-sm font-medium">
                  Describe your {selectedCategory} activity
                </Label>
                <Textarea
                  id={`${selectedCategory}-text`}
                  value={activityTexts[selectedCategory]}
                  onChange={(e) => handleTextChange(selectedCategory, e.target.value)}
                  placeholder={categories.find(cat => cat.id === selectedCategory)?.placeholder}
                  className="min-h-[100px] bg-parchment border-forest text-forest text-sm rounded-[8px]"
                  rows={4}
                />
              </div>

              <div className="bg-parchment border border-[#d8cfc0] rounded-[8px] p-3">
                <div className="craft-label mb-2">EXAMPLE PHRASES</div>
                <div className="flex flex-col gap-1">
                  {categories.find(cat => cat.id === selectedCategory)?.examples.map((example, index) => (
                    <div
                      key={index}
                      className="text-xs text-bark cursor-pointer hover:text-forest transition-colors"
                      onClick={() => handleTextChange(selectedCategory, example)}
                    >
                      · {example}
                    </div>
                  ))}
                </div>
              </div>

              {isLoading[selectedCategory] && (
                <div className="tile-forest rounded-[8px] px-4 py-3 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-forest-light border-t-transparent rounded-full animate-spin" />
                  <span className="text-forest-light text-sm">Analysing your activity...</span>
                </div>
              )}

              {!isLoading[selectedCategory] && parsedResults[selectedCategory] && parsedResults[selectedCategory]!.items.length > 0 && (
                <div className="tile tile-forest p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-forest-light font-bold text-2xl tracking-[-0.04em]">
                        {parsedResults[selectedCategory]!.totalCO2Impact.toFixed(2)} kg CO₂e
                      </div>
                      <div className="text-[10px] text-forest-light/60 uppercase tracking-wide">Gemini Analysis Result</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBreakdown(selectedCategory)}
                      className="text-forest-light hover:text-forest-light hover:bg-white/10 p-2 rounded-full"
                    >
                      <Info size={16} />
                    </Button>
                  </div>
                  {showBreakdown[selectedCategory] && (
                    <div className="flex flex-col gap-1 border-t border-forest-light/20 pt-2 mt-1">
                      {parsedResults[selectedCategory]!.items.map((item, index) => (
                        <div key={index} className="text-xs text-forest-light/70 flex justify-between">
                          <span>· {item.name}: {item.quantity.toFixed(2)} {item.unit}</span>
                          <span>{item.co2Impact.toFixed(2)} kg CO₂e</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(() => {
                const loading = isLoading[selectedCategory];
                const parsed = parsedResults[selectedCategory];
                const hasText = activityTexts[selectedCategory].trim().length > 0;
                const hasResult = parsed && parsed.items.length > 0;
                return (
                  <button
                    onClick={() => hasResult ? handleLogActivity(selectedCategory) : handleAnalyse(selectedCategory)}
                    disabled={loading || (!hasResult && !hasText)}
                    className="w-full bg-forest text-parchment font-semibold py-3 rounded-[8px] text-sm flex items-center justify-center gap-2 shadow-craft disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-craft-lg hover:-translate-y-px transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-parchment border-t-transparent rounded-full animate-spin" />
                        <span>Analysing...</span>
                      </>
                    ) : hasResult ? (
                      <>
                        <Plus size={18} />
                        <span>Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Analyse Activity</span>
                      </>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* How AI Analysis Works */}
        <div className="tile overflow-hidden">
          <div className="bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            How AI Analysis Works
          </div>
          <div className="p-4 flex flex-col gap-2">
            {[
              'Use natural language to describe your activities',
              'AI breaks down complex activities into components',
              'Uses real emission factors from scientific sources',
              'More specific descriptions = more accurate results',
            ].map((tip, i) => (
              <div key={i} className="text-xs text-bark flex items-start gap-2">
                <span className="text-forest mt-0.5">·</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
```

- [ ] **Step 3: Build and commit**

```bash
npm run build
```
Expected: exits 0, `✓ built in Xs`.

```bash
git add src/components/features/LogActivity.tsx
git commit -m "feat: apply Craft Earth theme to LogActivity"
```

---

## Task 2: Restyle Progress.tsx

**Goal:** Replace the old Progress UI with Craft Earth tiles; move streak to hero position; elevate achievements to dark tiles.

**Files:**
- Modify: `src/components/features/Progress.tsx`

**Acceptance Criteria:**
- [ ] Page uses `bg-parchment` background
- [ ] Streak tile is the first content element, full-width `.tile.tile-forest` with large streak number
- [ ] Monthly goal shows a big number + `[&>div]:bg-forest` progress bar (amber if over target)
- [ ] Weekly comparison bars use `forest-light` (under) / `#c17f4a` (over) fills
- [ ] Earned achievements: `.tile.tile-forest` dark card; unearned: `.tile.opacity-50` faded
- [ ] `npm run build` exits 0

**Verify:** `npm run build` → exits 0 with no TypeScript errors

**Steps:**

- [ ] **Step 1: Update imports — remove all Shadcn Card, Badge and all Lucide icons**

Replace the import block at the top of `src/components/features/Progress.tsx`:

```tsx
import React from 'react';
import { Progress as ProgressBar } from '../ui/progress';
import { Activity } from '../../types/activity';
```

(Removed: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `../ui/card`; `Badge` from `../ui/badge`; `Calendar`, `Target`, `TrendingDown`, `Award`, `Flame` from `lucide-react`)

- [ ] **Step 2: Replace the entire return statement**

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <div className="min-h-screen bg-parchment font-sans">
      <div className="p-4 flex flex-col gap-[14px] animate-craft-fade-in max-w-5xl mx-auto">

        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="craft-label mb-1">PROGRESS</div>
          <h1 className="text-3xl font-bold text-forest tracking-tight">Progress</h1>
          <p className="text-bark text-sm mt-1">Track your environmental journey</p>
        </div>

        {/* Streak Hero */}
        <div className="tile tile-forest p-[16px_20px] flex items-center justify-between">
          <div>
            <div
              className="text-forest-light font-bold leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.05em' }}
            >
              12
            </div>
            <div className="craft-label text-forest-light/60 mt-1">DAY STREAK</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-4xl">🔥</span>
            <p className="text-xs text-forest-light/50 text-right max-w-[140px]">
              Keep logging to maintain your streak!
            </p>
          </div>
        </div>

        {/* Monthly Goal */}
        <div>
          <div className="craft-label border-b border-[#d8cfc0] pb-[6px] mb-3">MONTHLY GOAL</div>
          <div className="tile p-[14px_16px]">
            <div className="text-center mb-3">
              <div
                className="text-forest font-bold leading-none"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.04em' }}
              >
                {Math.round(currentMonthEmissions * 10) / 10}
              </div>
              <div className="text-bark text-xs mt-1">of {monthlyGoal} kg CO₂e</div>
            </div>
            <ProgressBar
              value={Math.min(monthProgress, 100)}
              className={`mb-2 ${monthProgress > 100 ? '[&>div]:bg-[#c17f4a]' : '[&>div]:bg-forest'}`}
            />
            <div className="text-bark text-xs text-center">{monthProgress.toFixed(1)}% of monthly target</div>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="tile overflow-hidden">
          <div className="bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            Weekly Progress
          </div>
          <div className="p-4 flex flex-col gap-3">
            {weeklyComparison.map((week) => {
              const isUnderTarget = week.emissions < week.target;
              const percentage = (week.emissions / week.target) * 100;
              return (
                <div key={week.week} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-bark text-xs">{week.week}</span>
                    <span className={`text-xs font-medium ${isUnderTarget ? 'text-forest' : 'text-[#c17f4a]'}`}>
                      {week.emissions} kg CO₂e
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(percentage, 100)}
                    className={isUnderTarget ? '[&>div]:bg-forest-light' : '[&>div]:bg-[#c17f4a]'}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="craft-label border-b border-[#d8cfc0] pb-[6px] mb-3">ACHIEVEMENTS</div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`tile tile-hover p-3 flex flex-col gap-2 ${achievement.earned ? 'tile-forest' : 'opacity-50'}`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className={`text-sm font-semibold ${achievement.earned ? 'text-forest-light' : 'text-forest'}`}>
                    {achievement.title}
                  </div>
                  {achievement.earned && (
                    <div className="craft-label text-forest-light/60 mt-0.5">EARNED</div>
                  )}
                </div>
                <p className={`text-xs ${achievement.earned ? 'text-forest-light/60' : 'text-bark'}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Eco Tips */}
        <div>
          <div className="craft-label border-b border-[#d8cfc0] pb-[6px] mb-3">ECO TIPS</div>
          <div className="tile p-[14px_16px] flex flex-col gap-2">
            {tips.map((tip, index) => (
              <div key={index} className="text-xs text-bark flex items-start gap-2">
                <span className="text-forest mt-0.5">·</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
```

- [ ] **Step 3: Build and commit**

```bash
npm run build
```
Expected: exits 0.

```bash
git add src/components/features/Progress.tsx
git commit -m "feat: apply Craft Earth theme to Progress, elevate streak and achievements"
```

---

## Task 3: Restyle ActivityBreakdown.tsx

**Goal:** Replace gray Shadcn Cards in ActivityBreakdown with craft tiles so the component is visually consistent when embedded in the Dashboard.

**Files:**
- Modify: `src/components/features/ActivityBreakdown.tsx`

**Acceptance Criteria:**
- [ ] No Shadcn `Card`, `Badge`, or `Button` components remain
- [ ] Date group headers use `.craft-label` style with `border-[#d8cfc0]` separator
- [ ] Each activity row is a `.tile.tile-hover` div
- [ ] "AI Parsed" badge is a craft-style `<span>` with `bg-forest text-forest-light`
- [ ] Expanded detail panel uses `craft-label` keys + `text-forest` values
- [ ] Empty state is a plain div with `text-bark`
- [ ] `npm run build` exits 0

**Verify:** `npm run build` → exits 0 with no TypeScript errors

**Steps:**

- [ ] **Step 1: Update imports — remove Shadcn Card, Badge, Button and the Zap icon**

Replace the import block at the top of `src/components/features/ActivityBreakdown.tsx`:

```tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Activity } from '../../types/activity';
import { findEmissionFactor } from '../../lib/carbon/carbonEmissions';
```

(Removed: `Card`, `CardContent`, `CardHeader`, `CardTitle` from `../ui/card`; `Badge` from `../ui/badge`; `Button` from `../ui/button`; `Zap` from `lucide-react`)

- [ ] **Step 2: Replace the entire return statement**

Replace everything from `return (` to the closing `);` with:

```tsx
  return (
    <div className="flex flex-col gap-3">
      {sortedDates.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-bark text-sm">No activities logged yet</div>
          <div className="text-bark/60 text-xs mt-1">
            Start logging your daily activities to see detailed breakdowns
          </div>
        </div>
      ) : (
        sortedDates.map(date => {
          const dayActivities = activitiesByDate[date];
          const dayTotal = dayActivities.reduce((sum, a) => sum + a.co2Impact, 0);

          return (
            <div key={date}>
              <div className="flex items-center justify-between craft-label border-b border-[#d8cfc0] pb-[6px] mb-2">
                <span>{formatDate(date)}</span>
                <span>{dayTotal.toFixed(2)} kg CO₂e · {dayActivities.length} activities</span>
              </div>
              <div className="flex flex-col gap-2">
                {dayActivities.map(activity => {
                  const details = getActivityDetails(activity);
                  const isExpanded = expandedActivity === activity.id;

                  return (
                    <div key={activity.id} className="tile tile-hover p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-xl">{getCategoryIcon(activity.category)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-forest font-medium capitalize">
                                {activity.category}
                              </span>
                              {details && details.confidence > 0.7 && (
                                <span className="text-[9px] uppercase tracking-wide text-forest-light bg-forest px-1.5 py-0.5 rounded-sm">
                                  AI Parsed
                                </span>
                              )}
                            </div>
                            {details && (
                              <div className="text-xs text-bark mt-0.5">{details.itemName}</div>
                            )}
                            <div className="text-xs text-bark/60">
                              {activity.amount.toFixed(2)} {activity.unit} at {activity.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-forest font-medium">
                            {activity.co2Impact.toFixed(2)} kg CO₂e
                          </div>
                          {details && (
                            <button
                              onClick={() => toggleExpanded(activity.id)}
                              className="text-forest p-1 rounded hover:bg-forest/10 transition-colors"
                            >
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {isExpanded && details && (
                        <div className="border-t border-[#d8cfc0] pt-2 mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="craft-label mb-0.5">ITEM</div>
                            <div className="text-forest">{details.itemName}</div>
                          </div>
                          <div>
                            <div className="craft-label mb-0.5">DATA SOURCE</div>
                            <div className="text-forest">{details.source}</div>
                          </div>
                          {details.confidence > 0 && (
                            <>
                              <div>
                                <div className="craft-label mb-0.5">AI CONFIDENCE</div>
                                <div className="text-forest">{(details.confidence * 100).toFixed(0)}%</div>
                              </div>
                              <div>
                                <div className="craft-label mb-0.5">UNIT</div>
                                <div className="text-forest">{details.unit}</div>
                              </div>
                            </>
                          )}
                          <div className="col-span-2 text-bark/60 italic flex items-center gap-1 mt-1">
                            <Info size={10} />
                            <span>Based on scientific emission factors</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
```

- [ ] **Step 3: Build and commit**

```bash
npm run build
```
Expected: exits 0.

```bash
git add src/components/features/ActivityBreakdown.tsx
git commit -m "feat: apply Craft Earth theme to ActivityBreakdown"
```

---

## Task 4: Visual Verification Pass

**Goal:** Confirm all three restyled pages look correct in the browser — no visual regressions on Dashboard, LogActivity, or Progress.

**Files:** No code changes expected; any tweaks committed here.

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] Dashboard page: ActivityBreakdown section matches craft aesthetic
- [ ] LogActivity page: category picker, input card, AI result reveal all render correctly
- [ ] Progress page: streak hero is prominent, earned achievements are dark tiles, unearned are faded
- [ ] No leftover `glass`, `gradient-text`, `bg-nature-gradient` visual artifacts on any page

**Verify:** Visual inspection at `http://localhost:5200`

**Steps:**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```
Expected: `➜  Local:   http://localhost:5200/` (or similar port).

- [ ] **Step 2: Check each page**

Navigate to:
1. `/` (Dashboard) — verify ActivityBreakdown rows are craft tiles, no gray Card boxes
2. Log Activity tab — verify category picker tiles, dark input card with forest header, dark result reveal
3. Progress tab — verify streak hero is first (dark tile, big number), achievements grid (dark earned / faded unearned)

- [ ] **Step 3: Commit any visual tweaks**

If any spacing, color, or layout adjustments are needed after visual review, make them and commit:

```bash
git add src/components/features/
git commit -m "fix: visual tweaks after Craft Earth theme review"
```

If nothing needs changing, no commit required.
