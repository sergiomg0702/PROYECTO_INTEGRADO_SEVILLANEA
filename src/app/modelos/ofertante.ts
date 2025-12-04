export interface Ofertante {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  actividad: string;
  descripcion: string;
  dias_disponibles: string;
  horario: string;
  tarifa: number;
  duracion_minutos?: number;
  plazas_minimas?: number;
  plazas_maximas?: number;
  ubicacion?: string;
}