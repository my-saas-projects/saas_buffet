# Plano de Melhoria para a Página Financeira

**Agente Responsável:** Agente de Gerente de Projeto

## 1. Objetivo

Enriquecer a página "Financeiro" com novos indicadores e visualizações gráficas para fornecer ao proprietário do buffet uma análise mais profunda e acionável da saúde financeira do negócio. O foco é ir além do fluxo de caixa e oferecer insights sobre rentabilidade, fontes de receita e estrutura de custos.

## 2. Análise do Estado Atual

A página financeira atual (`frontend/src/app/financeiro/page.tsx`) oferece uma visão geral sólida, incluindo:
- **KPIs:** Receita Total, Despesa Total, Lucro Líquido e Contas a Receber.
- **Gráfico:** Um gráfico de fluxo de caixa (Receita vs. Despesa) ao longo do tempo.
- **Tabela:** Uma lista detalhada de todas as transações.
- **Ações:** Adição de novas transações.

Embora funcional, a página pode ser aprimorada para responder a perguntas de negócio mais específicas.

## 3. Melhorias Propostas

### 3.1. Novos Gráficos

#### a) Gráfico de Receita por Tipo de Evento
- **Descrição:** Um gráfico de pizza ou rosca que mostra a contribuição percentual de cada tipo de evento (ex: Casamento, Corporativo, Aniversário) para a receita total.
- **Valor para o Dono:** Ajuda a identificar quais tipos de eventos são mais lucrativos e onde focar os esforços de marketing e vendas.
- **Tipo:** Gráfico de Pizza/Rosca (Pie/Donut Chart).
- **Dados Necessários (Backend):** Um endpoint que retorne um array de objetos, como `[{ "event_type": "Casamento", "total_revenue": 50000 }, { "event_type": "Corporativo", "total_revenue": 30000 }]`.

#### b) Gráfico de Análise de Custos por Categoria
- **Descrição:** Um gráfico de barras ou pizza que detalha as despesas por categoria (ex: Fornecedores, Folha de Pagamento, Marketing, Aluguel, Impostos).
- **Valor para o Dono:** Permite uma visão clara de para onde o dinheiro está indo, ajudando a identificar oportunidades de otimização e redução de custos.
- **Tipo:** Gráfico de Barras ou Pizza.
- **Dados Necessários (Backend):** Um endpoint que retorne um array de objetos, como `[{ "category": "Fornecedores", "total_expense": 15000 }, { "category": "Folha de Pagamento", "total_expense": 20000 }]`.

#### c) Gráfico de Rentabilidade por Evento
- **Descrição:** Um gráfico de barras que exibe o lucro líquido para cada evento realizado em um determinado período. As barras podem ser coloridas para indicar margens de lucro (alta, média, baixa).
- **Valor para o Dono:** Essencial para entender quais eventos são financeiramente mais bem-sucedidos e quais podem estar sub-precificados ou com custos muito elevados.
- **Tipo:** Gráfico de Barras.
- **Dados Necessários (Backend):** Um endpoint que retorne os dados de receita e despesa por evento, como `[{ "event_name": "Casamento Silva & Souza", "revenue": 12000, "expense": 8000, "net_profit": 4000 }]`.

### 3.2. Novos KPIs (Indicadores Chave)

Adicionar os seguintes KPIs para uma visão mais granular:
- **Ticket Médio por Evento:** `Receita Total / Número de Eventos`.
- **Margem de Lucro Média:** `(Lucro Líquido Total / Receita Total) * 100`.
- **Custo Médio por Evento:** `Despesa Total / Número de Eventos`.

## 4. Plano de Execução (Tarefas)

### 4.1. Backend (Django)

1.  **Atualizar Modelos:**
    -   Garantir que o modelo `FinancialTransaction` tenha um campo `category` (categoria).
    -   Garantir que o modelo `Event` possa ser associado a transações de receita e despesa para calcular a rentabilidade por evento.

2.  **Criar Novos Endpoints na API `financials`:**
    -   `GET /api/financials/revenue-by-event-type/`: Endpoint para agregar a receita por tipo de evento.
    -   `GET /api/financials/expense-by-category/`: Endpoint para agregar as despesas por categoria.
    -   `GET /api/financials/profitability-by-event/`: Endpoint para calcular e retornar a receita, despesa e lucro por evento.
    -   Expandir o endpoint `GET /api/financials/dashboard/` para incluir os novos KPIs (Ticket Médio, Margem de Lucro, etc.).

### 4.2. Frontend (Next.js)

1.  **Criar Novos Componentes de Gráfico:**
    -   `components/charts/RevenueByEventTypeChart.tsx`: Componente para o gráfico de pizza/rosca.
    -   `components/charts/ExpenseByCategoryChart.tsx`: Componente para o gráfico de barras/pizza de despesas.
    -   `components/charts/ProfitabilityByEventChart.tsx`: Componente para o gráfico de barras de rentabilidade.
    -   Utilizar a biblioteca `recharts` ou similar, já presente no projeto.

2.  **Atualizar a Página `Financeiro`:**
    -   Adicionar os novos KPIs ao lado dos existentes.
    -   Integrar os novos componentes de gráfico na `page.tsx`, possivelmente em uma nova seção ou em abas para não sobrecarregar a UI.
    -   Criar uma nova aba "Análise de Rentabilidade" para os gráficos mais detalhados.

3.  **Atualizar o Serviço de API:**
    -   Adicionar as novas chamadas de API no `services/api/financials.ts` para consumir os novos endpoints do backend.

## 5. Métricas de Sucesso

-   O proprietário do buffet consegue, em menos de 1 minuto na página, identificar suas 3 principais fontes de receita e suas 3 maiores categorias de despesa.
-   O feedback do usuário indica que os novos gráficos fornecem insights valiosos que antes não eram facilmente acessíveis.
-   A página permite uma análise rápida da rentabilidade de eventos individuais, auxiliando na precificação de propostas futuras.
