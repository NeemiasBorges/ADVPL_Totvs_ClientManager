import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';

export interface DadosReceita {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  dataAbertura: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReceitaFederalService {
  private apiUrl = `${environment.apiUrl}/receita-federal`;

  constructor(private http: HttpClient) {}

  consultarCNPJ(cnpj: string): Observable<DadosReceita> {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    return this.http.get<DadosReceita>(`${this.apiUrl}/cnpj/${cnpjLimpo}`).pipe(
      map(response => ({
        ...response,
        dataAbertura: new Date(response.dataAbertura)
      })),
      catchError(error => {
        console.error('Erro ao consultar CNPJ:', error);
        throw error;
      })
    );
  }
}