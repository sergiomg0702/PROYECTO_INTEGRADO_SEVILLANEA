import { Routes } from '@angular/router';

import { HomeComponent } from './componentes/home/home.component';

import { ConsumidoresComponent } from './componentes/consumidores/consumidores.component';
import { OfertantesComponent } from './componentes/ofertantes/ofertantes.component';
import { DetalleOfertaComponent } from './componentes/detalle-oferta/detalle-oferta.component';
import { DetalleConsumidorComponent } from './componentes/detalle-consumidor/detalle-consumidor.component';

import { UsuarioLoginComponent } from './componentes/usuario-login/usuario-login.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';

import { RegistroComponent } from './componentes/registro/registro.component';

import { QuienesSomosComponent } from './componentes/quienes-somos/quienes-somos.component';
import { PrivacidadComponent } from './componentes/privacidad/privacidad.component';
import { CookiesComponent } from './componentes/cookies/cookies.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';

import { OfertaInfoComponent } from './componentes/oferta-info/oferta-info.component';
import { ConsumidoresInfoComponent } from './componentes/consumidores-info/consumidores-info.component';
import { PerfilEditarComponent } from './componentes/perfil-editar/perfil-editar.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'quienesSomos', component: QuienesSomosComponent},
  {path: 'privacidad', component: PrivacidadComponent},
  {path: 'cookies', component: CookiesComponent},
  {path: 'contacto', component: ContactoComponent},
  { path: 'login', component: UsuarioLoginComponent },
  { path: 'perfil/:id', component: PerfilComponent },
  { path: 'perfilEditar/:id', component: PerfilEditarComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'ofertantes', component: OfertantesComponent },
  { path: 'oferta/:id', component: DetalleOfertaComponent },
  { path: 'ofertaInfo/:id', component: OfertaInfoComponent },
  { path: 'oferta/-1', component: DetalleOfertaComponent },
  { path: 'consumidores', component: ConsumidoresComponent },
  { path: 'consumidor/:id', component: DetalleConsumidorComponent },
  { path: 'consumidoresInfo/:id', component: ConsumidoresInfoComponent },
  { path: 'consumidor/-1', component: DetalleConsumidorComponent },
];
