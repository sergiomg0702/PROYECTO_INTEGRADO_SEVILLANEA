import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-perfil-editar',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './perfil-editar.component.html',
  styleUrl: './perfil-editar.component.css',
})
export class PerfilEditarComponent implements OnInit {
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

  form: FormGroup;
  usuarioId: number = 0;
  mensaje: string = '';

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  usuarioNombre: string = '';
  usuarioEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {
    // Crear formulario
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        passwordActual: [''],
        passwordNueva: [''],
      },
      {
        validators: this.validarContraseña.bind(this),
      }
    );
  }

  ngOnInit(): void {
    this.comprobarSesion();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.usuarioId = Number(idParam);

      this.usuariosService.obtenerUsuarioId(this.usuarioId).subscribe({
        next: (usuario: any) => {
          this.form.patchValue({
            username: usuario.username,
            email: usuario.email,
          });
        },
        error: () => (this.mensaje = 'Error al cargar datos del usuario'),
      });
    }
  }

  validarContraseña(group: AbstractControl): ValidationErrors | null {
    const actual = group.get('passwordActual')?.value;
    const nueva = group.get('passwordNueva')?.value;

    // Si intenta poner nueva pero no pone la actual,sale error
    if (nueva && nueva.length > 0 && (!actual || actual.length === 0)) {
      return { passwordInvalida: true };
    }

    return null;
  }

  modificarUsuario() {
    if (this.form.invalid) {
      this.mensaje = 'Por favor corrige los errores del formulario.';
      return;
    }

    const { username, email, passwordActual, passwordNueva } = this.form.value;

    const usuarioActualizar: any = {
      id: this.usuarioId,
      username: username.trim(),
      email: email.trim(),
    };

    // Si quiere cambiar contraseña
    if (passwordNueva && passwordNueva.length > 0) {
      if (!passwordActual || passwordActual.length === 0) {
        this.mensaje = 'Debes introducir la contraseña actual para cambiarla';
        return;
      }

      // Verificar contraseña actual
      this.usuariosService.loginUsuario(email, passwordActual).subscribe({
        next: (res: any) => {
          if (res.result === 'FAIL') {
            this.mensaje = 'Contraseña actual incorrecta';
            return;
          }

          usuarioActualizar.password = passwordNueva;
          this.enviarActualizacion(usuarioActualizar);
        },
        error: () => (this.mensaje = 'Error al verificar contraseña actual'),
      });
    } else {
      // No cambia contraseña
      this.enviarActualizacion(usuarioActualizar);
    }
  }

  enviarActualizacion(usuarioActualizar: any) {
    this.usuariosService.modificarUsuario(usuarioActualizar).subscribe({
      next: (res: any) => {
        if (res.result === 'OK') {
          this.mensaje = 'Usuario actualizado correctamente';
          setTimeout(
            () => this.router.navigate(['/perfil', this.usuarioId]),
            1500
          );
        } else {
          this.mensaje = 'No se ha podido actualizar el usuario.';
        }
      },
      error: () => (this.mensaje = 'Error al actualizar usuario'),
    });
  }

  cancelar() {
    this.router.navigate(['/perfil', this.usuarioId]);
  }

  get f() {
    return this.form.controls;
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

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
