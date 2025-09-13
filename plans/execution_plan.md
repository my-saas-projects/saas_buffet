# Plano de Execução - BuffetFlow

Este plano de execução detalha as fases e sprints para o desenvolvimento do sistema BuffetFlow, com base nos documentos de requisitos (PRD), modelos de dados e fluxograma.

## Fase 0: Configuração do Projeto (Sprint 0) ✅ CONCLUÍDO

**Objetivo:** Preparar o ambiente de desenvolvimento e a estrutura inicial do projeto.

- **Tarefas:**
  - **Backend:**
    - [x] Inicializar projeto Django com Docker.
    - [x] Configurar ambiente virtual (`venv`).
    - [x] Configurar banco de dados (PostgreSQL) com Docker para modo de desenvolvimento e PostgreSQL Supabase para modo de produção.
    - [x] Estruturar o projeto em apps (e.g., `users`, `events`, `financials`).
  - **Controle de Versão:**
    - [x] Configurar `.gitignore`.
  - **Frontend:**
    - [x] Inicializar projeto React (ou similar).
    - [x] Configurar comunicação com o backend Django.

## Fase 1: MVP (Produto Mínimo Viável)

**Objetivo:** Lançar uma versão funcional com os recursos essenciais para validar o modelo de negócio.

### Sprint 1: Gestão de Usuários e Empresas ✅ CONCLUÍDO

- **Objetivo:** Implementar o sistema de autenticação e o cadastro de empresas.
- **Models (Django):** `User`, `Company`.
- **Funcionalidades:**
  - [x] Tela de login e registro de usuários.
  - [x] Fluxo de onboarding para novas empresas (guiado, conforme `flowchart.md`).
  - [x] Edição de perfil de usuário e dados da empresa.
  - [x] Definição de papéis de usuário (`owner`, `manager`, etc.).

### Sprint 2: Gestão de Eventos ✅ CONCLUÍDO

- **Objetivo:** Permitir o cadastro e a visualização de eventos.
- **Models (Django):** `Event`.
- **Funcionalidades:**
  - [x] Formulário para criação e edição de eventos.
  - [x] Listagem de eventos (futuros e passados).
  - [x] Detalhes do evento.
  - [x] Implementação da lógica de verificação de conflitos de agenda (`is_conflicting`).
  - [x] Agenda visual (calendário) com indicação de dias ocupados.

### Sprint 3: Cardápio e Custos Básicos ✅ CONCLUÍDO

- **Objetivo:** Implementar a gestão de cardápios e associá-los a eventos.
- **Models (Django):** `MenuItem`, `EventMenu`.
- **Funcionalidades:**
  - [x] CRUD para `MenuItem` (itens do cardápio da empresa).
  - [x] Funcionalidade para adicionar/remover itens do cardápio de um evento (`EventMenu`).
  - [x] Cálculo automático do custo de alimentos com base no número de convidados e no cardápio selecionado.

### Sprint 4: Financeiro e Orçamentos ✅ CONCLUÍDO

- **Objetivo:** Criar a calculadora de custos e a geração de orçamentos.
- **Models (Django):** `CostCalculation`, `Quote`.
- **Funcionalidades:**
  - [x] Calculadora de custos para eventos, incluindo alimentos, mão de obra e outros custos.
  - [x] Sugestão de preço com base na margem de lucro definida pela empresa.
  - [x] Geração de orçamentos em PDF (versão simples, com template padrão).
  - [x] Histórico de versões de orçamentos para um mesmo evento.

### Sprint 5: Dashboard e Notificações ✅ CONCLUÍDO

- **Objetivo:** Criar um painel central e um sistema de alertas.
- **Models (Django):** `Notification`, `AuditLog`.
- **Funcionalidades:**
  - [x] Dashboard com visão geral de próximos eventos, status e alertas.
  - [x] Sistema de notificações para alertas de conflitos, prazos, etc.
  - [x] Implementação de logs de auditoria (`AuditLog`) para ações importantes.
  - [x] Exportação de dados simples para Excel/CSV.

## Fase 2: Expansão Básica (Pós-MVP)

**Objetivo:** Adicionar funcionalidades para aprimorar a gestão e a automação.

- **Funcionalidades:**
  - [ ] **Controle de Estoque:**
    - Previsão de compras com base em eventos futuros.
    - Alertas de itens com estoque baixo ou perto da validade.
  - [ ] **Gestão de Equipe:**
    - Cadastro de membros da equipe.
    - Alocação de staff para eventos.
  - [ ] **Integrações:**
    - Sincronização de eventos com Google Calendar.
    - Envio de notificações e orçamentos via WhatsApp (Twilio API).
  - [ ] **Relatórios Financeiros:**
    - Análise de margem de lucro real vs. projetada.
    - Relatório de faturamento por período.

## Fase 3: Funcionalidades Avançadas

**Objetivo:** Diferenciar o produto com recursos de alto valor agregado.

- **Funcionalidades:**
  - [ ] **IA para Previsão:**
    - Sugestões de cardápios com base em popularidade e sazonalidade.
    - Otimização de preços e custos.
  - [ ] **Portal do Cliente:**
    - Área para o cliente final acompanhar o andamento do evento, aprovar orçamentos e fazer pagamentos.
  - [ ] **Contratos Digitais:**
    - Geração e assinatura eletrônica de contratos.
  - [ ] **Analytics Avançado:**
    - Dashboards interativos com filtros avançados.
    - Relatórios de tendências e performance do buffet.
