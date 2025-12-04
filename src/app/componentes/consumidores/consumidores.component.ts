import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

import { Consumidor } from '../../modelos/consumidor';
import { ConsumidoresService } from '../../servicios/consumidores.service';

@Component({
  selector: 'app-consumidores',
  imports: [RouterLink, NgFor],
  templateUrl: './consumidores.component.html',
  styleUrl: './consumidores.component.css',
})
export class ConsumidoresComponent {
  /** Lista de consumidores cargados desde el servicio */
  public consumidores: Consumidor[] = [];

  constructor(private servicio: ConsumidoresService) {
    // Cargar consumidores al iniciar el componente
    this.servicio.selectConsumidores().subscribe({
      next: (res) => (this.consumidores = res),
      error: (err) => console.error('Error cargando consumidores:', err),
    });
  }

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  ngOnInit(): void {
    this.comprobarSesion();
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

  /** Elimina un consumidor con confirmación */
  borrarConsumidor(consumidor: Consumidor) {
    if (
      confirm(
        `¿Estás seguro de eliminar al consumidor: ${consumidor.nombre} ${consumidor.apellidos}?`
      )
    ) {
      this.servicio.borrarConsumidor(consumidor).subscribe({
        next: (results) => {
          // results puede ser un array actualizado o un objeto con result
          console.log('Resultado al borrar consumidor:', results);
          // Si tu backend devuelve lista actualizada:
          if (Array.isArray(results)) {
            this.consumidores = results;
          } else {
            // Si devuelve {result:"OK"}, recargamos lista
            this.servicio.selectConsumidores().subscribe({
              next: (res) => (this.consumidores = res),
              error: (err) =>
                console.error('Error recargando consumidores:', err),
            });
          }
        },
        error: (err) => console.error('Error al borrar consumidor:', err),
      });
    }
  }

  //ESTO ES PARA QUE CUANDO LE DEMOS A LOS ENLACES DEL FOOTER NOS VUELVA A LLEVAR A LA PARTE DE ARRIBA DE LA PÁGINA
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Efecto visual del navbar al hacer scroll */
  @HostListener('window:scroll', [])
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
}
