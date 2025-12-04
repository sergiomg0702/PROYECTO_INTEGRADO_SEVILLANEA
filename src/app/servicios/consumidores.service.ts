import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consumidor } from '../modelos/consumidor';

@Injectable({
  providedIn: 'root',
})
export class ConsumidoresService {
  private url: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  // 2.1. LISTAR
  selectConsumidores(): Observable<Consumidor[]> {
    let param = JSON.stringify({
      accion: 'ListarConsumidores',
    });

    console.log('Método para listar consumidores, recibe: ', param);

    return this.http.post<Consumidor[]>(this.url, param);
  }

  // 2.1. OBTENER POR ID
  obtenerConsumidorId(id: number): Observable<Consumidor> {
    let param = JSON.stringify({
      accion: 'ObtenerConsumidorId',
      id: id,
    });

    console.log('Método para obtener consumidor por id, recibe: ', param);

    return this.http.post<Consumidor>(this.url, param);
  }

  // 2.2. AÑADIR
  anadirConsumidor(consumidor: Consumidor): Observable<Consumidor> {
    let param = JSON.stringify({
      accion: 'AnadeConsumidor',
      consumidor: consumidor,
    });

    console.log('Método para añadir consumidor, recibe: ', param);

    return this.http.post<Consumidor>(this.url, param);
  }

  // 2.3. MODIFICAR
  editarConsumidor(consumidor: Consumidor): Observable<Consumidor> {
    let param = JSON.stringify({
      accion: 'ModificaConsumidor',
      consumidor: consumidor,
    });

    console.log('Método para modificar consumidor, recibe: ', param);

    return this.http.post<Consumidor>(this.url, param);
  }

  // 2.4. BORRAR
  borrarConsumidor(consumidor: Consumidor): Observable<{ result: string }> {
    let param = JSON.stringify({
      accion: 'BorrarConsumidor',
      id: consumidor.id,
    });

    console.log('Método para borrar consumidor, recibe: ', param);

    return this.http.post<{ result: string }>(this.url, param);
  }
}
