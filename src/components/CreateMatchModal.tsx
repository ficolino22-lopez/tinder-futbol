import React, { useState } from 'react';
import { Match, MatchModality, PitchSurface } from '../types';
import { X, Plus, Minus, Calendar, Clock, MapPin, DollarSign, Zap, Check } from 'lucide-react';
import { playTapSound, playMatchSuccessSound, triggerHaptic } from '../utils/audio';
import { hostAvatar } from '../data/initialData';
import confetti from 'canvas-confetti';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchCreated: (newMatch: Match) => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onMatchCreated,
}) => {
  if (!isOpen) return null;

  const [titulo, setTitulo] = useState<string>('Reta Nocturna de Viernes F7');
  const [modalidad, setModalidad] = useState<MatchModality>('F7');
  const [jugadoresFaltantes, setJugadoresFaltantes] = useState<number>(2);
  const [esMixto, setEsMixto] = useState<boolean>(false);
  const [fechaDia, setFechaDia] = useState<string>('Hoy');
  const [hora, setHora] = useState<string>('21:00 hs');
  const [canchaNombre, setCanchaNombre] = useState<string>('Canchas El Monumento');
  const [canchaDireccion, setCanchaDireccion] = useState<string>('Av. Santa Fe 3400, Palermo');
  const [superficie, setSuperficie] = useState<PitchSurface>('Césped Sintético');
  const [precio, setPrecio] = useState<number>(3500);
  const [descripcion, setDescripcion] = useState<string>(
    'Partido parejo y dinámico. Llevamos pecheras y pelota Penalty. Cancha techada.'
  );

  const modalityPlayersMap: Record<MatchModality, number> = {
    F5: 10,
    F7: 14,
    F8: 16,
    F11: 22,
  };

  const handleModalityChange = (mod: MatchModality) => {
    playTapSound();
    setModalidad(mod);
    const total = modalityPlayersMap[mod];
    if (jugadoresFaltantes > total) {
      setJugadoresFaltantes(2);
    }
  };

  const handleStepper = (delta: number) => {
    playTapSound();
    triggerHaptic('light');
    const total = modalityPlayersMap[modalidad];
    setJugadoresFaltantes((prev) => Math.max(1, Math.min(total - 1, prev + delta)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    triggerHaptic('heavy');
    playMatchSuccessSound();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#14b8a6', '#6366f1', '#ffffff'],
      });
    } catch {
      // silent
    }

    const total = modalityPlayersMap[modalidad];
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      titulo,
      organizador: {
        nombre: 'Vos (Capitán)',
        avatar: hostAvatar,
        calificacion: 5.0,
        partidosOrganizados: 12,
        telefono: '+54 9 11 9988-7766',
      },
      modalidad,
      es_mixto: esMixto,
      genero: esMixto ? 'Mixto' : 'Libre',
      jugadores_faltantes: jugadoresFaltantes,
      jugadores_totales: total,
      jugadores_confirmados: [
        {
          id: `p-${Date.now()}-1`,
          nombre: 'Vos (Capitán)',
          avatar: hostAvatar,
          posicion: 'Mediocampista',
          nivel: 'Competitivo',
          calificacion: 5.0,
        },
      ],
      fecha_partido: new Date().toISOString(),
      hora_formato: hora,
      fecha_formato: fechaDia,
      cancha_nombre: canchaNombre,
      cancha_direccion: canchaDireccion,
      superficie,
      precio_por_jugador: precio,
      nivel_requerido: 'Intermedio / Buena onda',
      distancia_km: 1.2,
      descripcion,
      incluye_tercer_tiempo: true,
      tiene_chalecos_y_pelota: true,
      estado: 'abierto',
    };

    onMatchCreated(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-[420px] bg-slate-900 border-t border-slate-700/80 rounded-t-[32px] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-2 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-display font-extrabold text-base text-white">
              Publicar Nuevo Partido
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">
              Convocatoria instantánea para el Match Deck
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Match Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Título del Partido
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Clásico de Jueves F7 en Palermo"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Modality Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Modalidad de Fútbol
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['F5', 'F7', 'F8', 'F11'] as MatchModality[]).map((mod) => (
                <button
                  type="button"
                  key={mod}
                  onClick={() => handleModalityChange(mod)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                    modalidad === mod
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {mod}
                  <span className="block text-[10px] font-normal text-slate-400">
                    {modalityPlayersMap[mod]} jug.
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stepper: Jugadores Faltantes */}
          <div className="bg-slate-800/80 border border-slate-700/70 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Jugadores Faltantes</span>
              <span className="text-[11px] text-slate-400">
                Cupos vacíos que aparecerán en el radar
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleStepper(-1)}
                className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold active:scale-90 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-display font-extrabold text-xl text-emerald-400 min-w-[28px] text-center">
                {jugadoresFaltantes}
              </span>
              <button
                type="button"
                onClick={() => handleStepper(1)}
                className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>
          </div>

          {/* Mixto Toggle Switch */}
          <div className="bg-slate-800/80 border border-slate-700/70 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">¿Es Partido Mixto?</span>
              <span className="text-[11px] text-slate-400">
                Habilita la etiqueta destacada para equipos mixtos
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playTapSound();
                setEsMixto(!esMixto);
              }}
              className={`w-13 h-7 rounded-full p-1 transition-colors ${
                esMixto ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  esMixto ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Día
              </label>
              <select
                value={fechaDia}
                onChange={(e) => setFechaDia(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Hoy">Hoy</option>
                <option value="Mañana">Mañana</option>
                <option value="Este Viernes">Este Viernes</option>
                <option value="Este Sábado">Este Sábado</option>
                <option value="Este Domingo">Este Domingo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Horario
              </label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="19:00 hs">19:00 hs</option>
                <option value="20:00 hs">20:00 hs</option>
                <option value="20:30 hs">20:30 hs</option>
                <option value="21:00 hs">21:00 hs</option>
                <option value="21:30 hs">21:30 hs</option>
                <option value="22:00 hs">22:00 hs</option>
                <option value="22:30 hs">22:30 hs</option>
              </select>
            </div>
          </div>

          {/* Cancha y Dirección */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Cancha / Complejo Deportivo
            </label>
            <input
              type="text"
              required
              value={canchaNombre}
              onChange={(e) => setCanchaNombre(e.target.value)}
              placeholder="Ej. Complejo Palermo Gol"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white mb-2 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={canchaDireccion}
              onChange={(e) => setCanchaDireccion(e.target.value)}
              placeholder="Dirección aproximada (ej. Av. Cabildo 1500)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Precio y Superficie */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Superficie
              </label>
              <select
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value as PitchSurface)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Césped Sintético">Césped Sintético</option>
                <option value="Césped Natural">Césped Natural</option>
                <option value="Parquet Flotante">Parquet Flotante</option>
                <option value="Cemento">Cemento</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Costo / Jugador ($)
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sticky Submit Button */}
          <div className="pt-2 pb-1">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all hover:brightness-105"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Publicar para Match ⚡</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
