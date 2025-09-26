# Plano de Implementação: Formulário de Nova Transação

**Agente Responsável pelo Planejamento:** Agente Gerente de Projeto

**Agentes Responsáveis pela Execução:** Agente Desenvolvedor Frontend, Agente Desenvolvedor Backend

## Objetivo

Implementar um formulário para a criação de novas transações financeiras (Entradas e Saídas) na página "Financeiro" da aplicação. O formulário deverá ser acessível através de um botão na aba "Transações" e ser apresentado em um modal (dialog).

## Justificativa

Atualmente, a página financeira exibe dados e transações, mas não oferece uma maneira de inserir novos registros manualmente. Esta funcionalidade é crucial para que os usuários possam manter o controle financeiro atualizado, registrando despesas e receitas avulsas que não estão diretamente ligadas a eventos.

---

## Detalhamento das Tarefas

### Backend (Agente Desenvolvedor Backend)

O backend já possui o `ModelViewSet` para `FinancialTransaction`, o que significa que os endpoints para operações CRUD (`/api/financials/transactions/`) já devem existir.

1.  **Verificação e Teste do Endpoint `POST`:**
    *   **Tarefa:** Confirmar que o endpoint `POST /api/financials/transactions/` está funcional e aceita a criação de novas transações.
    *   **Critérios de Aceite:**
        *   É possível criar uma nova transação enviando um JSON com `description`, `amount`, `transaction_type`, e `transaction_date`.
        *   O endpoint retorna o objeto da transação criada com um status `201 Created`.
        *   As validações do serializer funcionam corretamente (ex: campos obrigatórios).
    *   **Ação:** Criar um teste automatizado em `financials/tests.py` para validar a criação de uma `FinancialTransaction`.

### Frontend (Agente Desenvolvedor Frontend)

A maior parte do trabalho será no frontend.

1.  **Criar o Botão de Ação:**
    *   **Local:** `frontend/src/app/financeiro/page.tsx`, dentro da `TabsContent` com `value="transactions"`.
    *   **Tarefa:** Adicionar um componente `<Button>` com o texto "Adicionar Nova Transação".
    *   **Componente:** Utilizar o componente `<Button>` de `shadcn/ui`.

2.  **Criar o Componente do Formulário (`NewTransactionForm.tsx`):**
    *   **Local:** `frontend/src/components/financials/NewTransactionForm.tsx`.
    *   **Tarefa:** Desenvolver o formulário utilizando `react-hook-form` e `zod` para validação, seguindo o padrão de outros formulários do projeto.
    *   **Campos do Formulário:**
        *   `description` (Input de texto)
        *   `amount` (Input de número)
        *   `transaction_type` (Select com as opções "Entrada" e "Saída")
        *   `transaction_date` (DatePicker)
        *   `status` (Select com as opções "Pendente", "Concluído", "Cancelado")
    *   **Componentes:** Utilizar os componentes de `shadcn/ui`: `<Input>`, `<Select>`, `<DatePicker>`.

3.  **Criar o Modal de Adição (`NewTransactionDialog.tsx`):**
    *   **Local:** `frontend/src/components/financials/NewTransactionDialog.tsx`.
    *   **Tarefa:** Criar um componente que utilize o `<Dialog>` de `shadcn/ui` para encapsular o `NewTransactionForm`.
    *   **Funcionalidade:**
        *   O estado de "aberto/fechado" do dialog será controlado a partir da página principal (`FinanceiroPage`).
        *   O dialog conterá o título "Nova Transação".
        *   O dialog terá um botão "Salvar" que aciona a submissão do formulário e um botão "Cancelar" para fechar o modal.

4.  **Integração na Página Financeira:**
    *   **Local:** `frontend/src/app/financeiro/page.tsx`.
    *   **Tarefa:**
        *   Importar e renderizar o `NewTransactionDialog`.
        *   Controlar a visibilidade do dialog com um estado (`useState`).
        *   O botão "Adicionar Nova Transação" deverá abrir o dialog.
        *   Implementar a função de callback `onSubmit` que será passada para o `NewTransactionDialog`.
        *   A função `onSubmit` fará a chamada à API (`financialsAPI.createTransaction(data)`).
        *   Após o sucesso da chamada, o dialog deve ser fechado e a tabela de transações (`TransactionsDataTable`) deve ser atualizada para refletir o novo registro.

---

## Critérios de Sucesso

-   O usuário consegue abrir o formulário de nova transação clicando em um botão na aba "Transações".
-   O formulário valida os campos corretamente.
-   O usuário consegue criar uma nova transação (Entrada ou Saída) com sucesso.
-   A nova transação aparece na `TransactionsDataTable` imediatamente após a criação, sem a necessidade de recarregar a página.
-   O código segue os padrões de estilo e arquitetura já estabelecidos no projeto (Next.js, TypeScript, shadcn/ui, `react-hook-form`).
