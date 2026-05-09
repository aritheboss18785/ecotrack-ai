import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/features/Dashboard';
import { LogActivity } from './components/features/LogActivity';
import { Progress } from './components/features/Progress';
import { Navigation } from './components/layout/Navigation';
import { Toaster } from './components/ui/sonner';
import { Activity } from './types/activity';

const STORAGE_KEY = 'ecotrack_activities';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'progress'>('dashboard');
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };

    setActivities(prev => [...prev, newActivity]);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard activities={activities} />;
      case 'log':
        return <LogActivity onAddActivity={addActivity} />;
      case 'progress':
        return <Progress activities={activities} />;
      default:
        return <Dashboard activities={activities} />;
    }
  };

  return (
    <div className="h-screen bg-parchment flex flex-col">
      <div className="order-2 md:order-1 flex-shrink-0">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="order-1 md:order-2 flex-1 overflow-y-auto">
        {renderActiveScreen()}
      </div>
      <Toaster
        position="top-center"
        offset={{ top: 72 }}
        mobileOffset={{ top: 16 }}
      />
    </div>
  );
}
