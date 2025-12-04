import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  constructor(private http: HttpClient) {}

  /** No he puesto ninguna API porque no se va a enviar la información a ninguna base de datos para guardar la información,
   * es algo ficticio de prueba a modo de simulación
   */

  /** Por ahora, simulación de envío con retraso */
  enviarMensaje(datos: any): Observable<any> {
    console.log('Mensaje enviado:', datos);
    return of({ ok: true }).pipe(delay(1200));
  }
}
