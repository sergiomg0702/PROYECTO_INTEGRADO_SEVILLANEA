import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ofertante } from '../../modelos/ofertante';
import { OfertantesService } from '../../servicios/ofertantes.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ofertantes',
  imports: [RouterLink, NgFor],
  templateUrl: './ofertantes.component.html',
  styleUrl: './ofertantes.component.css',
})
export class OfertantesComponent implements OnInit {
  /** Efecto del navbar */
  @HostListener('window:scroll')
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const topBar = document.querySelector('.top-bar-sevillanea') as HTMLElement;

    if (window.scrollY > 80) {
      topBar?.classList.add('hidden');
      navbar?.classList.add('fixed-top');
    } else {
      topBar?.classList.remove('hidden');
      navbar?.classList.remove('fixed-top');
    }
  }

  //sube hacia la parte de arriba de la página
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ofertantes: Ofertante[] = [];
  mensajeError: string = '';

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  constructor(private servicio: OfertantesService) {}

  ngOnInit(): void {
    this.cargarOfertantes();
    this.comprobarSesion();
  }

  cargarOfertantes() {
    this.servicio.selectOfertantes().subscribe({
      next: (res) => (this.ofertantes = res),
      error: (err) => console.error('Error cargando ofertantes:', err),
    });
  }

  /** Comprobar si hay usuario logueado */
  comprobarSesion() {
    const data = localStorage.getItem('usuario');

    if (!data) {
      this.isLoggedIn = false;
      this.usuarioLogueado = false;
      return;
    }

    try {
      this.usuario = JSON.parse(data);
      this.isLoggedIn = true;
      this.usuarioLogueado = true;
    } catch {
      this.isLoggedIn = false;
      this.usuarioLogueado = false;
      console.error('Error leyendo usuario del localStorage');
    }
  }

  /** Borrar actividad */
  borrarOfertante(ofertante: Ofertante) {
    if (
      confirm(
        `¿Estás seguro de que deseas borrar al ofertante: ${ofertante.nombre}?`
      )
    ) {
      this.servicio.borraOfertante(ofertante).subscribe({
        next: (response) => {
          console.log('Respuesta al borrar:', response);

          if (
            typeof response === 'string' &&
            response.includes('SQLSTATE[23000]')
          ) {
            this.mostrarError(
              'No se puede borrar la actividad seleccionada, puesto que ya está asociada a un consumidor de la comunidad'
            );
          } else {
            this.mensajeError = '';
          }

          this.cargarOfertantes();
        },
        error: (err) => {
          console.error('Error en borrado:', err);
          this.mostrarError('Error al intentar borrar la actividad.');
        },
      });
    }
  }

  mostrarError(msg: string) {
    this.mensajeError = msg;
    setTimeout(() => (this.mensajeError = ''), 3000);
  }
}
