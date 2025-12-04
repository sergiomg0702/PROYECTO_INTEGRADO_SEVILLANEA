import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quienes-somos',
  imports: [RouterLink],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css',
})
export class QuienesSomosComponent {
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

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
