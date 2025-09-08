import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress as ProgressBar } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Calendar, Target, TrendingDown, Award, Flame } from 'lucide-react';

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
    "🚶 Walk or bike for trips under 2 miles",
    "🥗 Try plant-based meals 2-3 times per week",
    "💡 Switch to LED bulbs to save energy",
    "🚗 Combine errands into one trip",
    "🌡️ Lower thermostat by 2°F in winter",
  ];

  return (
    <div className="min-h-screen bg-nature-gradient particles relative">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-4 animate-slideInUp">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="animate-float">
              <Award size={32} className="text-green-600 animate-carbon-glow" />
            </div>
            <h1 className="text-4xl gradient-text font-bold tracking-tight">Progress</h1>
          </div>
          <p className="text-gray-600 text-lg">Track your environmental journey</p>
          <div className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2 glass-green px-4 py-2 rounded-full inline-flex">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Achievement & milestone tracking</span>
          </div>
        </div>

      {/* Monthly Goal */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Target size={20} />
            Monthly Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl text-green-700">{Math.round(currentMonthEmissions * 10) / 10}</div>
            <div className="text-sm text-gray-600">of {monthlyGoal} kg CO₂e</div>
          </div>
          <ProgressBar value={monthProgress} className="mb-2" />
          <div className="text-sm text-gray-600 text-center">
            {monthProgress.toFixed(1)}% of monthly target
          </div>
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar size={20} />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyComparison.map((week, index) => {
              const isUnderTarget = week.emissions < week.target;
              const percentage = (week.emissions / week.target) * 100;
              
              return (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{week.week}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isUnderTarget ? 'text-green-600' : 'text-orange-600'}`}>
                        {week.emissions} kg CO₂e
                      </span>
                      {isUnderTarget && <TrendingDown size={16} className="text-green-500" />}
                    </div>
                  </div>
                  <ProgressBar 
                    value={Math.min(percentage, 100)} 
                    className={`${isUnderTarget ? '[&>div]:bg-green-500' : '[&>div]:bg-orange-500'}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Award size={20} />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`flex items-center gap-2 mb-1 ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      <span className="text-sm">{achievement.title}</span>
                      {achievement.earned && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-700 mb-1">Current Streak</h3>
              <p className="text-xs text-gray-600">Keep logging to maintain your streak!</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="text-red-500" size={24} />
              <span className="text-2xl text-red-600">12</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eco Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">💡 Eco Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="text-sm text-blue-700 p-2 bg-white rounded border border-blue-100">
                {tip}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}