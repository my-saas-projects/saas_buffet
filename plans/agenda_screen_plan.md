# Plano de Implementação da Tela de Agenda

**Agente Responsável:** Agente Gerente de Projeto

## Objetivo

Implementar uma tela de "Agenda" que exiba os eventos em um calendário visual, permitindo que os usuários visualizem rapidamente os eventos agendados por dia, semana ou mês.

## Detalhamento do Plano

### 1. Backend (API)

O backend precisará fornecer um endpoint para que o frontend possa buscar os eventos de forma eficiente para exibição no calendário.

- **Tarefa 1.1: Criar Novo Endpoint da API**
  - **Arquivo:** `backend/events/views.py`
  - **Descrição:** Criar uma nova `APIView` ou `ViewSet` que retorne uma lista de eventos. O endpoint deve suportar filtros por período (data de início e fim).
  - **Endpoint Sugerido:** `GET /api/events/agenda/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

- **Tarefa 1.2: Criar Serializer Específico**
  - **Arquivo:** `backend/events/serializers.py`
  - **Descrição:** Criar um `EventAgendaSerializer` que retorne apenas os campos necessários para a exibição no calendário, como `id`, `title` (nome do evento), `start` (data do evento) e `status`. Isso otimiza o payload.

- **Tarefa 1.3: Atualizar Rotas da API**
  - **Arquivo:** `backend/events/urls.py`
  - **Descrição:** Adicionar a nova rota do endpoint da agenda ao `urlpatterns`.

### 2. Frontend (React/Next.js)

O frontend será responsável por renderizar o calendário e buscar os dados do backend.

- **Tarefa 2.1: Criar a Nova Página da Agenda**
  - **Arquivo:** `frontend/src/app/agenda/page.tsx`
  - **Descrição:** Criar a estrutura da página que abrigará o componente do calendário.

- **Tarefa 2.2: Escolher e Instalar Biblioteca de Calendário**
  - **Descrição:** Pesquisar e decidir por uma biblioteca de calendário para React. Boas opções são `FullCalendar` ou `react-big-calendar`. Após a escolha, instalar a dependência via `npm install`.

- **Tarefa 2.3: Criar o Componente do Calendário**
  - **Arquivo:** `frontend/src/components/calendar/event-calendar.tsx`
  - **Descrição:** Criar um componente reutilizável que encapsula a biblioteca de calendário. Este componente será responsável por receber os eventos e renderizá-los.

- **Tarefa 2.4: Integrar API Service**
  - **Arquivo:** `frontend/src/services/api.ts`
  - **Descrição:** Adicionar uma nova função `getAgendaEvents(startDate, endDate)` que faça a chamada para o novo endpoint do backend.

- **Tarefa 2.5: Conectar Componente com a API**
  - **Arquivo:** `frontend/src/components/calendar/event-calendar.tsx`
  - **Descrição:** Utilizar a função do `api.ts` para buscar os eventos conforme o usuário navega pelo calendário (mudando de mês/semana) e exibi-los.

- **Tarefa 2.6: Adicionar Navegação**
  - **Descrição:** Adicionar um link para a página `/agenda` no menu principal ou na barra de navegação da aplicação para que os usuários possam acessá-la.

### 3. Testes

- **Tarefa 3.1: Testes de Backend**
  - **Arquivo:** `backend/events/tests.py`
  - **Descrição:** Criar testes unitários para o novo endpoint da API, garantindo que os filtros de data funcionem corretamente e que o formato dos dados esteja correto.

- **Tarefa 3.2: Testes de Frontend**
  - **Descrição:** Criar testes de componente para o `event-calendar.tsx`, verificando se os eventos são renderizados corretamente quando passados como props.

