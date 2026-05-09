import React from 'react';
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

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const weeklyActivityCount = activities.filter(a => last7Days.includes(a.date)).length;

  const categoryDotColors: Record<string, string> = {
    transport: '#d4e8d4',
    food:      '#e8d4c4',
    energy:    '#e8e4c4',
    shopping:  '#d4d4e8',
    waste:     '#e8d4d4',
  };

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
          <div className="hidden md:block tile tile-hover p-[10px_12px]">
            <div className="craft-label">Activities</div>
            <div className="text-[26px] font-bold text-forest leading-none mt-1" style={{ letterSpacing: '-0.04em' }}>
              {weeklyActivityCount}
            </div>
            <div className="text-[9px] text-bark mt-[3px]">this week</div>
          </div>
        </div>

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

        {/* ── Activity breakdown ── */}
        <div className="tile overflow-hidden">
          <div className="bg-forest px-[16px] py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            Activity Breakdown
          </div>
          <div className="p-[14px_16px]">
            <ActivityBreakdown activities={activities} />
          </div>
        </div>

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

      </div>
    </div>
  );
}