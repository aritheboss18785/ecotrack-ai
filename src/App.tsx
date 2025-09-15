import React, { useState } from 'react';
import { Dashboard } from './components/features/Dashboard';
import { LogActivity } from './components/features/LogActivity';
import { Progress } from './components/features/Progress';
import { Navigation } from './components/layout/Navigation';
import { Toaster } from './components/ui/sonner';
import { Activity } from './types/activity';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'progress'>('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };

    setActivities(prev => [...prev, newActivity]);
    toast.success('Activity logged successfully!');
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
    <div className="h-screen bg-nature-gradient flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        {renderActiveScreen()}
      </div>
      
      <div className="flex-shrink-0">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
}