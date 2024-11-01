import { Endereco } from './endereco.model';

export interface Cliente {
    codigo: string;          
    loja: string;
    nome: string;
    tipo: 'PF' | 'PJ';
    endereco: Endereco;
    nomeFantasia?: string;
    cnpjCpf: string;
    ddd: string;
    telefone: string;
    email: string;
    homePage?: string;
    dataAberturaNascimento: Date;
    status: 'ATIVO' | 'INATIVO';
    complemento?: string;
  }