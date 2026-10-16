import React from 'react';
import { Compass, Flame, ShieldAlert, Users } from 'lucide-react';
import { AppTab } from '../types';
import { playTapSound, triggerHaptic } from '../utils/audio';

interface BottomTabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  pendingRequestsCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  pendingRequestsCount,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'descubrir', label: 'Explorar', icon: Compass },
    { id: 'swipe', label: 'Match Deck', icon: Flame },
    { id: 'host', label: 'Panel Host', icon: ShieldAlert, badge: pendingRequestsCount },
    { id: 'mis_partidos', label: 'Mi Squad', icon: Users },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              playTapSound();
              triggerHaptic('light');
              onTabChange(tab.id);
            }}
            className="relative flex flex-col items-center justify-center min-w-[64px] py-1 transition-all group focus-visible:outline-none"
            aria-selected={isActive}
          >
            {/* Active subtle pill background */}
            <div
              className={`p-1.5 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 scale-105'
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />

              {/* Badge for Host or notifications */}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-1.5 px-1.5 py-0.5 min-w-[18px] text-[10px] font-black leading-none bg-rose-500 text-white rounded-full border-2 border-slate-900 shadow-sm flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              ) : null}
            </div>

            <span
              className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
