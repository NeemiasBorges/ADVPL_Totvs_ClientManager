import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { ClienteService } from './cliente.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

interface CNPJResponse {
  nome: string;
  fantasia: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone?: string;
  email?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
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
    MatNativeDateModule
   ]
})

export class AppComponent implements OnInit {
  title = 'Cadastro de Cliente';
  clienteForm: FormGroup;
  isSidebarExpanded = false;

  constructor(
    private fb: FormBuilder,
    // private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      loja: ['', Validators.required],
      nome: ['', Validators.required],
      tipo: ['PF', Validators.required],
      endereco: ['', Validators.required],
      nomeFantasia: [''],
      bairro: ['', Validators.required],
      estado: ['', Validators.required],
      codigoMunicipio: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      ddd: ['', Validators.required],
      telefone: ['', Validators.required],
      pais: ['Brasil', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      homepage: [''],
      dataFundacao: ['', Validators.required],
      status: ['Ativo', Validators.required],
      informacoesAdicionais: ['']
    });
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.toggle('expanded');
    }
  }

  ngOnInit(): void {
    // this.clienteForm.get('cpfCnpj')?.valueChanges.subscribe(() => this.onCpfCnpjChange());
  }

  // onCpfCnpjChange(): void {
  //   const cpfCnpj = this.clienteForm.get('cpfCnpj')?.value;
  //   if (cpfCnpj && cpfCnpj.length === 14) { 
  //     this.clienteService.consultarCNPJ(cpfCnpj).subscribe({
  //       next: (response: CNPJResponse) => {
  //         this.clienteForm.patchValue({
  //           nome: response.nome,
  //           nomeFantasia: response.fantasia,
  //           endereco: `${response.logradouro}, ${response.numero}`,
  //           bairro: response.bairro,
  //           cidade: response.municipio,
  //           estado: response.uf,
  //           cep: response.cep,
  //           telefone: response.telefone?.split(' ')[1] || '',
  //           ddd: response.telefone?.split(' ')[0].replace(/\D/g, '') || '',
  //           email: response.email || ''
  //         });
  //       },
  //       error: (error: any) => {
  //         console.error('Erro ao consultar CNPJ:', error);
  //         // Aqui você pode adicionar uma notificação para o usuário
  //       }
  //     });
  //   }
  // }

  // onSubmit(): void {
  //   if (this.clienteForm.valid) {
  //     this.clienteService.cadastrarCliente(this.clienteForm.value).subscribe({
  //       next: (response: any) => {
  //         console.log('Cliente cadastrado com sucesso:', response);
  //         // Aqui você pode adicionar uma notificação de sucesso
  //       },
  //       error: (error: any) => {
  //         console.error('Erro ao cadastrar cliente:', error);
  //         // Aqui você pode adicionar uma notificação de erro
  //       }
  //     });
  //   } else {
  //     // Marcar todos os campos como touched para mostrar os erros
  //     Object.keys(this.clienteForm.controls).forEach(key => {
  //       const control = this.clienteForm.get(key);
  //       control?.markAsTouched();
  //     });
  //   }
  // }


    onSubmit(): void {
    if (this.clienteForm.valid) {
    } else {
      Object.keys(this.clienteForm.controls).forEach(key => {
        const control = this.clienteForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}