# Plano de Finalização do Frontend - MVP BuffetFlow

## 1. Visão Geral

Este documento detalha o plano de ação para implementar as interfaces de frontend pendentes e concluir o MVP (Produto Mínimo Viável) do sistema BuffetFlow. A análise anterior revelou que o backend está completo, mas o frontend requer desenvolvimento nas áreas de Eventos, Cardápio e Finanças.

Este plano é projetado para ser executado em sprints focadas, garantindo que o produto final esteja alinhado com os requisitos do PRD.

## 2. Sprints de Desenvolvimento

### Sprint 1: Gestão Completa de Eventos

**Objetivo:** Finalizar a interface de gestão de eventos, permitindo a criação, edição e visualização em calendário.

**Tarefas:**

1.  **Componente de Formulário de Evento (`EventForm.tsx`):**
    -   Criar um formulário reutilizável para adicionar e editar eventos.
    -   Incluir campos para todas as informações do modelo `Event` (título, data, cliente, nº de convidados, etc.).
    -   Adicionar validação de campos.

2.  **Modal de Criação/Edição:**
    -   Na página `Events.tsx`, implementar um modal que utilize o `EventForm.tsx`.
    -   O botão "+ Novo Evento" deve abrir o modal para criação.
    -   O botão "Editar" em cada card de evento deve abrir o modal com os dados do evento preenchidos.

3.  **Integração com API:**
    -   Conectar o formulário aos endpoints da API para `POST /events/` (criar) e `PUT /events/{id}/` (atualizar).
    -   Atualizar a lista de eventos automaticamente após uma criação ou edição bem-sucedida.

4.  **Agenda Visual (`react-big-calendar` ou similar):**
    -   Substituir a atual visualização em grid da página `Events.tsx` por um componente de calendário.
    -   Exibir os eventos nas datas correspondentes.
    -   Implementar uma estilização que mostre rapidamente o status do evento (e.g., confirmado, pendente).
    -   Ao clicar em um evento no calendário, exibir seus detalhes ou abrir o modal de edição.

### Sprint 2: Gestão de Cardápios e Custos

**Objetivo:** Implementar a interface para gerenciar os itens do cardápio e associá-los a um evento.

**Tarefas:**

1.  **Página de Gestão de Cardápio (`Menu.tsx`):**
    -   Transformar a página `Menu.tsx` de um placeholder para uma interface funcional.
    -   Implementar o CRUD (Criar, Ler, Atualizar, Deletar) para os `MenuItem` da empresa.
    -   A interface deve permitir adicionar, editar e remover itens como "Coxinha", "Bolo de Chocolate", etc., definindo seu custo e preço por pessoa.

2.  **Associação de Cardápio ao Evento:**
    -   Criar uma nova página de "Detalhes do Evento" (`/events/{id}`).
    -   Nesta página, adicionar uma seção "Cardápio do Evento".
    -   Implementar uma funcionalidade que permita buscar e adicionar `MenuItem`s (criados no passo anterior) ao cardápio específico daquele evento.
    -   Permitir a remoção de itens e o ajuste de quantidades.

3.  **Visualização de Custos do Cardápio:**
    -   Na seção "Cardápio do Evento", exibir o cálculo do custo total dos alimentos (`food_cost`) em tempo real, com base nos itens adicionados e no número de convidados do evento.

### Sprint 3: Gestão Financeira e Orçamentos

**Objetivo:** Criar a interface para a calculadora de custos e para a geração e visualização de orçamentos.

**Tarefas:**

1.  **Página Financeira (`Financial.tsx`):**
    -   Transformar a página `Financial.tsx` em um painel que liste todos os orçamentos (`Quote`) gerados, com seus respectivos status (aprovado, pendente, etc.).

2.  **Interface da Calculadora de Custos:**
    -   Na página de "Detalhes do Evento", adicionar uma aba ou seção "Financeiro".
    -   Nesta seção, criar uma interface para o `CostCalculation`.
    -   O `food_cost` virá da Sprint 2. Adicionar campos para o usuário inserir outros custos: mão de obra, equipamentos, transporte, etc.
    -   Incluir um campo para definir a margem de lucro desejada.
    -   Exibir o "Custo Total" e o "Preço Sugerido" calculados em tempo real.

3.  **Geração e Visualização de Orçamentos:**
    -   Adicionar um botão "Gerar Orçamento" que utilize os dados da calculadora para criar um `Quote` via API.
    -   Na mesma seção, listar as versões de orçamentos geradas para aquele evento.
    -   Implementar uma funcionalidade que permita ao usuário visualizar o PDF do orçamento gerado pelo backend.
