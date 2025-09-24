# Convenções da API

-   **Endpoints:** Substantivos no plural (ex: `/api/events/`).
-   **Autenticação:** Baseada em Token (JWT) através do header `Authorization: Bearer <token>`.
-   **Formato de Dados:** JSON com `snake_case` para as chaves.
-   **Verbos HTTP:** Uso padrão (`GET`, `POST`, `PATCH`, `DELETE`).
-   **Códigos de Status:** Códigos de status HTTP convencionais são usados para indicar sucesso ou falha.

## Exemplo de Requisição

```http
GET /api/events/
Authorization: Bearer <seu_token_jwt>

HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "id": 1,
        "event_name": "Festa de Aniversário",
        "event_date": "2025-12-31T18:00:00Z",
        "total_guests": 100
    }
]
```
