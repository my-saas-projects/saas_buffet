# Guia de Iniciação Rápida

Este guia fornece as instruções essenciais para configurar e executar o ambiente de desenvolvimento do BuffetFlow localmente.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior) e npm

## 1. Iniciar os Serviços (Backend)

O backend, o banco de dados e outros serviços são gerenciados pelo Docker Compose.

No diretório raiz do projeto, execute:

```bash
docker-compose up --build
```

Este comando irá construir as imagens Docker e iniciar os contêineres necessários.

## 2. Executar Comandos de Gerenciamento do Backend

Para aplicar as migrações do banco de dados ou criar um superusuário, utilize `docker-compose exec`.

```bash
# Aplicar migrações
docker-compose exec web python manage.py migrate

# Criar um superusuário para acessar o Django Admin
docker-compose exec web python manage.py createsuperuser
```

## 3. Iniciar o Ambiente de Desenvolvimento (Frontend)

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

Após esses passos, o frontend estará acessível em `http://localhost:3000` e o backend em `http://localhost:8000`.