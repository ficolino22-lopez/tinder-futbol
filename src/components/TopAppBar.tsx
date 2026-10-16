import React from 'react';
import { Shield, User, Bell, Volume2, VolumeX } from 'lucide-react';
import { UserRole } from '../types';
import { playTapSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface TopAppBarProps {
  activeRole: UserRole;
  onRoleToggle: () => void;
  pendingRequestsCount: number;
  onOpenRequests?: () => void;
  title?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeRole,
  onRoleToggle,
  pendingRequestsCount,
  onOpenRequests,
}) => {
  const [soundActive, setSoundActive] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    playTapSound();
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-800/80 flex items-center justify-between transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-base">
          ⚽
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-tight text-white text-base leading-none">
            FULBO MATCH
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">
            Tinder del Fútbol
          </span>
        </div>
      </div>

      {/* Zone 3: Actions & Role Indicator */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Audio táctil"
          aria-label="Silenciar o activar sonidos táctiles"
        >
          {soundActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* Requests quick bell badge if in Host mode */}
        {activeRole === 'host' && onOpenRequests && (
          <button
            onClick={() => {
              playTapSound();
              onOpenRequests();
            }}
            className="relative p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Solicitudes de jugadores"
          >
            <Bell className="w-4 h-4" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        )}

        {/* Tactile Role Switch Pill */}
        <button
          onClick={() => {
            playTapSound();
            onRoleToggle();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            activeRole === 'host'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {activeRole === 'host' ? (
            <>
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Host</span>
            </>
          ) : (
            <>
              <User className="w-3 h-3 text-emerald-400" />
              <span>Jugador</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
