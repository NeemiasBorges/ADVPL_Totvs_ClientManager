import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Routes, Router,RouterModule  } from '@angular/router';
import { CadastroComponent } from '../.././components/cadastro/cadastro.component';
import { ClienteService } from '../../../services/cliente.service';
import { estados } from '../../../models/estados';
import { HttpClientModule } from '@angular/common/http';
import { Cliente } from '../../../models/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Console } from 'console';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  providers: [
    ClienteService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  estados = estados;
  searchForm: FormGroup;
  dataSource!: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['codigo', 'nome', 'cpfCnpj', 'tipo', 'telefone', 'email', 'cidade', 'estado', 'acoes'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      razao: [''],
      cnpj: [''],
      tipo: [''],
      est: ['']
    });
  }

  ngOnInit() {
    this.clienteService.pegarTodosClientes().pipe(
      map((response: any) => {
        if (response && response.items) {
          return response.items.map((item: any) => ({
            codigo: item.codigo,
            loja: item.loja,
            nome: item.razao,
            tipo: item.tipo,
            cpfCnpj: item.cnpj,
            endereco: item.endereco,
            bairro: item.bairro,
            cidade: item.cidade,
            estado: item.estado,
            cep: item.cep,
            ddd: item.ddd,
            telefone: item.tel,
            email: item.email,
            hpage: item.hpage,
            mun: item.mun,
            pais: item.pais,
            pfisica: item.pfisica,
            dtcad: item.dtcad,
            est: item.est,
            cgc: item.cgc,
            contato: item.contato,
            obs: item.obs,
            complem: item.complem,
            rgoucadest: item.rgoucadest
          }));
        } else {
          return [];
        }
      })
    ).subscribe(clientes => {
      this.dataSource = new MatTableDataSource(clientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
        const dataStr = Object.values(data)
          .map(value => (value ? value.toString().toLowerCase() : ''))
          .join(' ');  // Combina todos os valores em uma única string
        return dataStr.includes(filter.trim().toLowerCase());
      };
    });
  }

  onSearch() {
    console.log('Formulário de busca:', this.searchForm.value);
  }

  onClear() {
    this.searchForm.reset();
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate(['/clientes/editar', cliente.codigo]);
  }

  onDelete(row: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { codigo: row.codigo }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.clienteService.deleteCliente(row.codigo,row.loja).subscribe();
        this.dataSource = new MatTableDataSource(this.dataSource.data.filter((cliente: Cliente) => cliente.codigo !== row.codigo));
        
        this.snackBar.open('Cliente excluído com sucesso!', 'Fechar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        }
    }
  )}
    
  applyFilter() {
    console.log('Formulário de busca:', this.searchForm.value);
    console.log('Filtro:', this.dataSource.filter);

    const formValues = this.searchForm.value;
    const filterString = Object.values(formValues)
      .filter(value => value)
      .map((value: unknown) => (value as string).toString().toLowerCase())
      .join(' ');  

    console.log('Filtro:', filterString);
  
    this.dataSource.filter = filterString;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}