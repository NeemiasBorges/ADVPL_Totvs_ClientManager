import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { environment } from '../environments/environments'; // importe o environment
import { tap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { Console } from 'console';

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
  constructor(private http: HttpClient) {}

  consultarCNPJ(cnpj: string): Observable<CNPJResponse> {
    const url = 'https://corsproxy.io/?' + encodeURIComponent(`${environment.API_RECEITA}${cnpj}`);
    
    return this.http.get<CNPJResponse>(url).pipe(
      tap(response => console.log('Resposta da API:', response)), // para debug
      catchError(error => {
        console.error('Erro na consulta do CNPJ:', error);
        return throwError(() => error);
      })
    );
  }

  getCliente(codigo: string): Observable<any> {
    const url = `${environment.API_TOTVS_DETAIL_CLIENTE}/'${codigo}'`;
    return this.http.get<CNPJResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  addCliente(cliente: Cliente): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46IA=='
    });
  
    const url = `${environment.API_TOTVS_ADICIONA_CLIENTE}`;
  
    return this.http.post(url, cliente, { headers }).pipe(
      tap((response) => console.log('Cliente adicionado:', response)),
      catchError(this.handleError)
    );
  }

  consultarCEP(cep: string): Observable<any> {
    console.log("Consultando CEP:", cep);
    const url = `${environment.API_CORREIOS}${cep}/json/`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  consultarUltimoCodigo(): Observable<any> {
    return this.http.get(environment.API_TOTVS_GETLASTCODE).pipe(
      catchError(this.handleError)
    );
  }
 
  deleteCliente(codigoCliente: string, loja:string): Observable<any> {
    return this.http.delete(`${environment.API_TOTVS_DELETA_CLIENTE}/${codigoCliente}/${loja}`).pipe(
      catchError(this.handleError)
    );
  }

  pegarTodosClientes(): Observable<any> {
    return this.http.get(environment.API_TOTVS_GETCLIENTE).pipe(
      catchError(this.handleError)
    );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46IA==' 
    });

    const url = `${environment.API_TOTVS_ATUALIZA_CLIENTE}/${cliente.codigo}/${cliente.loja}`;

    return this.http.put(url, cliente, { headers }).pipe(
      tap((response) => console.log('Cliente atualizado:', response)),
      switchMap((response) => {
        return this.getCliente(cliente.codigo);
      }),
      switchMap((serverCliente) => {
        const camposAtualizados = this.obterCamposAtualizados(cliente, serverCliente.items[0]);
        return this.enviarResumoEmail(cliente, camposAtualizados);
      }),
      map(() => 200), 
      catchError((error) => {
        this.handleError(error);
        return of(200); 
      })
    );
    
  }

  private obterCamposAtualizados(cliente: Cliente, serverCliente: Cliente): Array<{ campo: string, valorAntigo: any, valorNovo: any }> {
    const camposAtualizados: Array<{ campo: string, valorAntigo: any, valorNovo: any }> = [];
  
    for (const prop in cliente) {
      if ((cliente as any)[prop] !== (serverCliente as any)[prop]) {
        camposAtualizados.push({
          campo: prop,
          valorAntigo: (serverCliente as any)[prop],
          valorNovo: (cliente as any)[prop]
        });
      }
    }
  
    return camposAtualizados;
  }
  

  private enviarResumoEmail(cliente: Cliente, camposAtualizados: Array<{ campo: string, valorAntigo: any, valorNovo: any }>): Observable<any> {
    const emailData = {
      to: 'ifsp.neemiasb@gmail.com',
      subject: 'Resumo de atualização do cliente',
      body: this.gerarCorpoEmail(cliente, camposAtualizados)
    };

    const emailUrl = 'http://localhost:3000/send-email';
    return this.http.post(emailUrl, emailData).pipe(
      tap(() => console.log('ifsp.neemiasb@gmail.com')),
      catchError(this.handleError)
    );
  }

  private gerarCorpoEmail(cliente: Cliente, camposAtualizados: Array<{ campo: string, valorAntigo: any, valorNovo: any }>): string {
    console.log('Gerando corpo do email...');

    let corpoEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resumo de Atualização de Cliente</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Resumo de Atualização do Cliente ${cliente.codigo}</h1>
          <p>O cliente foi atualizado Recentemente. Aqui estão os campos atualizados:</p>
          <table>
            <tr>
              <th>Campo</th>
              <th>Valor Antigo</th>
              <th>Valor Novo</th>
            </tr>`;
  
    for (const campo of camposAtualizados) {
      if (campo.valorNovo){
        if (campo.campo === 'tipo') {
        } else {
          corpoEmail += `
          <tr>
          <td>${campo.campo}</td>
          <td>${campo.valorAntigo}</td>
          <td>${campo.valorNovo}</td>
          </tr>`;
          }
        }
    }
  
    corpoEmail += `
          </table>
        </div>
      </body>
      </html>`;
  
    return corpoEmail;
  }

  private obterValorCampo(cliente: Cliente, campo: string): string {
    switch (campo) {
      case 'codigo':
        return `${cliente.codigo}`;
      case 'loja':
        return cliente.loja;
      case 'razao':
        return cliente.razao;
      case 'endereco':
        return cliente.endereco;
      case 'cidade':
        return cliente.cidade;
      case 'est':
        return cliente.est;
      case 'tel':
        return cliente.tel;
      case 'email':
        return cliente.email;
      default:
        return '';
    }
  }

  gerarProximoCodigo(codigoAtual: string): string {
    const  prefixo     = codigoAtual.replace(/[0-9]/g, '');
    const  numeroAtual = codigoAtual.replace(/[^0-9]/g, '');
    const  digitos     = numeroAtual.length; 
    const  numero      = parseInt(numeroAtual);
    const  novoNumero  = (numero + 1).toString().padStart(digitos, '0');

    return prefixo + novoNumero;
  }

  consultarMunicipio(uf: string, cidade: string): Observable<any> {
    cidade = cidade.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/Ç/g, 'C')
    .replace(/Ñ/g, 'N')
    .replace(/[ÁÀÃÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÕÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
    .toUpperCase();

    const url = `/api/restapi/v1/clientes/codigomunicipio/'${uf}'/'${cidade}'`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na consulta de CNPJ:', error);
    return throwError(() => new Error('Erro ao consultar CNPJ. Tente novamente mais tarde.'));
  }

}