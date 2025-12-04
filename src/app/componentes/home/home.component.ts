import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usuarioNombre: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  usuario: any = null;

  ngOnInit(): void {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      try {
        const userObj = JSON.parse(usuarioData);
        this.usuarioNombre = userObj?.username ?? '';
        this.isLoggedIn = true; // importante para mostrar el mensaje
      } catch (e) {
        console.error('Error al parsear usuario:', e);
        this.usuarioNombre = '';
        this.isLoggedIn = false;
      }
    }
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
}
