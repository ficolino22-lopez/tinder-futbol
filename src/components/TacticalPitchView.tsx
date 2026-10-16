import React from 'react';
import { Match, Player } from '../types';
import { tacticalPitch } from '../data/initialData';
import { X, Users, Share2, Check, Shield, MapPin, Clock } from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/audio';

interface TacticalPitchViewProps {
  match: Match | null;
  onClose: () => void;
  onOpenRequests: () => void;
}

export const TacticalPitchView: React.FC<TacticalPitchViewProps> = ({
  match,
  onClose,
  onOpenRequests,
}) => {
  if (!match) return null;

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    playTapSound();
    triggerHaptic('light');
    const text = `⚽ ¡Convocatoria ${match.titulo}!
📅 ${match.fecha_formato} a las ${match.hora_formato}
📍 ${match.cancha_nombre} (${match.superficie})
👥 Faltan ${match.jugadores_faltantes} jugadores para completar los ${match.jugadores_totales}.
💰 $${match.precio_por_jugador} por persona.
¡Sumate por FULBO MATCH!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Group players by position
  const arqueros = match.jugadores_confirmados.filter((p) => p.posicion === 'Arquero');
  const defensores = match.jugadores_confirmados.filter((p) => p.posicion === 'Defensor');
  const medios = match.jugadores_confirmados.filter((p) => p.posicion === 'Mediocampista');
  const delanteros = match.jugadores_confirmados.filter((p) => p.posicion === 'Delantero');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[420px] bg-slate-900 border-t border-slate-700/80 rounded-t-[32px] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Top Header */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-display font-extrabold text-base text-white">
              Cancha & Alineación Táctica
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">
              {match.modalidad} · {match.jugadores_confirmados.length}/{match.jugadores_totales} Confirmados
            </p>
          </div>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4">
          {/* Match Snapshot */}
          <div className="p-3 bg-slate-800/80 border border-slate-700/70 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white text-sm leading-tight">{match.titulo}</div>
              <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{match.fecha_formato}, {match.hora_formato}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Tactical Football Pitch Board */}
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-emerald-950 flex flex-col justify-between p-3 select-none">
            {/* Pitch Grass Texture */}
            <div className="absolute inset-0 opacity-40">
              <img
                src={tacticalPitch}
                alt="Superficie de cancha táctica"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-950/60 to-emerald-900/40" />

            {/* Tactical Chalk Lines (SVG Overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/35 stroke-[2] fill-none">
              {/* Outer boundary */}
              <rect x="12" y="12" width="calc(100% - 24px)" height="calc(100% - 24px)" rx="12" />
              {/* Halfway line */}
              <line x1="12" y1="50%" x2="calc(100% - 12px)" y2="50%" />
              {/* Center Circle */}
              <circle cx="50%" cy="50%" r="42" />
              <circle cx="50%" cy="50%" r="3" className="fill-white/40" />
              {/* Top Goal Box */}
              <rect x="25%" y="12" width="50%" height="45" />
              <rect x="36%" y="12" width="28%" height="18" />
              {/* Bottom Goal Box */}
              <rect x="25%" y="calc(100% - 57px)" width="50%" height="45" />
              <rect x="36%" y="calc(100% - 30px)" width="28%" height="18" />
            </svg>

            {/* Tactical Formation Zones */}
            {/* Zone 1: Delanteros (Attack) */}
            <div className="relative z-10 flex justify-around items-center pt-3">
              {delanteros.length > 0 ? (
                delanteros.slice(0, 3).map((p) => (
                  <PitchPlayerPin key={p.id} player={p} />
                ))
              ) : (
                <EmptySlotPin label="Delantero" onOpenRequests={onOpenRequests} />
              )}
            </div>

            {/* Zone 2: Mediocampistas (Midfield) */}
            <div className="relative z-10 flex justify-around items-center py-2">
              {medios.length > 0 ? (
                medios.slice(0, 3).map((p) => (
                  <PitchPlayerPin key={p.id} player={p} />
                ))
              ) : (
                <EmptySlotPin label="Volante" onOpenRequests={onOpenRequests} />
              )}
            </div>

            {/* Zone 3: Defensores (Defense) */}
            <div className="relative z-10 flex justify-around items-center py-2">
              {defensores.length > 0 ? (
                defensores.slice(0, 3).map((p) => (
                  <PitchPlayerPin key={p.id} player={p} />
                ))
              ) : (
                <EmptySlotPin label="Defensor" onOpenRequests={onOpenRequests} />
              )}
            </div>

            {/* Zone 4: Arquero (Goalkeeper) */}
            <div className="relative z-10 flex justify-center items-center pb-2">
              {arqueros.length > 0 ? (
                <PitchPlayerPin player={arqueros[0]} isGK />
              ) : (
                <EmptySlotPin label="Arquero" isGK onOpenRequests={onOpenRequests} />
              )}
            </div>
          </div>

          {/* Missing Players Callout if any */}
          {match.jugadores_faltantes > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-rose-300">
                  Faltan {match.jugadores_faltantes} jugadores en este partido
                </span>
              </div>
              <button
                onClick={() => {
                  playTapSound();
                  onOpenRequests();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
              >
                Ver Solicitudes
              </button>
            </div>
          )}

          {/* Confirmed Roster List */}
          <div>
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2">
              Lista de Convocados ({match.jugadores_confirmados.length})
            </h4>
            <div className="space-y-1.5">
              {match.jugadores_confirmados.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-slate-500 text-[11px] min-w-[14px]">
                      {idx + 1}.
                    </span>
                    <img
                      src={p.avatar}
                      alt={p.nombre}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white text-xs">{p.nombre}</span>
                      <span className="text-[10px] text-emerald-400 block">{p.posicion}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">{p.nivel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PitchPlayerPin: React.FC<{ player: Player; isGK?: boolean }> = ({ player, isGK }) => (
  <div className="flex flex-col items-center group cursor-pointer">
    <div
      className={`w-9 h-9 rounded-full border-2 shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 ${
        isGK
          ? 'border-amber-400 bg-amber-500/30'
          : 'border-emerald-300 bg-emerald-500/30'
      }`}
    >
      <img src={player.avatar} alt={player.nombre} className="w-full h-full object-cover" />
    </div>
    <span className="mt-1 px-1.5 py-0.2 rounded-md bg-slate-950/90 text-white font-bold text-[9px] shadow-md border border-slate-700 truncate max-w-[65px]">
      {player.nombre.split(' ')[0]}
    </span>
  </div>
);

const EmptySlotPin: React.FC<{ label: string; isGK?: boolean; onOpenRequests: () => void }> = ({
  label,
  isGK,
  onOpenRequests,
}) => (
  <button
    onClick={() => {
      playTapSound();
      onOpenRequests();
    }}
    className="flex flex-col items-center group active:scale-95 transition-transform"
  >
    <div
      className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center font-bold text-xs transition-colors ${
        isGK
          ? 'border-amber-400/80 bg-amber-950/40 text-amber-300'
          : 'border-rose-400/80 bg-rose-950/40 text-rose-300 animate-pulse'
      }`}
    >
      +
    </div>
    <span className="mt-1 px-1.5 py-0.2 rounded-md bg-slate-950/80 text-rose-300 font-bold text-[9px] shadow-md border border-rose-500/30">
      Falta {label}
    </span>
  </button>
);
