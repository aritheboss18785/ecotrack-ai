import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar } from 'recharts';
import { Flame, Trophy, Calendar, Zap } from 'lucide-react';
import { ActivityBreakdown } from './ActivityBreakdown';

export interface Activity {
  id: string;
  category: string;
  amount: number;
  unit: string;
  co2Impact: number;
  date: string;
  time: string;
}

interface DashboardProps {
  activities: Activity[];
}

export function Dashboard({ activities }: DashboardProps) {
  // Calculate real data from activities
  const today = new Date().toISOString().split('T')[0];
  const todaysActivities = activities.filter(activity => activity.date === today);
  const todayProgress = todaysActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
  
  const dailyTarget = 12.0;
  const usedPercentage = Math.min((todayProgress / dailyTarget) * 100, 100);
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
      const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
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
      return [
        { name: 'Transport', value: 35, color: '#4ade80' },
        { name: 'Food', value: 25, color: '#0ea5e9' },
        { name: 'Energy', value: 20, color: '#8b5cf6' },
        { name: 'Shopping', value: 15, color: '#f59e0b' },
        { name: 'Waste', value: 5, color: '#ef4444' },
      ];
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
    const maxXp = 500;
    
    // Calculate streak (consecutive days with activities)
    const dates = [...new Set(activities.map(a => a.date))].sort();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        // If no activities today, check yesterday
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else {
        break;
      }
    }
    
    return { level, xp, maxXp, streak };
  };

  const gamificationStats = calculateGamificationStats();

  return (
    <div className="min-h-screen bg-nature-gradient particles relative overflow-hidden">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-4 animate-slideInUp">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="animate-float">
              <Zap size={32} className="text-green-600 animate-carbon-glow" />
            </div>
            <h1 className="text-4xl gradient-text font-bold tracking-tight">EcoTrack AI</h1>
          </div>
          <p className="text-gray-600 text-lg">Your intelligent carbon companion</p>
          <div className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2 glass-green px-4 py-2 rounded-full inline-flex">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-green"></div>
            <span className="font-medium">Powered by scientific emission factors</span>
          </div>
        </div>

      {/* Today's Progress Card */}
      <Card className="glass-green border-2 border-green-200/50 card-hover animate-fadeInScale shadow-2xl">
        <CardHeader className="text-center relative">
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green"></div>
          </div>
          <CardTitle className="gradient-text text-xl font-bold">Carbon Budget Today</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Your daily eco-footprint tracker</p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="85%"
                barSize={16}
                data={[{ 
                  name: 'Remaining', 
                  value: usedPercentage > 100 ? 0 : remainingPercentage,
                  fill: usedPercentage > 100 ? '#ef4444' : remainingPercentage < 20 ? '#f59e0b' : '#22c55e'
                }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  label={false}
                  background={{ 
                    fill: usedPercentage > 100 ? '#fecaca' : '#fee2e2', 
                    opacity: usedPercentage > 100 ? 0.8 : 0.4 
                  }}
                  dataKey="value"
                  cornerRadius={8}
                  fill={usedPercentage > 100 ? '#ef4444' : remainingPercentage < 20 ? '#f59e0b' : '#22c55e'}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl ${
                  usedPercentage > 100 ? 'text-red-600' : 
                  remainingPercentage < 20 ? 'text-orange-600' : 
                  'text-green-700'
                }`}>
                  {usedPercentage > 100 ? '0.0' : remainingBudget.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">kg CO₂e left</div>
                <div className={`text-xs mt-1 ${
                  usedPercentage > 100 ? 'text-red-500' : 
                  remainingPercentage < 20 ? 'text-orange-500' : 
                  'text-green-600'
                }`}>
                  {usedPercentage > 100 ? 'Budget exceeded!' : `${remainingPercentage.toFixed(1)}% budget left`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {usedPercentage > 100 ? 
                    `${(todayProgress - dailyTarget).toFixed(1)} kg over limit` :
                    `Used: ${todayProgress.toFixed(1)} kg today`
                  }
                </div>
                {todaysActivities.length > 0 && (
                  <div className="text-xs text-green-600 mt-0.5">
                    {todaysActivities.length} activities logged today
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Daily Budget: {dailyTarget} kg CO₂e
          </div>
          <Progress 
            value={usedPercentage} 
            className={`h-2 ${
              usedPercentage > 100 ? '[&>div]:bg-red-500' : 
              usedPercentage > 80 ? '[&>div]:bg-orange-500' : 
              '[&>div]:bg-green-500'
            }`} 
          />
          <div className={`text-xs text-center mt-3 px-4 py-2 rounded-full font-medium ${
            usedPercentage > 100 ? 'co2-high' :
            remainingPercentage < 20 ? 'co2-medium' :
            'co2-low'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">
                {usedPercentage > 100 ? '⚠️' :
                 remainingPercentage < 20 ? '⚡' :
                 '🌱'}
              </span>
              <span>
                {usedPercentage > 100 ? 'Over budget - consider offsetting' :
                 remainingPercentage < 20 ? 'Running low - make eco-choices' :
                 'Excellent! Keep your budget green'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <div className="animate-slideInUp" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-green-600" size={24} />
          <h2 className="text-xl gradient-text font-semibold">Weekly Overview</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass border-blue-200/50 card-hover animate-float" style={{animationDelay: '0.5s'}}>
            <CardContent className="text-center p-4">
              <div className="text-2xl gradient-text-blue font-bold">{weeklyData.total}</div>
              <div className="text-sm text-gray-600 font-medium">Weekly Total</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </CardContent>
          </Card>
          <Card className="glass border-purple-200/50 card-hover animate-float" style={{animationDelay: '1s'}}>
            <CardContent className="text-center p-4">
              <div className="text-2xl gradient-text font-bold">{weeklyData.average}</div>
              <div className="text-sm text-gray-600 font-medium">Daily Average</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </CardContent>
          </Card>
          <Card className="glass-green border-green-200/50 card-hover animate-float" style={{animationDelay: '1.5s'}}>
            <CardContent className="text-center p-4">
              <div className="text-2xl gradient-text font-bold">{weeklyData.bestDay}</div>
              <div className="text-sm text-gray-600 font-medium">Best Day</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

      {/* Weekly Breakdown by Category */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Weekly Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="text-xs text-gray-500 ml-auto">{category.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-800">Weekly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  formatter={(value) => [`${value} kg CO₂e`, 'Emissions']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#16a34a', strokeWidth: 2, stroke: '#ffffff' }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Stats */}
      <Card className="glass bg-gradient-to-r from-orange-50/50 to-purple-50/50 border-orange-200/50 card-hover animate-fadeInScale shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full animate-pulse-green">
                <Trophy className="text-orange-600" size={28} />
              </div>
              <div>
                <div className="text-xl gradient-text font-bold">Level {gamificationStats.level}</div>
                <div className="text-sm text-gray-600 font-medium">
                  {gamificationStats.xp}/{gamificationStats.maxXp} XP
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full animate-float">
                <Flame className="text-red-500" size={28} />
              </div>
              <div>
                <div className="text-xl gradient-text font-bold">{gamificationStats.streak} days</div>
                <div className="text-sm text-gray-600 font-medium">Streak</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 font-medium">Progress to next level</span>
              <span className="text-sm gradient-text font-bold">
                {Math.round((gamificationStats.xp / gamificationStats.maxXp) * 100)}%
              </span>
            </div>
            <Progress 
              value={(gamificationStats.xp / gamificationStats.maxXp) * 100} 
              className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-purple-500 [&>div]:animate-shimmer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <ActivityBreakdown activities={activities} />

      {/* Recent Activities */}
      {activities.length > 0 && (
        <Card className="bg-white border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activities
                .slice(-3)
                .reverse()
                .map((activity) => {
                  const categoryIcons = {
                    transport: '🚗',
                    food: '🍽️',
                    energy: '⚡',
                    shopping: '🛍️',
                    waste: '🗑️'
                  };
                  
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {categoryIcons[activity.category as keyof typeof categoryIcons] || '📝'}
                        </span>
                        <div>
                          <div className="text-sm text-gray-700 capitalize">
                            {activity.category}: {activity.amount} {activity.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.date === today ? 'Today' : activity.date} at {activity.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.co2Impact.toFixed(1)} kg CO₂e
                      </div>
                    </div>
                  );
                })}
            </div>
            {activities.length > 3 && (
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500">
                  Showing 3 of {activities.length} activities
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}