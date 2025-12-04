import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';

import { HttpClient } from '@angular/common/http';

import { Ofertante } from '../modelos/ofertante';

@Injectable({
  providedIn: 'root',
})
export class OfertantesService {
  private url: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  // ==========================
  // LISTAR Y OBTENER
  // ==========================

  selectOfertantes() {
    const param = JSON.stringify({ accion: 'ListarOfertantes' });
    return this.http.post<Ofertante[]>(this.url, param);
  }

  selectOfertante(id: number) {
    const param = JSON.stringify({ accion: 'ObtenerOfertanteId', id });
    return this.http.post<Ofertante>(this.url, param);
  }

  // ==========================
  // AÑADIR
  // ==========================

  anadirOfertante(ofertante: Ofertante) {
    const payload = {
      nombre: ofertante.nombre,
      apellidos: ofertante.apellidos,
      email: ofertante.email,
      telefono: ofertante.telefono,
      actividad: ofertante.actividad,
      descripcion: ofertante.descripcion,
      dias_disponibles: ofertante.dias_disponibles,
      horario: ofertante.horario,
      tarifa: ofertante.tarifa,
      duracion_minutos: ofertante.duracion_minutos,
      plazas_minimas: ofertante.plazas_minimas,
      plazas_maximas: ofertante.plazas_maximas,
      ubicacion: ofertante.ubicacion,
    };

    const param = JSON.stringify({
      accion: 'AnadeOfertante',
      ofertante: payload,
    });
    return this.http.post<{ result: string }>(this.url, param);
  }

  // ==========================
  // MODIFICAR
  // ==========================

  modificaOfertante(ofertante: Ofertante) {
    const payload = {
      id: ofertante.id,
      nombre: ofertante.nombre,
      apellidos: ofertante.apellidos,
      email: ofertante.email,
      telefono: ofertante.telefono,
      actividad: ofertante.actividad,
      descripcion: ofertante.descripcion,
      dias_disponibles: ofertante.dias_disponibles,
      horario: ofertante.horario,
      tarifa: ofertante.tarifa,
      duracion_minutos: ofertante.duracion_minutos,
      plazas_minimas: ofertante.plazas_minimas,
      plazas_maximas: ofertante.plazas_maximas,
      ubicacion: ofertante.ubicacion,
    };

    const param = JSON.stringify({
      accion: 'ModificaOfertante',
      ofertante: payload,
    });
    return this.http.post<{ result: string }>(this.url, param);
  }

  // ==========================
  // BORRAR
  // ==========================

  borraOfertante(ofertante: Ofertante) {
    const param = JSON.stringify({
      accion: 'BorrarOfertante',
      id: ofertante.id,
    });
    return this.http.post(this.url, param, { responseType: 'text' });
  }
}
