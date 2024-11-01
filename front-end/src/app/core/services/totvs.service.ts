import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '@core/models/cliente.model';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

export interface ClientesFiltro {
  nome?: string;
  cidade?: string;
  bairro?: string;
  cep?: string;
  pagina: number;
  tamanhoPagina: number;
}

export interface ClientesResponse {
  items: Cliente[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
}

@Injectable({
  providedIn: 'root'
})
export class TotvsService {
  private apiUrl = `${environment.apiUrl}/totvs`;

  constructor(private http: HttpClient) {}

  getNextClienteCode(): Observable<string> {
    return this.http.get<{ codigo: string }>(`${this.apiUrl}/clientes/proximo-codigo`)
      .pipe(
        map(response => response.codigo)
      );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/${cliente.codigo}`, cliente);
  }

  deleteCliente(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${codigo}`);
  }

  getClientes(filtro: ClientesFiltro): Observable<ClientesResponse> {
    let params = new HttpParams()
      .set('pagina', filtro.pagina.toString())
      .set('tamanhoPagina', filtro.tamanhoPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }
    if (filtro.cidade) {
      params = params.set('cidade', filtro.cidade);
    }
    if (filtro.bairro) {
      params = params.set('bairro', filtro.bairro);
    }
    if (filtro.cep) {
      params = params.set('cep', filtro.cep);
    }

    return this.http.get<ClientesResponse>(`${this.apiUrl}/clientes`, { params });
  }

  getClienteById(codigo: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${codigo}`);
  }

  generatePDF(codigos: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/clientes/relatorio`, 
      { codigos }, 
      { responseType: 'blob' }
    );
  }
}