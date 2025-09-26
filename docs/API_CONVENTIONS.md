# Convenções da API

Estas são as convenções para o design e a utilização da API RESTful do BuffetFlow.

## Endpoints

- **Nomenclatura:** Utilize substantivos no plural para os recursos (ex: `/api/events/`, `/api/clients/`).
- **Padrão:** Siga os princípios RESTful para a estrutura dos endpoints.

## Autenticação

- **Método:** A autenticação é baseada em Token JWT (JSON Web Token).
- **Cabeçalho:** O token deve ser enviado no cabeçalho `Authorization` de cada requisição protegida, no formato `Bearer <token>`.

## Formato de Dados

- **Padrão:** Todas as requisições e respostas devem utilizar o formato JSON.
- **Nomenclatura de Chaves:** As chaves dos objetos JSON devem seguir o padrão `snake_case` (ex: `event_name`, `client_id`).

## Verbos HTTP

Utilize os verbos HTTP de forma semântica e padrão:

- `GET`: Para recuperar recursos. É uma operação segura e idempotente.
- `POST`: Para criar novos recursos.
- `PATCH` ou `PUT`: Para atualizar recursos existentes. `PATCH` é preferível para atualizações parciais.
- `DELETE`: Para remover um recurso.

## Códigos de Status HTTP

Utilize os códigos de status HTTP convencionais para indicar o resultado da operação:

- **2xx (Sucesso):**
  - `200 OK`: Requisição bem-sucedida.
  - `201 Created`: Recurso criado com sucesso.
  - `204 No Content`: Requisição bem-sucedida, mas sem conteúdo para retornar (ex: após um `DELETE`).

- **4xx (Erro do Cliente):**
  - `400 Bad Request`: A requisição é inválida ou malformada.
  - `401 Unauthorized`: O cliente não está autenticado.
  - `403 Forbidden`: O cliente está autenticado, mas não tem permissão para acessar o recurso.
  - `404 Not Found`: O recurso solicitado não foi encontrado.

- **5xx (Erro do Servidor):**
  - `500 Internal Server Error`: Ocorreu um erro inesperado no servidor.