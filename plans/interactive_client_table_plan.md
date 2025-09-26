# Plano de Melhoria para a Página de Clientes

**Agente Responsável:** Agente Gerente de Projeto
**Agente Executor:** Agente Desenvolvedor Frontend

## 1. Objetivo

Transformar a atual lista de clientes em uma tabela de dados interativa, responsiva e rica em funcionalidades, melhorando a usabilidade e a eficiência na gestão de clientes. A nova tabela será construída utilizando os componentes do `shadcn/ui` e a biblioteca `TanStack Table` para fornecer uma experiência de usuário moderna e fluida.

## 2. Requisitos da Funcionalidade

A nova tabela de clientes deverá incluir as seguintes funcionalidades:

- **Visualização em Tabela:** Exibir os clientes em um formato de tabela claro e organizado.
- **Paginação:** Permitir que o usuário navegue entre as páginas de resultados.
- **Busca e Filtragem:** Um campo de busca para filtrar clientes por nome, e-mail ou outro campo relevante.
- **Ordenação:** Capacidade de ordenar os dados clicando nos cabeçalhos das colunas (ex: ordenar por nome em ordem alfabética).
- **Menu de Ações:** Cada linha da tabela terá um menu de ações (dropdown) com opções como "Ver Detalhes", "Editar" e "Excluir".
- **Responsividade:** A tabela deve se adaptar a diferentes tamanhos de tela, ocultando colunas menos importantes em dispositivos móveis para manter a legibilidade.
- **Feedback de Carregamento e Erro:** Exibir indicadores de carregamento (loading spinners) enquanto os dados são buscados e mensagens claras em caso de erro ou quando não houver clientes cadastrados.

## 3. Componentes e Tecnologias

- **Framework:** Next.js / React
- **UI Components:** `shadcn/ui` (Table, DropdownMenu, Button, Input)
- **Lógica da Tabela:** `@tanstack/react-table`
- **Busca de Dados:** `SWR` ou `React Query` (se já estiver em uso) ou `fetch` API nativa.

## 4. Plano de Implementação (Passo a Passo)

1.  **Análise do Código Existente:**
    -   Revisar `frontend/src/app/clients/page.tsx` e `frontend/src/components/clients/clients-list.tsx` para entender a estrutura atual.

2.  **Instalação de Dependências:**
    -   Verificar se `@tanstack/react-table` está instalado. Se não, adicioná-lo ao projeto: `npm install @tanstack/react-table`.

3.  **Criação da Estrutura da Tabela:**
    -   Criar um novo componente: `frontend/src/components/clients/client-data-table.tsx`.
    -   Criar um arquivo para definir as colunas: `frontend/src/components/clients/columns.tsx`.
        -   Definir as colunas: "Nome", "Email", "Telefone", "Tipo" (Pessoa Física/Jurídica).
        -   Adicionar uma coluna de "Ações" que renderiza um `DropdownMenu` com as opções necessárias.

4.  **Implementação da Lógica da Tabela:**
    -   No componente `client-data-table.tsx`:
        -   Implementar a busca de dados da API (`/api/clients/`).
        -   Utilizar o hook `useReactTable` para instanciar a tabela, passando as colunas e os dados.
        -   Implementar os estados para ordenação, filtragem e paginação.

5.  **Integração dos Componentes `shadcn/ui`:**
    -   Construir a estrutura visual da tabela usando `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableHead>`, `<TableBody>`, e `<TableCell>`.
    -   Adicionar o componente `<Input>` para a funcionalidade de filtro.
    -   Adicionar os componentes `<Button>` para o controle da paginação.

6.  **Integração na Página Principal:**
    -   Substituir o conteúdo atual de `frontend/src/app/clients/page.tsx` ou `clients-list.tsx` pelo novo componente `client-data-table.tsx`.

7.  **Implementação da Responsividade:**
    -   Utilizar classes utilitárias do Tailwind CSS (ex: `hidden md:table-cell`) para ocultar/exibir colunas em diferentes breakpoints.

8.  **Testes e Refinamento:**
    -   Testar todas as funcionalidades: busca, ordenação, paginação e menu de ações.
    -   Verificar a responsividade em diferentes dispositivos.
    -   Garantir que os estados de carregamento e erro estão funcionando como esperado.
