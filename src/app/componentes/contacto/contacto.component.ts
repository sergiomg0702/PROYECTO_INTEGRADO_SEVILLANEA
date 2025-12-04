import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContactoService } from '../../servicios/contacto.service';
@Component({
  selector: 'app-contacto',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  contactoForm!: FormGroup;
  isLoggedIn = false;
  usuarioLogueado = false;
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private contactoService: ContactoService
  ) {}

  /** Efecto Navbar */
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

  ngOnInit(): void {
    this.comprobarSesion();
    this.inicializarFormulario();
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Inicializar Reactive Form */
  inicializarFormulario() {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      privacidad: [false, Validators.requiredTrue],
    });
  }

  /** Enviar formulario */
  enviarFormulario() {
    const msgExito = document.getElementById('msgExito');
    const msgError = document.getElementById('msgError');

    msgExito?.classList.remove('visible');
    msgError?.classList.remove('visible');

    if (this.contactoForm.invalid) {
      msgError?.classList.add('visible');
      return;
    }

    this.contactoService.enviarMensaje(this.contactoForm.value).subscribe({
      next: () => {
        msgExito?.classList.add('visible');
        this.contactoForm.reset();
      },
      error: () => {
        msgError?.classList.add('visible');
      },
    });
  }

  /** Comprobar sesión */
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
}
