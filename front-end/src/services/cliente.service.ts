import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CNPJResponse {
  nome: string;
  fantasia: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private corsProxy = 'https://cors-anywhere.herokuapp.com/';
  private apiUrl = 'https://receitaws.com.br/v1/cnpj/';

  constructor(private http: HttpClient) {}

  consultarCNPJ(cnpj: string): Observable<CNPJResponse> {
    const url = `${this.corsProxy}${this.apiUrl}${cnpj}`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'origin': window.location.origin
    });

    return this.http.get<CNPJResponse>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na consulta de CNPJ:', error);
    return throwError(() => new Error('Erro ao consultar CNPJ. Tente novamente mais tarde.'));
  }
}