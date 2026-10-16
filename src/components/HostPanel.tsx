import React, { useState } from 'react';
import { Match, JoinRequest } from '../types';
import {
  Plus,
  Check,
  X,
  Users,
  Shield,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Share2,
  Calendar,
} from 'lucide-react';
import { playTapSound, playMatchSuccessSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface HostPanelProps {
  matches: Match[];
  requests: JoinRequest[];
  onAcceptRequest: (reqId: string) => void;
  onRejectRequest: (reqId: string) => void;
  onOpenCreateModal: () => void;
  onOpenTacticalPitch: (match: Match) => void;
}

export const HostPanel: React.FC<HostPanelProps> = ({
  matches,
  requests,
  onAcceptRequest,
  onRejectRequest,
  onOpenCreateModal,
  onOpenTacticalPitch,
}) => {
  const pendingRequests = requests.filter((r) => r.estado === 'pendiente');
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  const handleAccept = (req: JoinRequest) => {
    triggerHaptic('heavy');
    playMatchSuccessSound();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#ffffff'],
      });
    } catch {
      // silent
    }

    onAcceptRequest(req.id);
    setAcceptedToast(`¡${req.nombreJugador} sumado al partido! ⚽`);
    setTimeout(() => setAcceptedToast(null), 3000);
  };

  const handleReject = (reqId: string) => {
    playTapSound();
    triggerHaptic('light');
    onRejectRequest(reqId);
  };

  const totalOpenSlots = matches.reduce((acc, m) => acc + m.jugadores_faltantes, 0);

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 select-none">
      {/* Toast Notification */}
      {acceptedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3px]" />
          <span>{acceptedToast}</span>
        </div>
      )}

      {/* Top Host Metrics Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">
              Panel de Convocatoria
            </h2>
            <p className="text-xs text-slate-400">
              Gestioná tus partidos, cupos y solicitudes de jugadores en tiempo real.
            </p>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onOpenCreateModal();
            }}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span className="hidden sm:inline">Nuevo Partido</span>
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Partidos
            </span>
            <div className="font-display text-2xl font-black text-white mt-0.5">
              {matches.length}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Activos</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl relative overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Solicitudes
            </span>
            <div className="font-display text-2xl font-black text-amber-400 mt-0.5">
              {pendingRequests.length}
            </div>
            <span className="text-[10px] text-amber-300 font-medium">
              {pendingRequests.length > 0 ? 'Por revisar' : 'Al día ✓'}
            </span>
            {pendingRequests.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Cupos Libres
            </span>
            <div className="font-display text-2xl font-black text-rose-400 mt-0.5">
              {totalOpenSlots}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Buscando</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button to Publish Match */}
      <button
        onClick={() => {
          playTapSound();
          onOpenCreateModal();
        }}
        className="w-full py-3.5 px-4 mb-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105"
      >
        <Plus className="w-5 h-5 stroke-[3px]" />
        <span>⚡ Publicar Nuevo Partido para Match</span>
      </button>

      {/* Section 1: Solicitudes Pendientes (Elevated Core Feature) */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Solicitudes de Jugadores
            </h3>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                {pendingRequests.length} pendientes
              </span>
            )}
          </div>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-3">
            {pendingRequests.map((solicitud) => (
              <div
                key={solicitud.id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 shadow-lg transition-all"
              >
                {/* Header: Player Info */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={solicitud.avatar}
                      alt={solicitud.nombreJugador}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white leading-tight">
                        {solicitud.nombreJugador}
                      </h4>
                      {/* Unboxed metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{solicitud.posicion}</span>
                        <span aria-hidden="true">·</span>
                        <span>{solicitud.nivel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-500">{solicitud.fechaSolicitud}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Match */}
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 mb-2.5">
                  <span className="text-[11px] text-slate-400 block">Postuló para:</span>
                  <span className="font-semibold text-white truncate block">
                    {solicitud.partidoTitulo}
                  </span>
                </div>

                {/* Message note */}
                {solicitud.mensaje && (
                  <p className="text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-800/80 italic mb-3">
                    "{solicitud.mensaje}"
                  </p>
                )}

                {/* Contact phone snippet */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-slate-300">{solicitud.telefono}</span>
                  </div>
                </div>

                {/* Tactile Accept / Reject Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(solicitud)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Aceptar y Sumar al Equipo ✓</span>
                  </button>

                  <button
                    onClick={() => handleReject(solicitud.id)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                    title="Rechazar solicitud"
                  >
                    <X className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-xs text-slate-300 font-semibold mb-0.5">
              No tenés solicitudes pendientes
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Cuando un jugador deslice en tu partido o pulse "¡Quiero Jugar!", aparecerá aquí de inmediato.
            </p>
          </div>
        )}
      </section>

      {/* Section 2: Tus Partidos Publicados */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Tus Partidos Organizados ({matches.length})
          </h3>
        </div>

        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {match.titulo}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span className="font-bold text-emerald-400">{match.modalidad}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.fecha_formato}, {match.hora_formato}</span>
                    <span aria-hidden="true">·</span>
                    <span>{match.cancha_nombre}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold whitespace-nowrap">
                    Faltan {match.jugadores_faltantes}
                  </span>
                </div>
              </div>

              {/* Roster & Squad summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {match.jugadores_totales - match.jugadores_faltantes}/{match.jugadores_totales} jugadores listos
                  </span>
                </div>

                <button
                  onClick={() => {
                    playTapSound();
                    onOpenTacticalPitch(match);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Alineación Cancha</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
