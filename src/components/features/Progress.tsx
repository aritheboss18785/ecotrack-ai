import React from 'react';
import { Progress as ProgressBar } from '../ui/progress';
import { Activity } from '../../types/activity';

interface ProgressProps {
  activities: Activity[];
}

export function Progress({ activities }: ProgressProps) {
  // Calculate real monthly data
  const monthlyGoal = 250; // kg CO2e
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
  });
  
  const currentMonthEmissions = monthlyActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
  const monthProgress = (currentMonthEmissions / monthlyGoal) * 100;

  // Calculate achievements based on real data
  const calculateAchievements = () => {
    const uniqueDays = [...new Set(activities.map(a => a.date))].length;
    const totalActivities = activities.length;
    
    // Check if any day was under 5kg
    const dailyTotals = activities.reduce((acc, activity) => {
      acc[activity.date] = (acc[activity.date] || 0) + activity.co2Impact;
      return acc;
    }, {} as Record<string, number>);
    
    const hasLowCarbonDay = Object.values(dailyTotals).some(total => total < 5);
    
    return [
      { 
        id: 1, 
        title: 'First Week', 
        description: 'Completed your first week of tracking', 
        earned: uniqueDays >= 7, 
        icon: '🎯' 
      },
      { 
        id: 2, 
        title: 'Low Carbon Day', 
        description: 'Had a day under 5kg CO₂e', 
        earned: hasLowCarbonDay, 
        icon: '🌱' 
      },
      { 
        id: 3, 
        title: 'Consistent Logger', 
        description: 'Logged activities for 7 days straight', 
        earned: uniqueDays >= 7, 
        icon: '📝' 
      },
      { 
        id: 4, 
        title: 'Eco Warrior', 
        description: 'Reduced emissions by 20% this month', 
        earned: false, 
        icon: '⚔️' 
      },
      { 
        id: 5, 
        title: 'Activity Champion', 
        description: 'Logged 20+ activities', 
        earned: totalActivities >= 20, 
        icon: '🏆' 
      },
    ];
  };

  const achievements = calculateAchievements();

  // Calculate weekly comparison data
  const getWeeklyComparison = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      const weekEmissions = weekActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
      
      weeks.push({
        week: i === 0 ? 'This Week' : `Week ${4-i}`,
        emissions: Math.round(weekEmissions * 10) / 10,
        target: 70
      });
    }
    
    return weeks;
  };

  const weeklyComparison = getWeeklyComparison();

  const tips = [
    "Walk or bike for trips under 2 miles",
    "Try plant-based meals 2-3 times per week",
    "Switch to LED bulbs to save energy",
    "Combine errands into one trip",
    "Lower thermostat by 2°F in winter",
  ];

  // Calculate streak from activities (consecutive days ending yesterday)
  const activityDates = new Set(activities.map(a => a.date));
  let currentStreak = 0;
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 1);
  for (let i = 0; i < 30; i++) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (activityDates.has(dateStr)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

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
              {currentStreak}
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
                className={`tile p-3 flex flex-col gap-2 ${achievement.earned ? 'tile-forest tile-hover' : 'opacity-50'}`}
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
}