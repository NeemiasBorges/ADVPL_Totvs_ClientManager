import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { ClienteService } from '../services/cliente.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { estados } from '../models/estados';
import { MenuComponent } from './menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, Routes } from '@angular/router'; // Importe o RouterModule e Routes
import { ConsultaComponent } from './components/consulta/consulta.component'; 
import { CadastroComponent } from './components/cadastro/cadastro.component'; 

const routes: Routes = [
  {
    path: 'clientes',
    children: [
      { path: 'consulta', component: ConsultaComponent },
      { path: 'cadastro', component: CadastroComponent }
    ]
  },
  { path: '', redirectTo: 'clientes/cadastro', pathMatch: 'full' }
];


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    ClienteService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  imports: [
    RouterModule,
    MatExpansionModule,
    MenuComponent,
    MatCard,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule, 
    MatListModule, 
    MatToolbarModule, 
    MatMenuModule, 
    MatBadgeModule, 
    MatDividerModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
  ]
})

export class AppComponent implements OnInit {
  title             = 'Cadastro de Cliente';
  estados           = estados;
  isSidebarExpanded = false;

  ngOnInit(): void {
  }
}