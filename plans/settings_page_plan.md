# Plano de Implementação: Página de Configurações

**Agente de IA Responsável:** Agente de Gerente de Projeto
**Data:** 27 de setembro de 2025
**Status:** Planejamento

## 1. Objetivo

Criar uma nova área de "Configurações" no sistema BuffetFlow, acessível a partir do menu principal no header. Esta página centralizará funcionalidades críticas para o usuário, permitindo a gestão do seu perfil de buffet e dos seus métodos de pagamento para a assinatura do SaaS.

Este plano visa detalhar as etapas de desenvolvimento para o backend e frontend, garantindo uma implementação coesa e alinhada com a arquitetura do projeto.

## 2. Escopo e Funcionalidades

### 2.1. Ativação do Menu de Configurações

- **Tarefa:** Tornar o botão/link "Configurações" no header da aplicação funcional.
- **Comportamento:** Ao ser clicado, o link deve redirecionar o usuário para a nova rota `/settings`.

### 2.2. Seções da Página de Configurações

A página será dividida em abas para organizar as diferentes áreas de gestão.

#### 2.2.1. Aba 1: Perfil do Buffet

- **Objetivo:** Permitir que o usuário edite as informações do seu buffet, que foram fornecidas inicialmente na tela de onboarding.
- **Campos Editáveis:**
  - Logo do Buffet
  - Nome do Buffet
  - CNPJ
  - Endereço completo (Rua, Número, Bairro, Cidade, Estado, CEP)
  - Telefone de contato
  - E-mail de contato
- **Funcionalidade:** O usuário preenche o formulário e, ao salvar, as informações são atualizadas no banco de dados.

#### 2.2.2. Aba 2: Gestão de Pagamento

- **Objetivo:** Permitir que o usuário gerencie os cartões de crédito associados à sua assinatura do BuffetFlow.
- **Funcionalidades:**
  - **Visualizar Cartão Ativo:** Exibir o cartão de crédito que está sendo usado para a cobrança atual (mostrando apenas os últimos 4 dígitos e a bandeira).
  - **Adicionar Novo Cartão:** Um formulário para o usuário inserir os dados de um novo cartão de crédito.
  - **Alterar Cartão Padrão:** Permitir que o usuário selecione um dos cartões salvos como o novo método de pagamento principal.
  - **Remover Cartão:** Excluir um método de pagamento que não seja o padrão.

## 3. Plano de Execução Técnico

### 3.1. Backend (Django)

1.  **API para Perfil do Buffet:**
    - **Endpoint:** Criar um endpoint `PATCH /api/companies/my-company/`.
    - **View:** Implementar uma `view` que receba os dados do perfil do buffet e atualize o modelo `Company` associado ao usuário autenticado.
    - **Serializer:** Ajustar o `CompanySerializer` para validar e processar os dados recebidos.
    - **Permissões:** Garantir que apenas o proprietário da empresa possa fazer alterações.

2.  **API para Gestão de Pagamento:**
    - **Importante:** **NÃO** armazenaremos dados sensíveis de cartão de crédito diretamente no nosso banco de dados. A integração será feita com um provedor de pagamento (ex: Stripe, Pagar.me). O backend armazenará apenas um `customer_id` e `payment_method_id` retornados pela API do provedor.
    - **Endpoints:**
      - `GET /api/payment-methods/`: Listar os métodos de pagamento salvos para o cliente (retornando dados não sensíveis como bandeira e últimos 4 dígitos).
      - `POST /api/payment-methods/`: Endpoint para gerar um token de intenção de setup e enviá-lo ao frontend para adicionar um novo cartão na plataforma de pagamento.
      - `PATCH /api/payment-methods/<id>/set-default/`: Marcar um método de pagamento como padrão.
      - `DELETE /api/payment-methods/<id>/`: Remover um método de pagamento.
    - **Models:** Criar um modelo `PaymentMethod` para armazenar a referência ao ID do método de pagamento do provedor e sua associação com o `Company`.
    - **Views/Serializers:** Criar os componentes necessários para expor os endpoints acima.

### 3.2. Frontend (Next.js)

1.  **Roteamento e Layout:**
    - Criar a nova rota e página em `src/app/settings/page.tsx`.
    - Implementar o layout da página com um componente de abas (`Tabs`) para separar "Perfil do Buffet" e "Pagamento".

2.  **Ativação do Link no Header:**
    - No componente de layout principal (provavelmente em `src/components/layout/`), envolver o item de menu "Configurações" com um componente `<Link href="/settings">`.

3.  **Componente: Perfil do Buffet:**
    - Criar um formulário (`BuffetProfileForm`) utilizando os componentes `shadcn/ui`.
    - Ao carregar a página, fazer uma chamada `GET` para buscar os dados atuais do buffet e preencher o formulário.
    - Implementar a função de `onSubmit` que enviará uma requisição `PATCH` para o backend com os dados atualizados.
    - Adicionar feedback visual para o usuário (ex: toast de sucesso/erro, estado de loading no botão).

4.  **Componente: Gestão de Pagamento:**
    - Criar um componente `PaymentMethods` para listar os cartões.
    - Implementar a lógica para "Adicionar Cartão", que provavelmente envolverá o uso da biblioteca do provedor de pagamento no frontend para coletar os dados do cartão de forma segura e obter um token.
    - Adicionar botões para "Tornar Padrão" and "Remover", que farão as respectivas chamadas à API.

## 4. Fora do Escopo (Para este plano)

- A lógica de cobrança recorrente (processamento de pagamentos da assinatura). Este plano foca apenas na **gestão** dos métodos de pagamento.
- A implementação completa da integração com um provedor de pagamento. O backend deve ser estruturado para suportar a integração, mas a escolha e implementação final do provedor podem ser tratadas separadamente.
- Alterações no fluxo de onboarding.

## 5. Critérios de Aceite

- Clicar no link "Configurações" no header redireciona corretamente para a página `/settings`.
- A página de configurações exibe as abas "Perfil do Buffet" e "Pagamento".
- O usuário consegue visualizar e atualizar com sucesso as informações do seu buffet na aba "Perfil do Buffet".
- O usuário consegue visualizar seus métodos de pagamento, adicionar um novo, definir um como padrão e remover um existente na aba "Pagamento".
- Todas as operações possuem feedback visual (loading, sucesso, erro) para o usuário.
