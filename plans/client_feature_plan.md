# Plano de Implementação da Funcionalidade de Clientes

**Agente Responsável pelo Planejamento:** Agente Gerente de Projeto

**Agentes Recomendados para Execução:**
*   **Backend:** Agente Desenvolvedor Backend
*   **Frontend:** Agente Desenvolvedor Frontend
*   **API:** Agente Especialista em API (para garantir a conformidade)

## 1. Visão Geral

Este plano detalha as etapas necessárias para criar e integrar uma nova entidade de "Cliente" no sistema BuffetFlow. A funcionalidade permitirá o cadastro de clientes e a sua associação direta a eventos, centralizando as informações do cliente e simplificando a criação de eventos.

## 2. Tarefas de Backend

### 2.1. Criar App e Model de Cliente
1.  **Criar um novo Django app:**
    ```bash
    docker-compose exec web python manage.py startapp clients
    ```
2.  **Adicionar `'clients'` a `INSTALLED_APPS`** em `backend/buffetflow/settings.py`.
3.  **Definir o `Client` model** em `backend/clients/models.py`:
    *   `name` (CharField)
    *   `email` (EmailField, unique)
    *   `phone` (CharField)
    *   `company` (ForeignKey para o model `Company` em `users`)
    *   Outros campos relevantes (endereço, etc.) podem ser adicionados conforme necessário.

### 2.2. Criar API para Clientes
1.  **Criar `ClientSerializer`** em `backend/clients/serializers.py`.
2.  **Criar `ClientViewSet`** em `backend/clients/views.py` para fornecer as ações padrão de CRUD (List, Create, Retrieve, Update, Destroy).
3.  **Configurar as rotas da API** em `backend/clients/urls.py` e incluir este arquivo no `urls.py` principal do projeto (`backend/buffetflow/urls.py`) sob o prefixo `/api/clients/`.

### 2.3. Atualizar Model de Evento
1.  **Modificar o `Event` model** em `backend/events/models.py`:
    *   Remover os campos: `client_name`, `client_phone`, `client_email`.
    *   Adicionar um campo de chave estrangeira para o cliente:
        ```python
        client = models.ForeignKey('clients.Client', on_delete=models.PROTECT, related_name='events')
        ```

### 2.4. Gerar e Aplicar Migrações no Banco de Dados
1.  **Gerar os arquivos de migração** para as alterações nos models `clients` e `events`:
    ```bash
    docker-compose exec web python manage.py makemigrations clients events
    ```
2.  **Aplicar as migrações** ao banco de dados:
    ```bash
    docker-compose exec web python manage.py migrate
    ```

### 2.5. Atualizar Serializer e View de Evento
1.  **Atualizar `EventSerializer`** em `backend/events/serializers.py` para usar o `client_id` e aninhar os detalhes do cliente na leitura (read-only).
2.  Garantir que a `EventViewSet` lide corretamente com a associação do `client` ao criar/atualizar um evento.

## 3. Tarefas de Frontend

### 3.1. Criar Serviço de API para Clientes
1.  Em `frontend/src/services/api.ts`, adicionar funções para interagir com os novos endpoints `/api/clients/`:
    *   `getClients(search?: string)`
    *   `getClientById(id: string)`
    *   `createClient(data: ClientData)`
    *   `updateClient(id: string, data: ClientData)`
    *   `deleteClient(id: string)`

### 3.2. Criar Páginas de Gerenciamento de Clientes
1.  **Estrutura de diretórios:**
    *   `frontend/src/app/clients/`
    *   `frontend/src/app/clients/new/`
    *   `frontend/src/app/clients/[id]/`
    *   `frontend/src/app/clients/[id]/edit/`

2.  **Página de Listagem (`/clients`):**
    *   Criar `frontend/src/app/clients/page.tsx`.
    *   Reutilizar o layout da página de eventos, incluindo uma tabela (`<ClientsList />`) e um campo de busca.
    *   A tabela deve exibir colunas como Nome, Email, Telefone e um menu de ações (Ver, Editar, Excluir).
    *   Adicionar um botão "Novo Cliente" que redireciona para `/clients/new`.

3.  **Página de Criação/Edição (`/clients/new`, `/clients/[id]/edit`):**
    *   Criar um componente de formulário reutilizável `frontend/src/components/clients/client-form.tsx`.
    *   O formulário deve conter campos para `name`, `email` e `phone`.
    *   Criar as páginas em `.../clients/new/page.tsx` e `.../clients/[id]/edit/page.tsx` que utilizam o `client-form`.

4.  **Página de Visualização (`/clients/[id]`):**
    *   Criar `frontend/src/app/clients/[id]/page.tsx`.
    *   Exibir os detalhes completos do cliente.

### 3.3. Atualizar Formulário de Eventos
1.  **Modificar o formulário de evento** em `frontend/src/components/events/event-form.tsx`.
2.  **Remover os campos de input** para "Telefone do Cliente" e "Email do Cliente".
3.  **Substituir o campo "Nome do Cliente"** por um componente de `Combobox` (ou `Select`) que busca e lista os clientes cadastrados através da função `getClients()`.
4.  Ao selecionar um cliente no `Combobox`, o formulário deve armazenar o `id` do cliente para ser enviado na criação/atualização do evento.
