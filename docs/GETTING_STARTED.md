# Guia de Instalação e Configuração

Este guia descreve os passos para configurar e executar o ambiente de desenvolvimento localmente.

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

- **Git**: Para clonar o repositório.
- **Docker**: Para executar os containers da aplicação.
- **Docker Compose**: Para orquestrar os containers.

## Passos para Instalação

1.  **Clonar o Repositório**:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd saas_buffet
    ```

2.  **Configurar Variáveis de Ambiente**:
    O projeto utiliza um arquivo `.env` para configurar as variáveis de ambiente. Embora um arquivo de exemplo não esteja presente, você pode criar um na raiz do projeto para configurar o `SECRET_KEY` do Django, credenciais do banco de dados, etc.

3.  **Iniciar os Containers**:
    Use o Docker Compose para construir as imagens e iniciar os serviços do backend, frontend e banco de dados.
    ```bash
    docker-compose up --build -d
    ```
    O comando acima irá:
    - Construir as imagens `backend` e `frontend`.
    - Iniciar os containers em modo `detached` (-d).

4.  **Executar as Migrações do Banco de Dados**:
    Após os containers estarem no ar, execute as migrações do Django para criar as tabelas no banco de dados.
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

## Acessando a Aplicação

- **Frontend**: A aplicação React estará disponível em `http://localhost:3000`.
- **Backend API**: A API do Django estará acessível em `http://localhost:8000/api/`.

## Executando Testes

- **Backend (Django)**:
  ```bash
  docker-compose exec backend python manage.py test
  ```

- **Frontend (React)**:
  ```bash
  docker-compose exec frontend npm test
  ```
