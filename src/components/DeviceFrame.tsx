import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Shield, User } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playTapSound } from '../utils/audio';
import { UserRole } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingRequestsCount: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeRole,
  onRoleChange,
  pendingRequestsCount,
}) => {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('20:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTapSound();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 md:p-6 transition-colors selection:bg-emerald-500">
      {/* Top Desktop Tool Bar for rapid testing & UX evaluation */}
      <header className="hidden md:flex w-full max-w-5xl items-center justify-between py-3 px-4 mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold tracking-tight text-white text-sm">FULBO MATCH</span>
            <span className="text-slate-400">· Experience Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Fast Role Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                playTapSound();
                onRoleChange('jugador');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeRole === 'jugador'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Modo Jugador</span>
            </button>
            <button
              onClick={() => {
                playTapSound();
                onRoleChange('host');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all relative ${
                activeRole === 'host'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Panel Host</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Desactivar audio táctil' : 'Activar audio táctil'}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Viewport Simulator Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsMobileMode(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                isMobileMode ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Marco Móvil Nativo (iPhone 16 Pro)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMode(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                !isMobileMode ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Completa Expandida"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ease-out flex justify-center ${
          isMobileMode ? 'max-w-[420px]' : 'max-w-4xl'
        }`}
      >
        <div
          className={`w-full bg-slate-900 border border-slate-800 relative flex flex-col overflow-hidden shadow-2xl ${
            isMobileMode
              ? 'min-h-[860px] max-h-[920px] rounded-[44px] ring-1 ring-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
              : 'min-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Native iPhone Hardware Header & Status Bar in Mobile View */}
          {isMobileMode && (
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md pt-3 px-6 pb-2 border-b border-slate-800/50 flex items-center justify-between text-xs select-none">
              <span className="font-semibold text-slate-200 tracking-tight pl-1">{currentTime}</span>

              {/* Dynamic Island Pill */}
              <div className="h-5 w-24 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">LIVE</span>
              </div>

              {/* Native indicators */}
              <div className="flex items-center gap-1.5 text-slate-400 pr-1">
                <span className="text-[11px] font-medium text-slate-300">5G</span>
                <div className="w-5 h-2.5 border border-slate-400 rounded-[3px] p-[1px] flex items-center">
                  <div className="h-full w-3.5 bg-emerald-400 rounded-[1px]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Child View Content */}
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
            {children}
          </div>

          {/* Native Home Indicator Bar in Mobile View */}
          {isMobileMode && (
            <div className="w-full py-2 bg-slate-900/95 flex justify-center items-center pointer-events-none">
              <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
