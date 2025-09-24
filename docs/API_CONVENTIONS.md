# Convenções da API REST

Este documento detalha as convenções de design para a API RESTful do BuffetFlow, garantindo consistência e previsibilidade.

## Endpoints

- **Nomenclatura**: Os endpoints devem usar substantivos no plural para representar coleções de recursos. A URL deve ser intuitiva e descrever o recurso.
  - **Exemplo**: `/api/events/`, `/api/clients/`

- **Versionamento**: A API é versionada através da URL para garantir que futuras alterações não quebrem a integração com o frontend.
  - **Exemplo**: `/api/v1/events/`

## Métodos HTTP

Utilize os verbos HTTP de forma semântica para interagir com os recursos:

- **`GET`**: Para recuperar recursos. É uma operação segura e idempotente.
  - `GET /api/v1/events/`: Lista todos os eventos.
  - `GET /api/v1/events/{id}/`: Recupera um evento específico.

- **`POST`**: Para criar um novo recurso. Não é idempotente.
  - `POST /api/v1/events/`: Cria um novo evento.

- **`PUT` / `PATCH`**: Para atualizar um recurso existente.
  - **`PUT`**: Atualiza o recurso por completo. Requer que o cliente envie todos os campos do recurso. É idempotente.
  - **`PATCH`**: Atualiza o recurso parcialmente. O cliente envia apenas os campos que deseja alterar. Não é necessariamente idempotente.
  - `PATCH /api/v1/events/{id}/`: Atualiza parcialmente um evento.

- **`DELETE`**: Para remover um recurso. É idempotente.
  - `DELETE /api/v1/events/{id}/`: Remove um evento.

## Formato de Dados

- **JSON**: Todas as requisições e respostas devem usar o formato JSON.
- **Cabeçalhos**: O cabeçalho `Content-Type` deve ser `application/json` para requisições com corpo (POST, PUT, PATCH).
- **Padrão de Nomenclatura**: As chaves (keys) no corpo JSON devem seguir o padrão `snake_case` (ex: `event_date`, `client_name`), que é o padrão do Python/Django.

## Autenticação

- **Token-Based**: A autenticação é baseada em token (ex: JWT - JSON Web Token).
- **Cabeçalho de Autorização**: O token deve ser enviado em todas as requisições a endpoints protegidos através do cabeçalho `Authorization`.
  - **Exemplo**: `Authorization: Bearer <seu_token_jwt>`

## Códigos de Status HTTP

Use os códigos de status HTTP apropriados para indicar o resultado da operação:

- **`2xx` (Sucesso)**
  - `200 OK`: Requisição bem-sucedida.
  - `201 Created`: Recurso criado com sucesso.
  - `204 No Content`: Requisição bem-sucedida, mas sem corpo de resposta (ex: após um DELETE).

- **`4xx` (Erro do Cliente)**
  - `400 Bad Request`: Requisição inválida (ex: dados faltando).
  - `401 Unauthorized`: Autenticação falhou ou não foi fornecida.
  - `403 Forbidden`: O usuário autenticado não tem permissão para realizar a ação.
  - `404 Not Found`: O recurso solicitado não foi encontrado.

- **`5xx` (Erro do Servidor)**
  - `500 Internal Server Error`: Um erro inesperado ocorreu no servidor.
