import React, { useState } from 'react';
import { Match, MatchModality } from '../types';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Filter,
  CheckCircle2,
  Beer,
  ChevronRight,
  Shield,
  Star,
  Plus,
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/audio';

interface MatchListFeedProps {
  matches: Match[];
  onJoinMatch: (match: Match) => void;
  onOpenDetails: (match: Match) => void;
  onCreateMatchPrompt: () => void;
}

export const MatchListFeed: React.FC<MatchListFeedProps> = ({
  matches,
  onJoinMatch,
  onOpenDetails,
  onCreateMatchPrompt,
}) => {
  const [filterModality, setFilterModality] = useState<string>('todos');
  const [filterMixtoOnly, setFilterMixtoOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const modalities = ['todos', 'F5', 'F7', 'F8', 'F11'];

  const filteredMatches = matches.filter((m) => {
    if (filterModality !== 'todos' && m.modalidad !== filterModality) return false;
    if (filterMixtoOnly && !m.es_mixto) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.titulo} ${m.cancha_nombre} ${m.organizador.nombre}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      {/* Search & Location Bar */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por zona, cancha o título..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {modalities.map((mod) => (
          <button
            key={mod}
            onClick={() => {
              playTapSound();
              setFilterModality(mod);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterModality === mod
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            {mod === 'todos' ? 'Todos los Formatos' : mod}
          </button>
        ))}

        <button
          onClick={() => {
            playTapSound();
            setFilterMixtoOnly(!filterMixtoOnly);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            filterMixtoOnly
              ? 'bg-teal-500/20 border-teal-400 text-teal-300'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
          }`}
        >
          {filterMixtoOnly ? '✓ Solo Mixtos' : 'Mixto'}
        </button>
      </div>

      {/* Feed List Header */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs">
        <span className="font-semibold text-slate-300">
          {filteredMatches.length} partidos disponibles cerca
        </span>
        <span className="text-[11px] text-emerald-400 font-medium">En vivo</span>
      </div>

      {/* Match Cards */}
      <div className="space-y-3.5">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <article
              key={match.id}
              onClick={() => onOpenDetails(match)}
              className="bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 rounded-3xl p-4 transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-lg group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-300 transition-colors leading-tight">
                    {match.titulo}
                  </h3>
                  {/* Unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-emerald-400">{match.modalidad}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.es_mixto ? 'Mixto' : 'Libre'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.superficie}</span>
                  </div>
                </div>

                {/* Missing Players Badge */}
                <div className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-extrabold whitespace-nowrap flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Faltan {match.jugadores_faltantes}</span>
                </div>
              </div>

              {/* Roster Capacity Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span>Convocatoria: {match.jugadores_totales - match.jugadores_faltantes}/{match.jugadores_totales} confirmados</span>
                  <span className="text-amber-400 font-semibold">{Math.round(((match.jugadores_totales - match.jugadores_faltantes) / match.jugadores_totales) * 100)}% listo</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{
                      width: `${((match.jugadores_totales - match.jugadores_faltantes) / match.jugadores_totales) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Pitch Info & Time */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80 mb-3 text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">
                    {match.fecha_formato}, {match.hora_formato}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{match.cancha_nombre}</span>
                </div>
              </div>

              {/* Host & Price strip */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <img
                    src={match.organizador.avatar}
                    alt={match.organizador.nombre}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-slate-300 text-[11px] font-medium truncate max-w-[120px]">
                    {match.organizador.nombre}
                  </span>
                  <div className="flex items-center text-amber-400 text-[10px] font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{match.organizador.calificacion}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-white font-extrabold text-sm">${match.precio_por_jugador}</span>
                  <span className="text-[10px] text-slate-400 ml-1">/ jug.</span>
                </div>
              </div>

              {/* Primary Action Button ("¡Quiero Jugar!") */}
              <div className="pt-3 flex gap-2 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound();
                    triggerHaptic('medium');
                    onJoinMatch(match);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>¡Quiero Jugar! ⚡</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound();
                    onOpenDetails(match);
                  }}
                  className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all"
                  title="Ver cancha y formación"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 text-center my-6">
            <div className="text-3xl mb-2">⚽</div>
            <h4 className="font-bold text-white text-sm mb-1">No hay partidos con estos filtros</h4>
            <p className="text-slate-400 text-xs max-w-xs mx-auto mb-4">
              Probá seleccionando "Todos los Formatos" o creá una nueva convocatoria vos mismo.
            </p>
            <button
              onClick={() => {
                playTapSound();
                setFilterModality('todos');
                setFilterMixtoOnly(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Floating Quick Create Match Prompt */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/70 text-center">
        <h4 className="text-xs font-bold text-white mb-1">¿Tenés cancha reservada y te faltan jugadores?</h4>
        <p className="text-[11px] text-slate-400 mb-3">
          Publicá tu partido como Host y recibí solicitudes de jugadores en tu zona al instante.
        </p>
        <button
          onClick={() => {
            playTapSound();
            onCreateMatchPrompt();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Partido como Host</span>
        </button>
      </div>
    </div>
  );
};
