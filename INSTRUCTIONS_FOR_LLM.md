# Instruções para LLM

Este documento fornece um guia sobre como configurar e executar o ambiente de desenvolvimento do BuffetFlow, além de destacar algumas funcionalidades importantes.

## Visão Geral do Projeto

O BuffetFlow é uma plataforma SaaS para gerenciamento de buffets e espaços para eventos, com um backend em Django/Python e um frontend em Next.js/TypeScript. O ambiente é totalmente containerizado com Docker.

## Configuração e Execução

### Backend

O backend é executado em um container Docker.

1.  **Inicie os serviços:**
    Na raiz do projeto, execute o comando para construir as imagens e iniciar os containers do backend, banco de dados e Redis.

    ```bash
    docker-compose up --build
    ```

2.  **Comandos de Gerenciamento:**
    Para executar comandos do Django, como migrações ou criação de um superusuário, utilize `docker-compose exec`.

    ```bash
    # Aplicar migrações do banco de dados
    docker-compose exec web python manage.py migrate

    # Criar um superusuário
    docker-compose exec web python manage.py createsuperuser
    ```

### Frontend

O frontend é executado localmente e se conecta ao backend containerizado.

1.  **Navegue até o diretório do frontend:**

    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O frontend estará disponível em `http://localhost:3000`.

## Funcionalidades Importantes

### Autenticação

-   **API:** A autenticação é baseada em token (JWT). Inclua o token no cabeçalho `Authorization` como `Bearer <token>`.
-   **Frontend:** O hook `useAuth` em `frontend/src/hooks/use-auth.ts` gerencia o estado de autenticação.

### Estrutura da API

-   **Endpoints:** Siga o padrão de substantivos no plural (ex: `/api/events/`).
-   **Formato de Dados:** JSON com chaves em `snake_case`.

### Convenções de Código

-   **Backend:** Siga as convenções padrão do Python/Django.
-   **Frontend:** Siga as convenções padrão do React/TypeScript.

### Fluxo de Git

-   Consulte `docs/GIT_WORKFLOW.md` para as convenções de branches e mensagens de commit.
