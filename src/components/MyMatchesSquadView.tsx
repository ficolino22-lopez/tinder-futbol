import React from 'react';
import { Match } from '../types';
import { Users, Clock, MapPin, MessageCircle, ChevronRight, Trophy, ShieldCheck } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface MyMatchesSquadViewProps {
  matches: Match[];
  onOpenTacticalPitch: (match: Match) => void;
  onExploreMatches: () => void;
}

export const MyMatchesSquadView: React.FC<MyMatchesSquadViewProps> = ({
  matches,
  onOpenTacticalPitch,
  onExploreMatches,
}) => {
  // Let's display the active matches where the user is part of the squad
  const confirmedMatches = matches.slice(0, 2);

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      {/* Top Header */}
      <div className="mb-4">
        <h2 className="font-display font-extrabold text-xl text-white">
          Mi Squad & Convocatorias
        </h2>
        <p className="text-xs text-slate-400">
          Tus partidos confirmados, horarios de cancha y coordinación con compañeros.
        </p>
      </div>

      {/* Player Reputation Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/80 mb-5 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xl">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Tu Perfil de Jugador</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-bold">4.9 ★ Fair Play</span>
              <span>·</span>
              <span>18 partidos jugados</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntualidad</span>
            <span className="text-xs font-bold text-emerald-400">100%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Posición</span>
            <span className="text-xs font-bold text-white">Medio / Del</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Goles 2026</span>
            <span className="text-xs font-bold text-amber-400">14 ⚽</span>
          </div>
        </div>
      </div>

      {/* Confirmed Matches Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Próximos Partidos Confirmados
          </h3>
          <span className="text-xs text-emerald-400 font-bold">
            {confirmedMatches.length} en agenda
          </span>
        </div>

        {confirmedMatches.length > 0 ? (
          confirmedMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => onOpenTacticalPitch(match)}
              className="p-4 rounded-3xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wide">
                    Confirmado ✓
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1 leading-tight">
                    {match.titulo}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span className="text-emerald-400 font-bold">{match.modalidad}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.superficie}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-xs">{match.fecha_formato}</div>
                  <div className="text-emerald-400 font-bold text-xs">{match.hora_formato}</div>
                </div>
              </div>

              {/* Pitch and Location */}
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{match.cancha_nombre}</span>
                </div>
                <span className="font-mono text-white font-bold">${match.precio_por_jugador}</span>
              </div>

              {/* Squad members snippet and Tactical pitch button */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center -space-x-1.5">
                  {match.jugadores_confirmados.slice(0, 4).map((p) => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.nombre}
                      className="w-6 h-6 rounded-full border-2 border-slate-800 object-cover"
                    />
                  ))}
                  <span className="w-6 h-6 rounded-full bg-slate-750 border-2 border-slate-800 text-[9px] font-bold text-slate-300 flex items-center justify-center">
                    +{match.jugadores_confirmados.length - 4 > 0 ? match.jugadores_confirmados.length - 4 : 0}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound();
                    onOpenTacticalPitch(match);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Ver Alineación</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 text-center">
            <p className="text-xs text-slate-400 mb-3">No estás anotado en ningún partido aún.</p>
            <button
              onClick={() => {
                playTapSound();
                onExploreMatches();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Buscar Partidos Disponibles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
