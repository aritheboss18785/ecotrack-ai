import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getUserProfile, createUserProfile, logout } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthContext: Setting up auth listener');
    const unsubscribe = onAuthStateChange(async (authUser) => {
      console.log('🚀 AuthContext: Auth state changed:', authUser ? 'User logged in' : 'No user');
      setUser(authUser);
      
      if (authUser) {
        // Get or create user profile
        try {
          let profile = await getUserProfile(authUser.uid);
          
          if (!profile) {
            // Create new user profile
            const newProfile = {
              email: authUser.email,
              name: authUser.displayName || 'User',
              photoURL: authUser.photoURL,
              settings: {
                dailyCarbonBudget: 12.0, // kg CO2e
                units: 'metric',
                notifications: true
              },
              stats: {
                totalActivities: 0,
                totalCO2Saved: 0,
                streak: 0,
                level: 1
              }
            };
            
            await createUserProfile(authUser.uid, newProfile);
            profile = newProfile;
          }
          
          setUserProfile(profile);
          console.log('🚀 AuthContext: User profile loaded successfully');
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Set a basic profile even if there's an error
          setUserProfile({
            email: authUser.email,
            name: authUser.displayName || 'User',
            photoURL: authUser.photoURL,
            settings: {
              dailyCarbonBudget: 12.0,
              units: 'metric',
              notifications: true
            },
            stats: {
              totalActivities: 0,
              totalCO2Saved: 0,
              streak: 0,
              level: 1
            }
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    console.log('🚀 AuthContext: Signing out user');
    try {
      await logout();
      setUser(null);
      setUserProfile(null);
      console.log('🚀 AuthContext: Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}