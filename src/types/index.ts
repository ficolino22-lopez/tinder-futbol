export type PlayerPosition = 'Arquero' | 'Defensor' | 'Mediocampista' | 'Delantero' | 'Cualquiera';

export type PlayerLevel = 'Casual' | 'Intermedio' | 'Competitivo' | 'Pro';

export type MatchModality = 'F5' | 'F7' | 'F8' | 'F11';

export type PitchSurface = 'Césped Sintético' | 'Césped Natural' | 'Parquet Flotante' | 'Cemento';

export interface Player {
  id: string;
  nombre: string;
  avatar: string;
  posicion: PlayerPosition;
  nivel: PlayerLevel;
  calificacion?: number;
  partidosJugados?: number;
  telefono?: string;
}

export interface JoinRequest {
  id: string;
  partidoId: string;
  partidoTitulo: string;
  nombreJugador: string;
  avatar: string;
  posicion: PlayerPosition;
  nivel: PlayerLevel;
  mensaje: string;
  telefono: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
}

export interface Match {
  id: string;
  titulo: string;
  organizador: {
    nombre: string;
    avatar: string;
    calificacion: number;
    partidosOrganizados: number;
    telefono: string;
  };
  modalidad: MatchModality;
  es_mixto: boolean;
  genero: 'Mixto' | 'Libre' | 'Femenino' | 'Masculino';
  jugadores_faltantes: number;
  jugadores_totales: number;
  jugadores_confirmados: Player[];
  fecha_partido: string; // ISO string
  hora_formato: string;  // e.g. "20:30 hs"
  fecha_formato: string; // e.g. "Hoy, 24 Oct"
  cancha_nombre: string;
  cancha_direccion: string;
  superficie: PitchSurface;
  precio_por_jugador: number; // e.g. 3500
  nivel_requerido: string;
  distancia_km: number;
  descripcion: string;
  incluye_tercer_tiempo: boolean;
  tiene_chalecos_y_pelota: boolean;
  estado: 'abierto' | 'completo' | 'cancelado';
}

export type AppTab = 'descubrir' | 'swipe' | 'host' | 'mis_partidos';

export type UserRole = 'jugador' | 'host';
