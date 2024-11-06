import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { ClienteService } from '../../../services/cliente.service';
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
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { estados } from '../../../models/estados';
import { MenuComponent } from '../.././menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, Routes } from '@angular/router'; 
import { ConsultaComponent } from '../.././components/consulta/consulta.component'; 
import { Cliente } from '../../../models/cliente';

const routes: Routes = [
  {
    path: 'clientes',
    children: [
      { path: 'consulta', component: ConsultaComponent }
    ]
  },
  { path: '', redirectTo: 'clientes/cadastro', pathMatch: 'full' }
];

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
  selector: 'cadastro',
  standalone: true,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
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

export class CadastroComponent implements OnInit {
  title             = 'Cadastro de Cliente';
  estados           = estados;
  isSidebarExpanded = false;

  clienteForm       !: FormGroup;
  identificacaoForm !: FormGroup;
  contatoForm       !: FormGroup;
  enderecoForm      !: FormGroup;
  informacoesForm   !: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    // Formulário de Identificação
    this.identificacaoForm = this.fb.group({
      loja: ['', Validators.required],
      codigo: [''],
      tipo: ['PF', Validators.required],
      cpfCnpj: ['', Validators.required],
      nome: [''],
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
      bairro: [''],
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

    this.clienteService.consultarUltimoCodigo().subscribe({
      next: (response: any) => {
        this.identificacaoForm.patchValue({codigo: this.clienteService.gerarProximoCodigo(response.items[0].codigo)});
      },
      error: (error: any) => {
        console.error('Erro ao consultar o ultimo codigo:', error);
      }
    });

    this.identificacaoForm.get('codigo')?.disable();


    this.identificacaoForm.get('cpfCnpj')?.valueChanges.pipe(
      debounceTime(500), 
      distinctUntilChanged(), 
      filter(cpfCnpj => cpfCnpj && cpfCnpj.length >= 14) 
    ).subscribe(() => this.onCpfCnpjChange());
  
    this.identificacaoForm.get('tipo')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((tipo: string) => {
      const cpfCnpj = this.identificacaoForm.get('cpfCnpj')?.value;
      if (tipo === 'PF') {
        this.identificacaoForm.get('cpfCnpj')?.setValidators([Validators.required, Validators.minLength(11)]);
        this.identificacaoForm.get('cpfCnpj')?.updateValueAndValidity();
        if (cpfCnpj && cpfCnpj.length === 14) {
          this.identificacaoForm.patchValue({cpfCnpj: cpfCnpj.substr(0, 11)});
        }
      } else {
        this.identificacaoForm.get('cpfCnpj')?.setValidators([Validators.required, Validators.minLength(14)]);
        this.identificacaoForm.get('cpfCnpj')?.updateValueAndValidity();
        if (cpfCnpj && cpfCnpj.length === 11) {
          this.identificacaoForm.patchValue({cpfCnpj: cpfCnpj + '0001'});
        }
      }
    });
  
    this.enderecoForm.get('cep')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(cep => cep && cep.length === 8)
    ).subscribe((cep: string) => {
      this.clienteService.consultarCEP(cep.replace(/\D/g, '')).subscribe({
        next: (response: any) => {
          this.enderecoForm.patchValue({
            endereco: response.logradouro,
            bairro: response.bairro,
            cidade: response.localidade.toUpperCase(),
            estado: response.uf
          });
        },
        error: (error: any) => {
          console.error('Erro ao consultar CEP:', error);
        }
      });
    });
  
    this.enderecoForm.get('estado')?.valueChanges.subscribe(() => this.updateCodigoMunicipio());
    this.enderecoForm.get('cidade')?.valueChanges.subscribe(() => this.updateCodigoMunicipio());

  }

  updateCodigoMunicipio(): void {
    const estado = this.enderecoForm.get('estado')?.value;
    const cidade = this.enderecoForm.get('cidade')?.value;

    if (estado && cidade) {
      this.clienteService.consultarMunicipio(estado, cidade).subscribe({
        next: (response: any) => {
          this.enderecoForm.patchValue({codigoMunicipio: response.items[0].codigo});
        },
        error: (error: any) => {
          console.error('Erro ao consultar município:', error);
        }
      });
    }
  }

  onCpfCnpjChange(): void {
    const cpfCnpj = this.identificacaoForm.get('cpfCnpj')?.value;

    if (cpfCnpj && cpfCnpj.length >= 14) {
      this.identificacaoForm.patchValue({tipo: 'PJ'});
      this.clienteService.consultarCNPJ(cpfCnpj.replace(/\D/g, '')).subscribe({
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
    console.log('Inserindo Usuario')
    if (this.clienteForm.valid) {
      const formData: Cliente = {
        codigo:   this.identificacaoForm.get('codigo')?.value,
        loja:     this.identificacaoForm.get('loja')?.value,
        razao:    this.identificacaoForm.get('nome')?.value, // Nome/Razão Social
        tipo:     this.identificacaoForm.get('tipo')?.value,
        cnpj:     this.identificacaoForm.get('cpfCnpj')?.value,
        endereco: this.enderecoForm.get('endereco')?.value,
        bairro:   this.enderecoForm.get('bairro')?.value,
        cidade:   this.enderecoForm.get('cidade')?.value,
        est:      this.enderecoForm.get('estado')?.value,
        cep:      this.enderecoForm.get('cep')?.value,
        complem:  this.enderecoForm.get('codigoMunicipio')?.value,
        pais:     this.enderecoForm.get('pais')?.value,
        ddd:      this.contatoForm.get('ddd')?.value,
        tel:      this.contatoForm.get('telefone')?.value,
        email:    this.contatoForm.get('email')?.value,
        hpage:    this.contatoForm.get('homepage')?.value,
        dtcad:    this.informacoesForm.get('dataFundacao')?.value,
        obs:      this.informacoesForm.get('informacoesAdicionais')?.value
      };
  
        this.clienteService.addCliente(formData).subscribe({
          next: (response: any) => {
            this.snackBar.open('Cliente adicionado com sucesso', 'Fechar');
            this.router.navigate(['/clientes/consulta']);
          },
          error: (error: any) => {
            console.error('Erro ao consultar o ultimo codigo:', error);
          }
        });
    } else {
      // Marca todos os campos como touched para mostrar erros de validação
      [this.identificacaoForm, this.contatoForm, this.enderecoForm, this.informacoesForm].forEach(form => {
        Object.keys(form.controls).forEach(key => {
          const control = form.get(key);
          control?.markAsTouched();
        });
      });
    }
  }
}