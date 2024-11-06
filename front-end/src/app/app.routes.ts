// app.routes.ts
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: 'clientes',
    children: [
      {
        path: 'cadastro',
        loadComponent: () => import('./app.component')
          .then(c => c.AppComponent)
      },
      {
        path: 'consulta',
        loadComponent: () => import('./components/consulta/consulta.component')
          .then(c => c.ConsultaComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'clientes/cadastro',
    pathMatch: 'full'
  }
];