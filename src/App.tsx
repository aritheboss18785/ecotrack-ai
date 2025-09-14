import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/features/Dashboard';
import { LogActivity } from './components/features/LogActivity';
import { Progress } from './components/features/Progress';
import { AuthForm } from './components/features/AuthForm';
import { Navigation } from './components/layout/Navigation';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Activity } from './types/activity';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getUserActivities, saveActivity } from './lib/firebase';
import { toast } from 'sonner';

function AppContent() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'progress'>('dashboard');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Load user activities when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserActivities();
    }
  }, [user]);

  const loadUserActivities = async () => {
    if (!user) return;
    
    setLoadingActivities(true);
    try {
      const userActivities = await getUserActivities(user.uid);
      // Convert Firestore data to Activity format
      const formattedActivities = userActivities.map((activity: any) => ({
        id: activity.id,
        category: activity.category,
        amount: activity.amount,
        unit: activity.unit,
        co2Impact: activity.co2Impact,
        date: activity.date,
        time: activity.time,
        itemName: activity.itemName,
        confidence: activity.confidence
      }));
      setActivities(formattedActivities);
    } catch (error) {
      toast.error('Failed to load your activities');
    } finally {
      setLoadingActivities(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    if (!user) {
      toast.error('Please sign in to save activities');
      return;
    }

    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };

    try {
      // Save to Firebase
      await saveActivity(user.uid, newActivity);
      
      // Update local state
      setActivities(prev => [...prev, newActivity]);
      
      toast.success('Activity saved successfully!');
    } catch (error) {
      toast.error('Failed to save activity');
    }
  };

  const renderActiveScreen = () => {
    if (loadingActivities) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your activities...</p>
          </div>
        </div>
      );
    }

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

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-nature-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading EcoTrack AI...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <div className="h-screen bg-nature-gradient flex flex-col relative">
      {/* User Profile Header */}
      <div className="glass backdrop-blur-xl border-b border-white/20 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            {userProfile?.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-green-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {userProfile?.name || user.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {activities.length} activities logged
              </p>
            </div>
          </div>
          
          <Button
            onClick={signOut}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}