import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { InformacionComponent } from './pages/informacion/informacion';
import { CamionesComponent } from './pages/camiones/camiones';
import { ReportesComponent } from './pages/reportes/reportes';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'informacion', component: InformacionComponent },
  { path: 'camiones', component: CamionesComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'contacto', component: ContactoComponent }
];