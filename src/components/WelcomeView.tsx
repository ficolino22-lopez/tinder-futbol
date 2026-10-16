import React from 'react';
import { stadiumHero } from '../data/initialData';
import { Search, PlusCircle, Sparkles, MapPin, ShieldCheck, Beer } from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/audio';

interface WelcomeViewProps {
  onSelectRole: (role: 'jugador' | 'host') => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectRole }) => {
  return (
    <div className="relative min-h-[750px] flex flex-col justify-between p-6 select-none overflow-hidden bg-slate-950">
      {/* Background Hero Stadium Imagery with High-End Editorial Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={stadiumHero}
          alt="Cancha de fútbol sintético iluminada de noche"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
        />
        {/* Measured Scrim as per frontend-design specs */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial at-center from-transparent via-slate-950/50 to-slate-950/90" />
      </div>

      {/* Top Floating Badge */}
      <div className="relative z-10 pt-4 flex justify-between items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-[11px] tracking-wide">32 PARTIDOS ACTIVOS HOY</span>
        </div>
      </div>

      {/* Center Hero Identity */}
      <div className="relative z-10 my-auto pt-10 pb-6 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 text-3xl transform -rotate-3 hover:rotate-0 transition-transform">
          ⚽
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          FULBO MATCH
        </h1>
        <p className="text-emerald-400 font-bold text-sm tracking-wider uppercase mt-1">
          El Tinder del Fútbol
        </p>

        <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
          Conectá con tu próxima reta en segundos. Deslizá para sumarte a partidos listos o armá la convocatoria de tu equipo como Host.
        </p>

        {/* Feature Highlights with Unboxed Typography */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-800/80 text-left">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-emerald-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Cerca tuyo</span>
            </div>
            <span className="text-[11px] text-slate-400 leading-tight">Canchas a &lt; 5km</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Verificado</span>
            </div>
            <span className="text-[11px] text-slate-400 leading-tight">Hosts confiables</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-emerald-400 mb-1">
              <Beer className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">3er Tiempo</span>
            </div>
            <span className="text-[11px] text-slate-400 leading-tight">Compañerismo</span>
          </div>
        </div>
      </div>

      {/* Elevated Native Action CTAs */}
      <div className="relative z-10 space-y-3 pb-2">
        {/* Jugador CTA */}
        <button
          onClick={() => {
            playTapSound();
            triggerHaptic('medium');
            onSelectRole('jugador');
          }}
          className="group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all hover:brightness-105"
        >
          <Search className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
          <span>Buscar Partidos (Jugador)</span>
        </button>

        {/* Host CTA */}
        <button
          onClick={() => {
            playTapSound();
            triggerHaptic('medium');
            onSelectRole('host');
          }}
          className="w-full py-4 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-base flex items-center justify-center gap-2 border border-slate-700/80 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-5 h-5 text-emerald-400" />
          <span>⚡ Armar Partido (Host / Capitán)</span>
        </button>

        <p className="text-center text-[11px] text-slate-500 pt-1">
          Sin registros tediosos · Match directo por WhatsApp o confirmación en app
        </p>
      </div>
    </div>
  );
};
