import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
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
import { estados } from '../../../models/estados';
import { MenuComponent } from '../.././menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, Routes,ActivatedRoute } from '@angular/router'; 
import { Cliente } from '../../../models/cliente';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatExpansionModule,
    MenuComponent,
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
  ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.scss'
})
export class EditarComponent implements OnInit {
  editForm: FormGroup;
  estados = estados;
  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      cnpj: ['', Validators.required],
      codigo: [''],
      loja: [''],
      tipo: ['Pessoa Jurídica'],
      razao: ['', Validators.required],
      ddd: ['', [Validators.required, Validators.maxLength(2)]],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      homepage: [''],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      pais: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      est: ['', Validators.required],
      codigoMunicipio: [''],
      dtcad: [''],
      informacoesAdicionais: [''],
      obs: ['']
    });
  }

  ngOnInit() {
    this.editForm.get('cnpj')?.disable();
    this.editForm.get('codigo')?.disable();
    this.editForm.get('loja')?.disable();
    this.editForm.get('tipo')?.disable();
  
    this.editForm.get('tipo')?.patchValue('Pessoa Juridica');
  
    const codigo = this.route.snapshot.params['codigo'];
    if (codigo) {
      this.clienteService.getCliente(codigo).subscribe(data => {
        
        const dtcad = data.items[0].dtcad;
        if (dtcad) {
          const formattedDate = new Date(dtcad);
          this.editForm.get('dtcad')?.patchValue(formattedDate);
        }
        this.editForm.patchValue(data.items[0]);
        this.editForm.get('tipo')?.patchValue('Pessoa Juridica');

        this.clienteService.consultarMunicipio(data.items[0].estado,data.items[0].cidade).subscribe({
          next: (response: any) => {
            this.editForm.get('codigoMunicipio')?.patchValue(response.items[0].codigo);
          },
          error: (error: any) => {
            console.error('Erro ao consultar o ultimo codigo:', error);
          }
        });
      });
    }
  }
  

  onSubmit() {
    const codigoCl = this.editForm.get("codigo")?.value;
    const loja = this.editForm.get("loja")?.value;
  
    if (!codigoCl || !loja) {
      this.snackBar.open('Código e loja são obrigatórios!', 'Fechar', { duration: 3000 });
      return;
    }

    let formData: Cliente = {
      codigo:   this.editForm.get('codigo')?.value,
      loja:     this.editForm.get('loja')?.value,
      razao:    this.editForm.get('razao')?.value, 
      tipo:     this.editForm.get('tipo')?.value,
      cnpj:     this.editForm.get('cnpj')?.value,
      endereco: this.editForm.get('endereco')?.value,
      bairro:   this.editForm.get('bairro')?.value,
      cidade:   this.editForm.get('cidade')?.value,
      est:      this.editForm.get('est')?.value,
      cep:      this.editForm.get('cep')?.value,
      complem:  this.editForm.get('codigoMunicipio')?.value,
      pais:     this.editForm.get('pais')?.value,
      ddd:      this.editForm.get('ddd')?.value,
      tel:      this.editForm.get('tel')?.value,
      email:    this.editForm.get('email')?.value,
      hpage:    this.editForm.get('homepage')?.value,
      obs:      this.editForm.get('obs')?.value,
      dtcad:    this.editForm.get('dtcad')?.value
    };
  
    this.clienteService.updateCliente(formData).subscribe({
      next: () => {
        this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar cliente', 'Fechar', {
          duration: 3000
        });
        console.error('Erro ao atualizar cliente:', error); 
      }
    });
  }

  onCancel() {
    this.router.navigate(['/clientes/consulta']);
  }
}