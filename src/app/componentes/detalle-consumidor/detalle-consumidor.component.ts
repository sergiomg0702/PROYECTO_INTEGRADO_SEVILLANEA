import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Consumidor } from '../../modelos/consumidor';
import { Ofertante } from '../../modelos/ofertante';
import { ConsumidoresService } from '../../servicios/consumidores.service';
import { OfertantesService } from '../../servicios/ofertantes.service';

@Component({
  selector: 'app-detalle-consumidor',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './detalle-consumidor.component.html',
  styleUrl: './detalle-consumidor.component.css',
})
export class DetalleConsumidorComponent implements OnInit {
  public textoBoton = 'Añadir';
  public listaOfertantes: Ofertante[] = [];
  public form: FormGroup;
  public mensajeExito: string = '';

  // Estado de sesión(esto es para lo del menú de arriba)
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private servicio: ConsumidoresService,
    private servicioOf: OfertantesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: this.fb.control(-1),
      nombre: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      apellidos: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      telefono: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/),
      ]),
      direccion: this.fb.control('', Validators.required),
      descripcion_necesidades: this.fb.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      presupuesto_maximo: this.fb.control(null, [
        Validators.required,
        Validators.min(1),
      ]),
      actividad_id: this.fb.control(null, Validators.required),
    });
  }

  ngOnInit() {
    this.comprobarSesion();
    const id = Number(this.route.snapshot.params['id']);

    this.servicioOf.selectOfertantes().subscribe({
      next: (datos) => {
        this.listaOfertantes = datos;

        if (id !== -1) {
          this.textoBoton = 'Modificar';

          this.servicio.obtenerConsumidorId(id).subscribe({
            next: (cons) => {
              this.form.patchValue({
                ...cons,
                telefono: cons.telefono ?? '',
                direccion: cons.direccion ?? '',
                descripcion_necesidades: cons.descripcion_necesidades ?? '',
                presupuesto_maximo: cons.presupuesto_maximo ?? null,
                actividad_id: cons.actividad_id,
              });
            },
            error: (e) => console.error(e),
          });
        }
      },
      error: (err) => console.error(err),
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

  onSubmit() {
    if (this.form.invalid) return;

    const consumidor: Consumidor = this.form.value;

    if (consumidor.id === -1) {
      this.servicio.anadirConsumidor(consumidor).subscribe({
        next: () => this.mostrarMensaje('Consumidor añadido con éxito'),
        error: (e) => console.error(e),
      });
    } else {
      this.servicio.editarConsumidor(consumidor).subscribe({
        next: () => this.mostrarMensaje('Consumidor modificado con éxito'),
        error: (e) => console.error(e),
      });
    }
  }

  mostrarMensaje(texto: string) {
    this.mensajeExito = texto;
    setTimeout(() => {
      this.mensajeExito = '';
      this.router.navigate(['/consumidores']);
    }, 3000);
  }

  volver() {
    this.router.navigate(['/consumidores']);
  }

  //Vuelve hacia arriba
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
