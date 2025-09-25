# Guia de Iniciação Rápida com Docker

O ambiente de desenvolvimento do BuffetFlow é gerenciado com Docker, simplificando a configuração e garantindo consistência entre diferentes máquinas.

## Ambiente de Desenvolvimento (Docker)

### 1. Iniciar Todos os Serviços

Com o Docker e Docker Compose instalados, execute o seguinte comando na raiz do projeto para construir as imagens e iniciar os contêineres do backend, banco de dados e Redis:

```bash
docker-compose up --build
```

Este comando deixará os serviços rodando em primeiro plano, permitindo que você visualize os logs em tempo real. Para rodar em segundo plano, adicione a flag `-d`.

### 2. Executar Comandos de Gerenciamento

Para executar comandos `manage.py` no contêiner do backend (chamado `web`), utilize `docker-compose exec`.

**Exemplos:**

```bash
# Aplicar migrações do banco de dados
docker-compose exec web python manage.py migrate

# Criar um superusuário para acessar o Admin do Django
docker-compose exec web python manage.py createsuperuser

# Acessar o shell do Django
docker-compose exec web python manage.py shell
```

## Frontend (Next.js)

O frontend continua sendo executado localmente, conectando-se à API que está rodando no Docker.

1.  **Navegue até o diretório do frontend (em um novo terminal):**
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
