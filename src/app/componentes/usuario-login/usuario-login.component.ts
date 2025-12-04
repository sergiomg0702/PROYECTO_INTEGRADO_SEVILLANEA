import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './usuario-login.component.html',
  styleUrl: './usuario-login.component.css',
})
export class UsuarioLoginComponent {
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

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  email: string = '';
  password: string = '';
  errorMessage: string = '';

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

  login() {
    this.usuariosService.loginUsuario(this.email, this.password).subscribe({
      next: (respuesta) => {
        if (!respuesta) {
          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
          return;
        }

        // Si el backend devuelve {result: "FAIL"}, lo tratamos como error
        if ('result' in respuesta && respuesta.result === 'FAIL') {
          this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
          return;
        }

        const usuario = respuesta as Usuario;

        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Error en login', err);
        this.errorMessage = 'Error en el servidor. Inténtalo más tarde.';
      },
    });
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
