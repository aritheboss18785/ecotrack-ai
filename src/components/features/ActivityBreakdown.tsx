import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
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
}