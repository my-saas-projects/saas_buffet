# Guia de Iniciação

## Backend (Django)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd backend
    ```
2.  **Ative o ambiente virtual:**
    ```bash
    source venv_saas_buffet/bin/activate
    ```
3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Execute as migrações:**
    ```bash
    python manage.py migrate
    ```
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```

## Frontend (Next.js)

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

## Docker

-   **Iniciar todos os serviços:**
    ```bash
    docker-compose up
    ```
-   **Iniciar serviços específicos (por exemplo, banco de dados e Redis):**
    ```bash
    docker-compose up -d db redis
    ```
