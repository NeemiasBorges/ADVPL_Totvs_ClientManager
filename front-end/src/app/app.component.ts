import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
  providers: [
    ClienteService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
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
    MatNativeDateModule,
    MatStepperModule,
    HttpClientModule
  ]
})
export class AppComponent implements OnInit {
  title = 'Cadastro de Cliente';
  clienteForm!: FormGroup;
  isSidebarExpanded = false;
  
  identificacaoForm!: FormGroup;
  contatoForm!: FormGroup;
  enderecoForm!: FormGroup;
  informacoesForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    // Formulário de Identificação
    this.identificacaoForm = this.fb.group({
      loja: ['', Validators.required],
      tipo: ['PF', Validators.required],
      cpfCnpj: ['', Validators.required],
      nome: ['', Validators.required],
      nomeFantasia: ['']
    });

    // Formulário de Contato
    this.contatoForm = this.fb.group({
      ddd: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      homepage: ['']
    });

    // Formulário de Endereço
    this.enderecoForm = this.fb.group({
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      codigoMunicipio: ['', Validators.required],
      pais: ['Brasil', Validators.required]
    });

    // Formulário de Informações Adicionais
    this.informacoesForm = this.fb.group({
      dataFundacao: ['', Validators.required],
      status: ['Ativo', Validators.required],
      informacoesAdicionais: ['']
    });

    // Combinar todos os formulários
    this.clienteForm = this.fb.group({
      identificacao: this.identificacaoForm,
      contato: this.contatoForm,
      endereco: this.enderecoForm,
      informacoes: this.informacoesForm
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
    this.identificacaoForm.get('cpfCnpj')?.valueChanges.subscribe(() => this.onCpfCnpjChange());
  }

  onCpfCnpjChange(): void {
    const cpfCnpj = this.identificacaoForm.get('cpfCnpj')?.value;

    if (cpfCnpj && cpfCnpj.length >= 14) {
      this.identificacaoForm.patchValue({tipo: 'PJ'});
      
      this.clienteService.consultarCNPJ(cpfCnpj).subscribe({
        next: (response: CNPJResponse) => {
          this.identificacaoForm.patchValue({
            nome: response.nome,
            nomeFantasia: response.fantasia,
          });

          this.enderecoForm.patchValue({
            endereco: `${response.logradouro}, ${response.numero}`,
            bairro: response.bairro,
            cidade: response.municipio,
            estado: response.uf,
            cep: response.cep,
          });

          this.contatoForm.patchValue({
            telefone: response.telefone?.split(' ')[1] || '',
            ddd: response.telefone?.split(' ')[0].replace(/\D/g, '') || '',
            email: response.email || ''
          });

          this.snackBar.open('CNPJ Consultado com sucesso', 'Fechar');
        },
        error: (error: any) => {
          console.error('Erro ao consultar CNPJ:', error);
        }
      });
    } else {
      this.identificacaoForm.patchValue({tipo: 'PF'});
    }
  }

  isStepValid(formGroup: FormGroup): boolean {
    return formGroup.valid;
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const formData = {
        ...this.identificacaoForm.value,
        ...this.contatoForm.value,
        ...this.enderecoForm.value,
        ...this.informacoesForm.value
      };
      console.log('Dados do formulário:', formData);
    } else {
      [this.identificacaoForm, this.contatoForm, this.enderecoForm, this.informacoesForm].forEach(form => {
        Object.keys(form.controls).forEach(key => {
          const control = form.get(key);
          control?.markAsTouched();
        });
      });
    }
  }
}