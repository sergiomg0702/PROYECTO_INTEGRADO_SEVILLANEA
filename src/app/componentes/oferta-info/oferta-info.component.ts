import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HostListener } from '@angular/core';
import { Ofertante } from '../../modelos/ofertante';
import { OfertantesService } from '../../servicios/ofertantes.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-oferta-info',
  imports: [RouterLink],
  templateUrl: './oferta-info.component.html',
  styleUrl: './oferta-info.component.css',
})
export class OfertaInfoComponent {
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

  ofertante: Ofertante | null = null;
  mensajeReserva: string = '';
  mostrarDescargar: boolean = false;

  usuario: any = null;

  mensajeError: string = '';
  errorVisible: boolean = false;

  // Estado de sesión
  isLoggedIn = false;
  usuarioLogueado = false;

  constructor(
    private servicio: OfertantesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerOfertantePorId();
    this.comprobarSesion();
  }

  volver() {
    this.router.navigate(['ofertantes']);
  }

  obtenerOfertantePorId() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicio.selectOfertante(id).subscribe({
      next: (res) => (this.ofertante = res),
      error: () => this.mostrarError('No se encontró la actividad.'),
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

  // -------------------------------
  // RESERVAR ACTIVIDAD
  // -------------------------------
  reservar() {
    if (!this.usuario) {
      this.mostrarError('Debes iniciar sesión para reservar.');
      return;
    }

    this.mensajeReserva = 'Muchas gracias por reservar!!';
    this.mostrarDescargar = true;

    setTimeout(() => (this.mensajeReserva = ''), 3000);
  }

  // -------------------------------
  // DESCARGAR ENTRADA (PDF)
  // -------------------------------

  //  Permite que un usuario se apunte a una oferta. Si no está logueado, muestra un error.
  //Recoge los datos del usuario y de la actividad, y genera un PDF con esa información,
  //incluyendo un logo y los detalles principales de la reserva

  apuntarse(oferta: Ofertante) {
    if (!this.usuario) {
      this.mostrarError('Debes iniciar sesión para apuntarte.');
      return;
    }

    const datosPDF = {
      usuario: {
        username: this.usuario.username,
        email: this.usuario.email,
      },
      actividad: {
        nombre: oferta.actividad,
        nombreOfertante: oferta.nombre,
        apellidosOfertante: oferta.apellidos,
        telefono: oferta.telefono,
        descripcion: oferta.descripcion,
        tarifa: oferta.tarifa,
        duracion: oferta.duracion_minutos,
        ubicacion: oferta.ubicacion,
      },
    };

    this.generarPDF(datosPDF);
  }

  async generarPDF(datos: any) {
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
    });

    // --- COLORES CORPORATIVOS ---
    const naranjaAlbero = { r: 227, g: 150, b: 62 };
    const textoOscuro = { r: 40, g: 40, b: 40 };

    // --- FONDO ---
    doc.setFillColor(naranjaAlbero.r, naranjaAlbero.g, naranjaAlbero.b);
    doc.rect(0, 0, 210, 297, 'F');

    // --- LOGO ---
    const logo = await this.cargarImagenBase64(
      'assets/imagenes/sevillanea.png'
    );
    if (logo) doc.addImage(logo, 'PNG', 75, 20, 60, 35);

    // --- TÍTULO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(datos.actividad.nombre.toUpperCase(), 105, 70, {
      align: 'center',
    });

    doc.setFontSize(16);
    doc.text('Reserva confirmada', 105, 82, { align: 'center' });

    // --- TARJETA ---
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 95, 180, 150, 4, 4, 'F');
    doc.setTextColor(textoOscuro.r, textoOscuro.g, textoOscuro.b);

    let y = 110;
    const salto = 10;

    // --- USUARIO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Datos del Usuario', 25, y);
    y += salto;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(`Nombre usuario: ${datos.usuario.username}`, 25, y);
    y += salto;
    doc.text(`Email: ${datos.usuario.email}`, 25, y);
    y += 18;

    // --- ACTIVIDAD ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Detalles de la Actividad', 25, y);
    y += salto;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);

    doc.text(
      `Organiza: ${datos.actividad.nombreOfertante} ${datos.actividad.apellidosOfertante}`,
      25,
      y
    );
    y += salto;

    doc.text(`Teléfono: ${datos.actividad.telefono}`, 25, y);
    y += salto;

    // --- DESCRIPCIÓN EN UNA SOLA LÍNEA ---
    doc.text('Descripción:', 25, y);
    y += salto - 5;

    doc.text(datos.actividad.descripcion, 25, y, {
      maxWidth: 1000, // evita wrapping
      lineHeightFactor: 1,
    });
    y += salto;

    doc.text(`Tarifa: ${datos.actividad.tarifa} €`, 25, y);
    y += salto;
    doc.text(`Duración: ${datos.actividad.duracion} min`, 25, y);
    y += salto;
    doc.text(`Ubicación: ${datos.actividad.ubicacion}`, 25, y);
    y += 20;

    // --- CONTACTO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(naranjaAlbero.r, naranjaAlbero.g, naranjaAlbero.b);
    doc.text('¿Dudas o consultas?', 25, y);
    y += salto;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(textoOscuro.r, textoOscuro.g, textoOscuro.b);
    doc.text(
      `No dude en contactar con ${datos.actividad.nombreOfertante} ${datos.actividad.apellidosOfertante} al teléfono ${datos.actividad.telefono}.`,
      25,
      y
    );

    // --- MENSAJE FINAL ---
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(
      'Muchas gracias por confiar en Sevillanea. Esperamos que disfrute de la experiencia.',
      25,
      270
    );

    doc.save(`Entrada_${datos.actividad.nombre}.pdf`);
  }

  cargarImagenBase64(url: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
    });
  }

  // -------------------------------
  // EDITAR ACTIVIDAD
  // -------------------------------
  /** Esto es para modificar la actividad */

  editar() {
    if (!this.ofertante || !this.ofertante.id) {
      console.error('No hay ofertante cargado o id inválido');
      return;
    }

    // Navegar al DetalleOfertaComponent con el id del ofertante
    this.router.navigate(['/oferta', this.ofertante.id]);
  }

  // -------------------------------
  // MOSTRAR ERROR
  // -------------------------------

  mostrarError(msg: string) {
    this.mensajeError = msg;
    this.errorVisible = true;
    setTimeout(() => (this.errorVisible = false), 3000);
  }
}
