import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HostListener } from '@angular/core';

import { Consumidor } from '../../modelos/consumidor';
import { ConsumidoresService } from '../../servicios/consumidores.service';
import { OfertantesService } from '../../servicios/ofertantes.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consumidores-info',
  imports: [RouterLink],
  templateUrl: './consumidores-info.component.html',
  styleUrl: './consumidores-info.component.css',
})
export class ConsumidoresInfoComponent {
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

  consumidor: Consumidor | null = null;
  usuario: any = null;
  mensajeError: string = '';
  errorVisible: boolean = false;
  actividadNombre: string = '';

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;

  constructor(
    private servicio: ConsumidoresService,
    private ofertantesService: OfertantesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.comprobarSesion();
    this.obtenerConsumidorPorId();
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

  volver() {
    this.router.navigate(['consumidores']);
  }

  obtenerConsumidorPorId() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicio.obtenerConsumidorId(id).subscribe({
      next: (res) => {
        this.consumidor = res;

        // Ahora obtenemos el nombre de la actividad según actividad_id
        if (this.consumidor?.actividad_id) {
          this.ofertantesService
            .selectOfertante(this.consumidor.actividad_id)
            .subscribe({
              next: (ofertante) => (this.actividadNombre = ofertante.actividad),
              error: () => (this.actividadNombre = 'Actividad no encontrada'),
            });
        }
      },
      error: () => this.mostrarError('No se encontró el consumidor.'),
    });
  }

  // -------------------------------
  // MOSTRAR ERROR
  // -------------------------------
  mostrarError(msg: string) {
    this.mensajeError = msg;
    this.errorVisible = true;
    setTimeout(() => (this.errorVisible = false), 3000);
  }

  // -------------------------------
  // EDITAR ACTIVIDAD
  // -------------------------------
  /** Modificar actividad */
  editar() {
    if (!this.consumidor || !this.consumidor.id) {
      console.error('No hay consumidor cargado o id inválido');
      return;
    }

    // Navegar al DetalleConsumidorComponent con el id del consumidor
    this.router.navigate(['/consumidor', this.consumidor.id]);
  }
}
