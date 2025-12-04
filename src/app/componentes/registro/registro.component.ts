import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  form: FormGroup;
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private ruta: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Estado de sesión(esto es para lo del menú de arriba)
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

  registrar() {
    if (!this.form.valid) {
      this.mensaje = 'Completa todos los campos correctamente.';
      return;
    }

    const usuario = {
      id: 0,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      saldo: 100,
      actividades_inscritas: null,
      propuestas_actividades: null,
    };

    this.usuariosService.registrarUsuario(usuario).subscribe({
      next: () => {
        this.mensaje = 'Registro completado con éxito';
        this.form.reset();
        this.ruta.navigate(['/login']);
      },
      error: () => {
        this.mensaje = 'Error al registrar usuario';
      },
    });
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
