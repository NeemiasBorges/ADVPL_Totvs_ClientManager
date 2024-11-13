# Cliente360 - Sistema de Gerenciamento de Clientes

Sistema full-stack para gerenciamento de clientes integrando Angular Material no frontend com API TOTVS Protheus, incluindo notificações por email automatizadas.

## 🚀 Tecnologias Utilizadas

### Frontend
- Angular 16+
- Angular Material
- RxJS
- TypeScript
- SCSS

### Backend
- TOTVS Protheus REST API
- Node.js (Serviço de Email)
- Express
- Nodemailer

## 📋 Pré-requisitos

- Node.js 18+
- Angular CLI 16+
- TOTVS Protheus configurado e rodando localmente
- NPM ou Yarn
- Banco de dados configurado no Protheus

## 🔧 Instalação e Configuração

### Frontend (Angular)

1. Clone o repositório e entre no diretório do frontend.
2. Instale as dependências.
3. Inicie o servidor de desenvolvimento.

### Serviço de Email (Node.js)

1. Entre no diretório do serviço de email e instale as dependências.
2. Configure as variáveis de ambiente.
3. Inicie o serviço.

### Configuração do arquivo .env para o serviço de email

Configure os valores de `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, e `TOTVS_API_URL` conforme necessário.

## 📐 Estrutura do Projeto

```
cliente360/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── shared/
│   │   ├── assets/
│   │   └── environments/
├── email-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
└── README.md
```

## 🔌 Endpoints da API TOTVS

### Clientes

- `GET /v1/clientes/listar` - Lista todos os clientes
- `GET /v1/clientes/:codigo` - Obtém detalhes de um cliente específico
- `POST /v1/clientes/incluir` - Cadastra novo cliente
- `PUT /v1/clientes/atualizar/:codigo/:loja` - Atualiza dados do cliente
- `DELETE /v1/clientes/deletar/:codigo/:loja` - Remove cliente
- `GET /v1/clientes/ultimoCodigo` - Obtém último código cadastrado
- `GET /v1/clientes/municipiosporestado/:estado` - Lista municípios por estado
- `GET /v1/clientes/codigomunicipio/:estado/:municipio` - Obtém código do município

## 📨 Serviço de Email

O serviço de email é um microsserviço Node.js que:
1. Monitora alterações na API TOTVS através de polling
2. Envia emails automáticos quando detecta alterações em clientes
3. Mantém um log de notificações enviadas

## 🔒 Segurança

- Implementação de JWT para autenticação
- Sanitização de inputs
- Validação de dados no frontend e backend
- Proteção contra CSRF
- Rate limiting na API

## 📦 Build e Deploy

### Frontend

1. Gerar build de produção.

### Serviço de Email

1. Gerar build de produção.

## 🛠️ Desenvolvimento

### Adicionando Novos Componentes

Para novos componentes, utilize `ng generate component` e `ng generate service` para novos serviços.

### Padrões de Código

- Utilize TypeScript strict mode
- Siga o style guide do Angular
- Mantenha componentes pequenos e reutilizáveis
- Implemente lazy loading para módulos
- Use interceptors para tratamento de erros

# 📝 Autores

- **Neemias Borges**
- **Amanda Marino**
- **Gabriel Rodrigues**
- **Gustavo Kravensko**
- **Gustavo Meira**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.