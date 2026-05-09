import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ActivityBreakdown } from './ActivityBreakdown';
import { Activity } from '../../types/activity';

interface DashboardProps {
  activities: Activity[];
}

export function Dashboard({ activities }: DashboardProps) {
  // Calculate real data from activities
  const today = new Date().toISOString().split('T')[0];
  const todaysActivities = activities.filter(activity => activity.date === today);
  const todayProgress = todaysActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
  
  const dailyTarget = 12.0;
  const rawPercentage = (todayProgress / dailyTarget) * 100;
  const usedPercentage = Math.min(rawPercentage, 100);
  const remainingPercentage = Math.max(100 - usedPercentage, 0);
  const remainingBudget = Math.max(dailyTarget - todayProgress, 0);

  // Calculate weekly data
  const getWeekData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayActivities = activities.filter(activity => activity.date === date);
      const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
      const [y, m, d] = date.split('-').map(Number);
      const dayName = new Date(y, m - 1, d).toLocaleDateString('en', { weekday: 'short' });
      return { day: dayName, value: Math.round(dayTotal * 10) / 10 };
    });
  };

  const trendData = getWeekData();
  const weeklyTotal = trendData.reduce((sum, day) => sum + day.value, 0);
  const weeklyAverage = weeklyTotal / 7;

  const weeklyData = {
    total: Math.round(weeklyTotal * 10) / 10,
    average: Math.round(weeklyAverage * 10) / 10,
    bestDay: trendData.length > 0 ? Math.min(...trendData.map(d => d.value)) : 0,
  };

  // Calculate category breakdown from real data
  const getCategoryData = () => {
    const categoryTotals = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + activity.co2Impact;
      return acc;
    }, {} as Record<string, number>);

    const totalEmissions = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    if (totalEmissions === 0) {
      return [];
    }

    const categoryColors = {
      transport: '#4ade80',
      food: '#0ea5e9',
      energy: '#8b5cf6',
      shopping: '#f59e0b',
      waste: '#ef4444',
    };

    const categoryNames = {
      transport: 'Transport',
      food: 'Food',
      energy: 'Energy',
      shopping: 'Shopping',
      waste: 'Waste',
    };

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        name: categoryNames[category as keyof typeof categoryNames] || category,
        value: Math.round((total / totalEmissions) * 100),
        color: categoryColors[category as keyof typeof categoryColors] || '#64748b'
      }))
      .filter(cat => cat.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  const categoryData = getCategoryData();



  // Calculate gamification stats
  const calculateGamificationStats = () => {
    const totalActivities = activities.length;
    const level = Math.floor(totalActivities / 10) + 1;
    const xp = (totalActivities % 10) * 50;
    const maxXp = 450;
    
    // Streak counts consecutive fully-completed past days (yesterday and earlier)
    const activityDates = new Set(activities.map(a => a.date));
    let streak = 0;
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - 1);

    for (let i = 0; i < 30; i++) {
      const dateStr = cursor.toISOString().split('T')[0];
      if (activityDates.has(dateStr)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { level, xp, maxXp, streak };
  };

  const gamificationStats = calculateGamificationStats();

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
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-[10px]">

          {/* Carbon budget tile (dark) */}
          <div className="tile tile-forest tile-hover p-[14px_16px] col-span-2 md:col-span-1">
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
                style={{ width: `${usedPercentage}%` }}
              />
            </div>
            <div className="text-[9px] mt-[5px]" style={{ color: 'rgba(168,197,160,0.45)' }}>
              {usedPercentage.toFixed(0)}% used · {remainingBudget.toFixed(1)} kg remaining
            </div>
            <div
              className="inline-flex items-center gap-[5px] mt-[10px] rounded-full px-[10px] py-[4px]"
              style={{ background: 'rgba(168,197,160,0.1)', border: '1px solid rgba(168,197,160,0.25)' }}
            >
              <div className={`w-[6px] h-[6px] rounded-full ${
                rawPercentage > 100 ? 'bg-red-400' : rawPercentage > 80 ? 'bg-yellow-400' : 'bg-forest-light'
              }`} />
              <span className="text-[10px] font-semibold text-forest-light uppercase tracking-[0.08em]">
                {rawPercentage > 100 ? 'Over budget' : rawPercentage > 80 ? 'Running low' : 'On track'}
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
}