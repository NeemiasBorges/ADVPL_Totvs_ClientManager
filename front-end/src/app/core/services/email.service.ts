import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '@core/models/cliente.model';
import { environment } from '@environments/environment';

export interface EmailConfig {
  destinatario: string;
  assunto: string;
  corpo: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}/email`;
  private emailDestinatario = environment.emailNotificacao;

  constructor(private http: HttpClient) {}

  enviarNotificacaoCadastro(cliente: Cliente): Observable<void> {
    const config: EmailConfig = {
      destinatario: this.emailDestinatario,
      assunto: `Novo Cliente Cadastrado - ${cliente.nome}`,
      corpo: this.gerarCorpoEmail(cliente)
    };

    return this.http.post<void>(`${this.apiUrl}/enviar`, config);
  }

  enviarNotificacaoAlteracao(cliente: Cliente, camposAlterados: string[]): Observable<void> {
    const config: EmailConfig = {
      destinatario: this.emailDestinatario,
      assunto: `Cliente Alterado - ${cliente.nome}`,
      corpo: this.gerarCorpoEmailAlteracao(cliente, camposAlterados)
    };

    return this.http.post<void>(`${this.apiUrl}/enviar`, config);
  }

  private gerarCorpoEmail(cliente: Cliente): string {
    return `
      <h2>Novo Cliente Cadastrado</h2>
      <p><strong>Código:</strong> ${cliente.codigo}</p>
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <p><strong>Tipo:</strong> ${cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
      <p><strong>CPF/CNPJ:</strong> ${cliente.cnpjCpf}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Telefone:</strong> (${cliente.ddd}) ${cliente.telefone}</p>
      <p><strong>Status:</strong> ${cliente.status}</p>
    `;
  }

  private gerarCorpoEmailAlteracao(cliente: Cliente, camposAlterados: string[]): string {
    const camposFormatados = camposAlterados
      .filter(campo => campo !== 'endereco')
      .map(campo => `<li>${this.formatarNomeCampo(campo)}</li>`)
      .join('');

    return `
      <h2>Cliente Alterado</h2>
      <p><strong>Código:</strong> ${cliente.codigo}</p>
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <h3>Campos Alterados:</h3>
      <ul>
        ${camposFormatados}
      </ul>
    `;
  }

  private formatarNomeCampo(campo: string): string {
    const formatacao: { [key: string]: string } = {
      nome: 'Nome',
      cnpjCpf: 'CPF/CNPJ',
      email: 'E-mail',
      telefone: 'Telefone',
      status: 'Status',
      nomeFantasia: 'Nome Fantasia',
      homePage: 'Home Page',
      dataAberturaNascimento: 'Data de Abertura/Nascimento'
    };

    return formatacao[campo] || campo;
  }
}