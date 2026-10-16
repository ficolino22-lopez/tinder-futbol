import React from 'react';
import { Match } from '../types';
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Shield,
  Star,
  CheckCircle2,
  Beer,
  Phone,
  Zap,
  Calendar,
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/audio';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  onJoin: (match: Match) => void;
  onOpenPitch: (match: Match) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  onJoin,
  onOpenPitch,
}) => {
  if (!match) return null;

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

        {/* Modal Header */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-display font-extrabold text-base text-white">
              Ficha del Partido
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">
              {match.modalidad} · {match.genero} · {match.superficie}
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

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Main Title & Slot Badge */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h2 className="font-display font-extrabold text-xl text-white leading-tight">
                {match.titulo}
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-extrabold text-xs whitespace-nowrap">
                Faltan {match.jugadores_faltantes}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{match.cancha_direccion} ({match.distancia_km} km)</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Horario</span>
              <span className="font-bold text-white text-xs block mt-0.5">{match.hora_formato}</span>
              <span className="text-[10px] text-emerald-400">{match.fecha_formato}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cupo</span>
              <span className="font-bold text-white text-xs block mt-0.5">
                {match.jugadores_totales - match.jugadores_faltantes}/{match.jugadores_totales}
              </span>
              <span className="text-[10px] text-amber-400">Confirmados</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Costo</span>
              <span className="font-bold text-white text-xs block mt-0.5">${match.precio_por_jugador}</span>
              <span className="text-[10px] text-slate-400">por persona</span>
            </div>
          </div>

          {/* Host Information */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={match.organizador.avatar}
                alt={match.organizador.nombre}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">{match.organizador.nombre}</span>
                  <Shield className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <div className="flex items-center text-amber-400 font-bold gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{match.organizador.calificacion}</span>
                  </div>
                  <span>·</span>
                  <span>{match.organizador.partidosOrganizados} partidos hosteados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-1.5">
              Sobre el Partido
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
              {match.descripcion}
            </p>
          </div>

          {/* Perks & Rules */}
          <div>
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2">
              Servicios incluidos en la cancha
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pelotas & Pecheras</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vestuarios con ducha</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Estacionamiento</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center gap-2 text-slate-200">
                <Beer className="w-4 h-4 text-amber-400" />
                <span>Tercer Tiempo / Bar</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2 pb-1">
            <button
              onClick={() => {
                playTapSound();
                triggerHaptic('medium');
                onJoin(match);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all hover:brightness-105"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>¡Quiero Jugar este Partido! ⚡</span>
            </button>

            <button
              onClick={() => {
                playTapSound();
                onOpenPitch(match);
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-colors"
            >
              <span>Ver Alineación en Cancha Táctica 📋</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
