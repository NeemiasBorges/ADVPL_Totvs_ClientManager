# FTCITP_Proteus
Projeto de Proteus e ADVPL++

# Documentação da API TAB_CLIENTES

Este documento fornece uma visão geral da API TAB_CLIENTES, que gerencia operações relacionadas ao gerenciamento de clientes.

## Índice

1. [Introdução](#introdução)
2. [Endpoints](#endpoints)
3. [Métodos](#métodos)
4. [Tratamento de Erros](#tratamento-de-erros)

## Introdução

A API TAB_CLIENTES é construída usando o TOTVS Language Pack (TLPP) e fornece funcionalidades para gerenciar informações de clientes. Inclui operações como listar clientes, recuperar detalhes específicos de clientes, atualizar informações de clientes, excluir clientes e adicionar novos clientes.

## Endpoints

A API expõe os seguintes endpoints:

- `/v1/clientes/listar`: Listar todos os clientes
- `/v1/clientes/lista_cliente`: Recuperar informações de um cliente específico
- `/v1/clientes/atualizar`: Atualizar informações do cliente
- `/v1/clientes/deletar`: Excluir um cliente
- `/v1/clientes/incluir`: Adicionar um novo cliente

## Métodos

### Listar Todos os Clientes

- **Endpoint**: `/v1/clientes/listar`
- **Método**: GET
- **Descrição**: Recupera uma lista de todos os clientes no sistema.
- **Resposta**: Retorna um objeto JSON contendo informações dos clientes.

### Recuperar Informações do Cliente

- **Endpoint**: `/v1/clientes/lista_cliente`
- **Método**: GET
- **Descrição**: Recupera informações detalhadas de um cliente específico.
- **Parâmetros de Consulta**:
  - `codigo`: Código do cliente
  - `loja`: Código da loja do cliente
- **Resposta**: Retorna um objeto JSON com os detalhes do cliente.

### Atualizar Cliente

- **Endpoint**: `/v1/clientes/atualizar`
- **Método**: PUT
- **Descrição**: Atualiza as informações de um cliente existente.
- **Corpo da Requisição**: Objeto JSON contendo as informações atualizadas do cliente.
- **Resposta**: Retorna uma mensagem de sucesso se a atualização for bem-sucedida.

### Excluir Cliente

- **Endpoint**: `/v1/clientes/deletar`
- **Método**: DELETE
- **Descrição**: Remove um cliente do sistema.
- **Parâmetros de Consulta**:
  - `codigo`: Código do cliente
  - `loja`: Código da loja do cliente
- **Resposta**: Retorna uma mensagem de sucesso se a exclusão for bem-sucedida.

### Adicionar Novo Cliente

- **Endpoint**: `/v1/clientes/incluir`
- **Método**: POST
- **Descrição**: Adiciona um novo cliente ao sistema.
- **Corpo da Requisição**: Objeto JSON contendo as informações do novo cliente.
- **Resposta**: Retorna uma mensagem de sucesso se o cliente for adicionado com sucesso.

## Tratamento de Erros

Em caso de erros, a API retornará códigos de status HTTP apropriados junto com mensagens de erro no corpo da resposta. Os códigos de status comuns incluem:

- 200: Operação bem-sucedida
- 400: Requisição inválida (por exemplo, parâmetros ausentes ou inválidos)
- 404: Recurso não encontrado
- 500: Erro interno do servidor
