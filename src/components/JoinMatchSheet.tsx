import React, { useState } from 'react';
import { Match, PlayerPosition, PlayerLevel, JoinRequest } from '../types';
import { X, Zap, Shield, MapPin, Clock, DollarSign, Check, Phone } from 'lucide-react';
import { playTapSound, playMatchSuccessSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JoinMatchSheetProps {
  match: Match | null;
  onClose: () => void;
  onSubmitRequest: (req: Omit<JoinRequest, 'id' | 'fechaSolicitud' | 'estado'>) => void;
}

export const JoinMatchSheet: React.FC<JoinMatchSheetProps> = ({
  match,
  onClose,
  onSubmitRequest,
}) => {
  if (!match) return null;

  const [nombre, setNombre] = useState<string>('Federico C.');
  const [posicion, setPosicion] = useState<PlayerPosition>('Mediocampista');
  const [nivel, setNivel] = useState<PlayerLevel>('Intermedio');
  const [telefono, setTelefono] = useState<string>('+54 9 11 5599-2341');
  const [mensaje, setMensaje] = useState<string>('Me sumo con muchas ganas! Tengo botines para sintético y puedo jugar los 60 min sin problema.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const positions: { label: PlayerPosition; icon: string }[] = [
    { label: 'Arquero', icon: '🧤' },
    { label: 'Defensor', icon: '🛡️' },
    { label: 'Mediocampista', icon: '🎯' },
    { label: 'Delantero', icon: '⚡' },
  ];

  const levels: PlayerLevel[] = ['Casual', 'Intermedio', 'Competitivo'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    triggerHaptic('heavy');
    playMatchSuccessSound();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#14b8a6', '#f59e0b', '#ffffff'],
      });
    } catch {
      // silent
    }

    setTimeout(() => {
      onSubmitRequest({
        partidoId: match.id,
        partidoTitulo: match.titulo,
        nombreJugador: nombre,
        avatar: match.organizador.avatar,
        posicion,
        nivel,
        mensaje,
        telefono,
      });
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[420px] bg-slate-900 border-t border-slate-700/80 rounded-t-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Native Grab Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Sheet Top Navigation */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-display font-extrabold text-base text-white">
              ¡Quiero Jugar este Partido!
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">
              Solicitud directa al Capitán del equipo
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

        {/* Scrollable Form Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Match Snapshot Header */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-2">
            <div className="flex items-start justify-between">
              <span className="font-bold text-sm text-white">{match.titulo}</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Faltan {match.jugadores_faltantes}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{match.fecha_formato}, {match.hora_formato}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">${match.precio_por_jugador}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="truncate">{match.cancha_nombre}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tu Nombre o Apodo
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Fede 'El Rayo' López"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Position Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                ¿En qué posición preferís jugar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {positions.map((pos) => (
                  <button
                    type="button"
                    key={pos.label}
                    onClick={() => {
                      playTapSound();
                      setPosicion(pos.label);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      posicion === pos.label
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{pos.icon}</span>
                    <span>{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nivel de Juego
              </label>
              <div className="flex gap-2">
                {levels.map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => {
                      playTapSound();
                      setNivel(lvl);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      nivel === lvl
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp de Contacto</span>
              </label>
              <input
                type="text"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Solo visible para el Capitán si acepta tu solicitud para coordinar.
              </span>
            </div>

            {/* Note / Message */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Mensaje para el Capitán (Opcional)
              </label>
              <textarea
                rows={2}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¿Tenés botines? ¿Llevás guantes? ¿Llegás puntual?"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* Sticky Submit Button */}
            <div className="pt-2 pb-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all hover:brightness-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando al Capitán... ⏳</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-slate-950" />
                    <span>Confirmar Solicitud de Match ⚡</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
