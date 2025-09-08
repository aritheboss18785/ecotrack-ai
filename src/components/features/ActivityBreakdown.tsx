import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, Info, Zap } from 'lucide-react';
import { Activity } from '../../types/activity';
import { findEmissionFactor } from '../../lib/carbon/carbonEmissions';

interface ActivityBreakdownProps {
  activities: Activity[];
}

export function ActivityBreakdown({ activities }: ActivityBreakdownProps) {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Group activities by date
  const activitiesByDate = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const sortedDates = Object.keys(activitiesByDate).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      transport: '🚗',
      food: '🍽️',
      energy: '⚡',
      shopping: '🛍️',
      waste: '🗑️'
    };
    return icons[category as keyof typeof icons] || '📝';
  };

  const getActivityDetails = (activity: Activity) => {
    if (activity.itemName) {
      const factor = findEmissionFactor(activity.itemName);
      return {
        itemName: activity.itemName.replace(/_/g, ' ').toLowerCase(),
        source: factor?.source || 'Unknown',
        unit: activity.unit,
        confidence: activity.confidence || 0
      };
    }
    return null;
  };

  const toggleExpanded = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-green-600" />
        <h2 className="text-xl text-gray-800">Activity Breakdown</h2>
      </div>
      
      {sortedDates.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="text-center py-8">
            <div className="text-gray-500">No activities logged yet</div>
            <div className="text-sm text-gray-400 mt-1">Start logging your daily activities to see detailed breakdowns</div>
          </CardContent>
        </Card>
      ) : (
        sortedDates.map(date => {
          const dayActivities = activitiesByDate[date];
          const dayTotal = dayActivities.reduce((sum, activity) => sum + activity.co2Impact, 0);
          
          return (
            <Card key={date} className="bg-white border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">
                    {formatDate(date)}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-lg text-gray-700">{dayTotal.toFixed(2)} kg CO₂e</div>
                    <div className="text-sm text-gray-500">{dayActivities.length} activities</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayActivities.map(activity => {
                    const details = getActivityDetails(activity);
                    const isExpanded = expandedActivity === activity.id;
                    
                    return (
                      <div key={activity.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">{getCategoryIcon(activity.category)}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 capitalize font-medium">
                                  {activity.category}
                                </span>
                                {details && details.confidence > 0.7 && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                    AI Parsed
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {activity.amount.toFixed(2)} {activity.unit} at {activity.time}
                              </div>
                              {details && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {details.itemName}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 font-medium">
                                {activity.co2Impact.toFixed(2)} kg CO₂e
                              </div>
                            </div>
                            {details && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(activity.id)}
                                className="p-1 h-6 w-6"
                              >
                                {isExpanded ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && details && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-500">Item:</span>
                                <div className="text-gray-700">{details.itemName}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Data Source:</span>
                                <div className="text-gray-700">{details.source}</div>
                              </div>
                              {details.confidence > 0 && (
                                <>
                                  <div>
                                    <span className="text-gray-500">AI Confidence:</span>
                                    <div className="text-gray-700">{(details.confidence * 100).toFixed(0)}%</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Unit:</span>
                                    <div className="text-gray-700">{details.unit}</div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                              <Info size={12} />
                              <span>Based on scientific emission factors</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}