import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfertantesService } from '../../servicios/ofertantes.service';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-oferta',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './detalle-oferta.component.html',
  styleUrl: './detalle-oferta.component.css',
})
export class DetalleOfertaComponent implements OnInit {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const topBar = document.querySelector('.top-bar-sevillanea') as HTMLElement;
    const logo = document.querySelector('.logo-izquierda') as HTMLElement;

    if (window.scrollY > 80) {
      topBar?.classList.add('hidden');
      navbar?.classList.add('fixed-top');
      logo?.classList.add('small-logo');
    } else {
      topBar?.classList.remove('hidden');
      navbar?.classList.remove('fixed-top');
      logo?.classList.remove('small-logo');
    }
  }

  public textoBoton: string = 'Añadir';
  public textoInicio: string = 'Añadir Ofertante';
  public form: FormGroup;

  public mensajeExito: string = '';

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  constructor(
    private serv: OfertantesService,
    private ruta: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        id: this.fb.control(-1),
        nombre: this.fb.control('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        apellidos: this.fb.control('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        telefono: this.fb.control('', [
          Validators.required,
          Validators.pattern(/^[0-9]{9}$/),
        ]),
        actividad: this.fb.control('', [Validators.required]),
        descripcion: this.fb.control('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        dias_disponibles: this.fb.control('', [Validators.required]),
        horario: this.fb.control('', [Validators.required]),
        tarifa: this.fb.control(0, [Validators.required, Validators.min(1)]),
        duracion_minutos: this.fb.control(60, [Validators.min(1)]),
        plazas_minimas: this.fb.control(1, [Validators.min(1)]),
        plazas_maximas: this.fb.control(10, [Validators.min(1)]),
        ubicacion: this.fb.control('Sevilla'),
      },
      { validators: this.validarPlazas }
    );
  }

  ngOnInit(): void {
    this.comprobarSesion();
    const idOfertante = Number(this.route.snapshot.params['id']);
    if (!isNaN(idOfertante) && idOfertante !== -1) {
      this.textoBoton = 'Modificar';
      this.textoInicio = 'INFORMACIÓN DE LA ACTIVIDAD OFERTADA';
      this.serv.selectOfertante(idOfertante).subscribe({
        next: (ofertante) => this.form.patchValue(ofertante),
        error: (err) => console.error('Error al cargar ofertante:', err),
      });
    }
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

  onSubmit(): void {
    if (this.form.value.id === -1) {
      this.serv.anadirOfertante(this.form.value).subscribe({
        next: (result) => {
          if (result.result === 'FAIL') {
            alert('Ha ocurrido un problema al añadir el ofertante');
          } else {
            this.mostrarMensaje(
              'Actividad añadida correctamente. Redirigiendo al listado…'
            );
            setTimeout(() => this.ruta.navigate(['ofertantes']), 3000);
          }
        },
        error: (err) => {
          console.error('Error al añadir ofertante:', err);
          alert('No se pudo añadir el ofertante.');
        },
      });
    } else {
      this.serv.modificaOfertante(this.form.value).subscribe({
        next: (result) => {
          if (result.result === 'FAIL') {
            alert('Ha ocurrido un problema al modificar el ofertante');
          } else {
            this.mostrarMensaje(
              'Actividad modificada correctamente. Redirigiendo al listado…'
            );
            setTimeout(() => this.ruta.navigate(['ofertantes']), 3000);
          }
        },
        error: (err) => {
          console.error('Error al modificar ofertante:', err);
          alert('No se pudo modificar el ofertante.');
        },
      });
    }
  }

  volver(): void {
    this.ruta.navigate(['ofertantes']);
  }

  validarPlazas(group: FormGroup) {
    const min = group.get('plazas_minimas')?.value;
    const max = group.get('plazas_maximas')?.value;
    return max >= min ? null : { plazasInvalidas: true };
  }

  mostrarMensaje(texto: string) {
    this.mensajeExito = texto;
    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
