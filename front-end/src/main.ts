import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: 'clientes',
    children: [
      { path: 'cadastro', loadComponent: () => import('./app/components/cadastro/cadastro.component').then(m => m.CadastroComponent) },
      { path: 'consulta', loadComponent: () => import('./app/components/consulta/consulta.component').then(m => m.ConsultaComponent) },
      { path: 'editar/:codigo', loadComponent: () => import('./app/components/editar/editar.component').then(m => m.EditarComponent) },
      { path: 'delete/:codigo', loadComponent: () => import('./app/components/delete/delete.component').then(m => m.DeleteComponent) }
    ]
  },
  { path: '', redirectTo: 'clientes/cadastro', pathMatch: 'full' }
];


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter(routes) 
  ]
}).catch(err => console.error(err));