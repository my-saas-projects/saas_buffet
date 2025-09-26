# Plano de Melhoria para as Tabelas de Clientes e Eventos

O objetivo deste plano é aprimorar as páginas de Clientes e Eventos, focando na melhoria e padronização de suas tabelas de dados para fornecer uma experiência de usuário mais consistente e informativa.

## Agente Responsável

- **Agente:** Agente Desenvolvedor Frontend
- **Justificativa:** A tarefa envolve modificações na interface do usuário (UI) e componentes React no frontend do Next.js.

## Requisitos

### Tabela de Clientes (`/clients`)

A tabela de clientes deve exibir as seguintes colunas:
1.  **Nome:** Nome completo do cliente.
2.  **Tipo:** Pessoa Física (PF) ou Pessoa Jurídica (PJ).
3.  **Telefone:** Número de contato.
4.  **Email:** Endereço de e-mail.
5.  **Ações:** Botões para editar ou excluir o cliente.

### Tabela de Eventos (`/events`)

A tabela de eventos deve ser redesenhada para ser visualmente consistente com a tabela de clientes e exibir as seguintes colunas:
1.  **Tipo do Evento:** Categoria do evento (ex: Casamento, Corporativo).
2.  **Título do Evento:** Nome ou título do evento.
3.  **Data e Horário:** Data e hora de início do evento.
4.  **Cliente:** Nome do cliente associado ao evento.
5.  **Nº de Convidados:** Quantidade de pessoas esperadas.
6.  **Local:** Onde o evento será realizado.
7.  **Status:** O status atual do evento (ex: Proposta, Confirmado, Cancelado).
8.  **Ações:** Botões para visualizar, editar ou excluir o evento.

## Plano de Execução

### Passo 1: Análise dos Componentes Atuais

- **Analisar `frontend/src/components/clients/columns.tsx`:** Entender a estrutura atual das colunas da tabela de clientes.
- **Analisar `frontend/src/components/events/event-columns.tsx`:** Entender a estrutura atual das colunas da tabela de eventos.
- **Analisar `frontend/src/components/clients/client-data-table.tsx` e `frontend/src/components/events/event-data-table.tsx`:** Comparar os componentes de tabela para identificar as diferenças de estilo e estrutura.
- **Analisar `backend/clients/serializers.py` e `backend/events/serializers.py`:** Verificar os campos disponíveis nos serializers para garantir que os dados necessários estão sendo expostos pela API.

### Passo 2: Atualizar Colunas da Tabela de Clientes

- Modificar o arquivo `frontend/src/components/clients/columns.tsx`.
- Ajustar as definições de `column` para corresponder aos novos requisitos: `Nome`, `Tipo`, `Telefone`, `Email` e `Ações`.
- Garantir que os `accessorKey` ou funções de célula correspondam aos campos corretos do objeto `Client`.

### Passo 3: Atualizar Colunas da Tabela de Eventos

- Modificar o arquivo `frontend/src/components/events/event-columns.tsx`.
- Ajustar as definições de `column` para corresponder aos novos requisitos: `Tipo do Evento`, `Título do Evento`, `Data e Horário`, `Cliente`, `Nº de Convidados`, `Local`, `Status` e `Ações`.
- Prestar atenção especial à coluna `Cliente`, que pode exigir a exibição de um campo de um objeto aninhado (ex: `event.client.name`).
- Formatar a coluna `Data e Horário` para um formato legível.

### Passo 4: Padronizar o Design da Tabela de Eventos

- Editar o arquivo `frontend/src/components/events/event-data-table.tsx`.
- Replicar a estrutura, os componentes `shadcn/ui` e as props utilizadas em `frontend/src/components/clients/client-data-table.tsx`.
- Isso inclui a barra de ferramentas de filtro, paginação e o estilo geral da tabela para garantir consistência visual.

### Passo 5: Verificação

- Após a implementação, executar o servidor de desenvolvimento do frontend (`npm run dev`).
- Navegar para as páginas de Clientes e Eventos para verificar se as tabelas são renderizadas corretamente com as novas colunas e o novo design.
- Testar as funcionalidades de ordenação, filtragem e paginação.