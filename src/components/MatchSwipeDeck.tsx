import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Match } from '../types';
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  CheckCircle2,
  Beer,
  RefreshCw,
  X,
  Heart,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { playTapSound, playSwipeSound, triggerHaptic } from '../utils/audio';

interface MatchSwipeDeckProps {
  matches: Match[];
  onJoinMatch: (match: Match) => void;
  onOpenDetails: (match: Match) => void;
  onResetDeck: () => void;
}

export const MatchSwipeDeck: React.FC<MatchSwipeDeckProps> = ({
  matches,
  onJoinMatch,
  onOpenDetails,
  onResetDeck,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null);

  const currentMatch = matches[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentMatch) return;
    setLastDirection(direction);
    playSwipeSound(direction === 'right' ? 'like' : 'pass');
    triggerHaptic('medium');

    if (direction === 'right') {
      onJoinMatch(currentMatch);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setLastDirection(null);
    }, 200);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      playTapSound();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentMatch || currentIndex >= matches.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-slate-900/60">
        <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl mb-4 shadow-xl">
          🏟️
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          ¡Viste todos los partidos!
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mb-6">
          No hay más retas abiertas en tu radio inmediato por este momento. Podés reiniciar la pila o armar tu propio partido como Host.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-3">
          <button
            onClick={() => {
              playTapSound();
              setCurrentIndex(0);
              onResetDeck();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Volver a Ver Partidos</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4 pb-2 relative select-none">
      {/* Top Deck Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>FULBO MATCH Deck</span>
        </div>
        <div className="font-mono text-slate-300">
          {currentIndex + 1} / {matches.length}
        </div>
      </div>

      {/* Main Swipeable Card Stage */}
      <div className="relative w-full h-[520px] flex items-center justify-center">
        <AnimatePresence>
          <SwipeCard
            key={currentMatch.id}
            match={currentMatch}
            onSwipe={handleSwipe}
            onOpenDetails={() => onOpenDetails(currentMatch)}
          />
        </AnimatePresence>
      </div>

      {/* Tactile Tinder Action Controls Bar */}
      <div className="flex items-center justify-center gap-4 py-3">
        {/* Rewind */}
        <button
          onClick={handleRewind}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-md transition-all active:scale-90 ${
            currentIndex > 0
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
              : 'bg-slate-900 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
          }`}
          title="Deshacer último"
          aria-label="Deshacer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Pass (Reject / Next) */}
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-slate-800/90 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/60 text-rose-500 flex items-center justify-center shadow-lg active:scale-90 transition-all group"
          title="Pasar partido"
          aria-label="Pasar partido"
        >
          <X className="w-7 h-7 stroke-[2.5px] group-hover:scale-110 transition-transform" />
        </button>

        {/* Super Match / Detail */}
        <button
          onClick={() => {
            playTapSound();
            onOpenDetails(currentMatch);
          }}
          className="w-12 h-12 rounded-full bg-slate-800/90 hover:bg-sky-950/40 border border-slate-700 hover:border-sky-500/60 text-sky-400 flex items-center justify-center shadow-md active:scale-90 transition-all"
          title="Ver detalles de cancha y alineación"
          aria-label="Detalles"
        >
          <Zap className="w-5 h-5" />
        </button>

        {/* Like / ¡Quiero Jugar! */}
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/25 active:scale-90 transition-all group hover:brightness-110"
          title="¡Quiero Jugar! (Hacer Match)"
          aria-label="Quiero Jugar"
        >
          <Heart className="w-8 h-8 fill-slate-950 stroke-none group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

interface SwipeCardProps {
  match: Match;
  onSwipe: (dir: 'left' | 'right') => void;
  onOpenDetails: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ match, onSwipe, onOpenDetails }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacityLike = useTransform(x, [20, 100], [0, 1]);
  const opacityPass = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute w-full h-full rounded-3xl overflow-hidden bg-slate-800/95 border border-slate-700/80 shadow-2xl flex flex-col justify-between cursor-grab select-none"
    >
      {/* Top Visual Imagery Section */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        <img
          src={match.organizador.avatar}
          alt={match.titulo}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter brightness-95"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

        {/* Dynamic Stamp Overlays for Like and Pass */}
        <motion.div
          style={{ opacity: opacityLike }}
          className="absolute top-5 left-5 px-3 py-1.5 border-4 border-emerald-400 rounded-xl font-display font-extrabold text-emerald-400 text-lg uppercase tracking-wider transform -rotate-12 pointer-events-none z-20 bg-slate-950/60"
        >
          ¡QUIERO JUGAR! ⚽
        </motion.div>

        <motion.div
          style={{ opacity: opacityPass }}
          className="absolute top-5 right-5 px-3 py-1.5 border-4 border-rose-500 rounded-xl font-display font-extrabold text-rose-500 text-lg uppercase tracking-wider transform rotate-12 pointer-events-none z-20 bg-slate-950/60"
        >
          PASAR ✕
        </motion.div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              {match.modalidad} · {match.genero}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white font-extrabold text-[11px] tracking-wide shadow-md flex items-center gap-1 animate-pulse">
            <Users className="w-3.5 h-3.5" />
            <span>FALTAN {match.jugadores_faltantes}</span>
          </div>
        </div>

        {/* Host Mini Pill Floating on Image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
            👤
          </div>
          <span className="text-xs font-semibold text-slate-200">{match.organizador.nombre}</span>
          <div className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{match.organizador.calificacion}</span>
          </div>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-display font-extrabold text-xl text-white leading-tight mb-1">
            {match.titulo}
          </h2>

          {/* Clean Unboxed Metadata as mandated by frontend-design */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 mb-3">
            <span>{match.cancha_nombre}</span>
            <span aria-hidden="true">·</span>
            <span>{match.distancia_km} km</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold">{match.superficie}</span>
          </div>

          {/* Key Match Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800 mb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">{match.hora_formato}</div>
                <div className="text-[11px] text-slate-400">{match.fecha_formato}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">${match.precio_por_jugador}</div>
                <div className="text-[11px] text-slate-400">por jugador</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {match.descripcion}
          </p>
        </div>

        {/* Perks & Details Trigger */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {match.tiene_chalecos_y_pelota && (
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Pechera y Pelota
              </span>
            )}
            {match.incluye_tercer_tiempo && (
              <span className="flex items-center gap-1 text-amber-300">
                <Beer className="w-3.5 h-3.5" />
                3er Tiempo
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2"
          >
            Ver Cancha →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
