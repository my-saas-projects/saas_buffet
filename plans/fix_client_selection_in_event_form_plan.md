# Plano para Correção e Melhoria do Formulário de Eventos

**Agente Responsável:** Agente Desenvolvedor Frontend

**Objetivo:** Corrigir o bug que impede a seleção de um cliente existente e substituir a navegação para uma nova aba por um modal ao adicionar um novo cliente no formulário de criação de evento.

---

## Arquivos a Serem Modificados

1.  `frontend/src/components/events/event-form.tsx`: Principal arquivo do formulário de evento, onde a lógica de seleção de cliente e o botão de adicionar novo cliente estão localizados.
2.  `frontend/src/components/clients/client-form.tsx`: Formulário de criação de cliente, que será adaptado para funcionar dentro de um modal e comunicar a criação bem-sucedida.

---

## Plano de Execução

### Parte 1: Correção do Bug na Seleção de Cliente

1.  **Análise do Componente:**
    *   Investigar o componente de seleção de clientes em `event-form.tsx` (provavelmente um `ComboBox` ou `Select` de `shadcn/ui`).
    *   Verificar como o valor do cliente selecionado está sendo capturado e atribuído ao estado do formulário (ex: `react-hook-form`).

2.  **Implementação da Correção:**
    *   Ajustar o manipulador de eventos (`onSelect` ou `onChange`) do componente para garantir que o `ID` do cliente seja corretamente registrado no estado do formulário.
    *   Garantir que, ao selecionar um cliente, seu nome seja exibido corretamente no campo.

### Parte 2: Substituir Abertura de Aba por Modal

1.  **Integração do Componente `Dialog`:**
    *   Em `event-form.tsx`, importar os componentes `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle` e `DialogFooter` de `@/components/ui/dialog`.
    *   Envolver o botão de ícone `+` com o componente `<DialogTrigger>`.
    *   Estruturar o conteúdo do modal dentro de `<DialogContent>`, colocando o `<ClientForm />` dentro dele.

2.  **Adaptação do Formulário de Cliente (`client-form.tsx`):**
    *   Modificar o componente `ClientForm` para aceitar uma nova propriedade, como `onSuccess: (client) => void`.
    *   Após o cliente ser criado com sucesso pela API, em vez de redirecionar, o formulário chamará a função `onSuccess`, passando os dados do cliente recém-criado.
    *   Adicionar um botão para fechar o modal, que pode ser o próprio botão "Criar Cliente" ou um botão "Cancelar".

3.  **Comunicação entre Modal e Formulário Principal:**
    *   Em `event-form.tsx`, ao renderizar o `ClientForm` dentro do modal, passar uma função para a propriedade `onSuccess`.
    *   Essa função receberá o novo cliente, fechará o modal e atualizará o estado do formulário de evento, selecionando automaticamente o cliente recém-criado no campo de seleção.
    *   Será necessário também atualizar a lista de clientes disponíveis no `ComboBox` para incluir o novo cliente sem a necessidade de recarregar a página.

---

## Resultado Esperado

-   Ao selecionar um cliente na lista, o campo será preenchido corretamente.
-   Ao clicar no botão `+`, um modal se abrirá contendo o formulário de criação de cliente.
-   Após criar um novo cliente no modal, o modal será fechado e o novo cliente será automaticamente selecionado no formulário de evento.
