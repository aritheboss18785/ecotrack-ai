import React from 'react';
import { Home, Plus, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'log' | 'progress';
  onTabChange: (tab: 'dashboard' | 'log' | 'progress') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'log', label: 'Log Activity', icon: Plus },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ] as const;

  return (
    <div className="glass backdrop-blur-xl border-t border-white/20 px-4 py-4 shadow-2xl z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 card-hover ${
              activeTab === id
                ? 'glass-green text-green-600 shadow-lg scale-110 animate-pulse-green'
                : 'text-gray-500 hover:text-green-400 hover:glass'
            }`}
          >
            <div className={`transition-all duration-300 ${
              activeTab === id ? 'animate-float' : ''
            }`}>
              <Icon size={22} />
            </div>
            <span className={`text-xs font-medium ${
              activeTab === id ? 'gradient-text' : ''
            }`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}