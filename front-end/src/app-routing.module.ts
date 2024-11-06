import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'clientes',
    children: [
      {
        path: 'cadastro',
        component: AppComponent
      }
    //   {
    //     path: 'consulta',
    //     loadChildren: () => import('./query/query.module').then(m => m.QueryModule)
    //   }
    ]
  },
  {
    path: '',
    redirectTo: 'clientes/cadastro',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }