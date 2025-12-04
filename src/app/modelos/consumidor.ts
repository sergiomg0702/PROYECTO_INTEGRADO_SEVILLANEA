
export interface Consumidor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  descripcion_necesidades?: string;
  presupuesto_maximo?: number;
  actividad_id: number;  // FK a ofertantes.id
}