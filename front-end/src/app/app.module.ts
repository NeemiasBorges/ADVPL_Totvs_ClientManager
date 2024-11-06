import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'; // Certifique-se de importar RouterModule

import { AppComponent } from './app.component';
import { ConsultaComponent } from './components/consulta/consulta.component'; // Exemplo de componente de consulta

// Defina suas rotas aqui
const routes: Routes = [
  {
    path: 'clientes',
    children: [
      { path: 'consulta', component: ConsultaComponent }
    ]
  },
  { path: '', redirectTo: 'clientes/cadastro', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ConsultaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Importe e configure o RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
