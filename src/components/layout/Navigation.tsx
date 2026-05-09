import React from 'react';
import { Home, Plus, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'log' | 'progress';
  onTabChange: (tab: 'dashboard' | 'log' | 'progress') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'log',       label: 'Log Activity', icon: Plus },
    { id: 'progress',  label: 'Progress', icon: TrendingUp },
  ] as const;

  return (
    <>
      {/* ── Mobile: bottom bar ── */}
      <div className="md:hidden bg-parchment border-t-2 border-forest px-4 py-3 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-150"
            >
              <Icon
                size={20}
                className={activeTab === id ? 'text-forest' : 'text-bark'}
              />
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${
                activeTab === id ? 'text-forest' : 'text-bark'
              }`}>
                {label}
              </span>
              {activeTab === id && (
                <div className="w-1 h-1 rounded-full bg-forest" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: top bar ── */}
      <div className="hidden md:flex bg-forest px-8 py-3 items-center justify-between z-50">
        <span className="text-parchment text-sm font-bold uppercase tracking-[0.12em]">
          EcoTrack
        </span>
        <div className="flex gap-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150 ${
                activeTab === id
                  ? 'text-forest-light'
                  : 'text-parchment/40 hover:text-parchment/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-forest-light/40 uppercase tracking-[0.1em]">
          {new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>
    </>
  );
}
