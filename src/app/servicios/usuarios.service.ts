import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { Ofertante } from '../modelos/ofertante';
import { Consumidor } from '../modelos/consumidor';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = environment.API_URL;

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    const body = {
      accion: 'RegistrarUsuario',
      usuario: usuario,
    };
    return this.http.post<Usuario>(this.url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  // usuarios.service.ts
  obtenerUsuarioId(id: number) {
    return this.http.post<Usuario>(
      this.url,
      {
        accion: 'ObtenerUsuarioId',
        id: id,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  loginUsuario(email: string, password: string) {
    return this.http.post(
      this.url,
      {
        accion: 'LoginUsuario',
        email,
        password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  /*
  modificarUsuario(usuario: Usuario) {
    return this.http.post(this.url, {
      accion: 'ModificaUsuario',
      usuario,
    });
  }

  */

  modificarUsuario(usuario: Usuario) {
    return this.http.post(this.url, {
      accion: 'ModificaUsuario',
      usuario,
    });
  }

  borrarUsuario(id: number) {
    return this.http.post(this.url, {
      accion: 'BorrarUsuario',
      id,
    });
  }

  getListaOfertantes(): Observable<Ofertante[]> {
    return this.http.post<Ofertante[]>(
      this.url,
      { accion: 'ListarOfertantes' },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getListaConsumidores(): Observable<Consumidor[]> {
    return this.http.post<Consumidor[]>(
      this.url,
      { accion: 'ListarConsumidores' },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
