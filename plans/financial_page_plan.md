# Plano de Implementação: Página Financeira

**Agente Responsável:** Agente Gerente de Projeto

## 1. Visão Geral

Este plano detalha a criação da nova seção "Financeiro" na plataforma BuffetFlow. O objetivo é fornecer uma visão clara e abrangente da saúde financeira da empresa, com dashboards interativos, relatórios e integração direta com outras áreas do sistema, como Eventos. A página seguirá o padrão de design e funcionalidade já estabelecido nas seções de Clientes e Eventos.

---

## 2. Fase 1: Desenvolvimento do Backend (API)

O backend precisará fornecer os dados para a nova página. Isso envolve a criação de novos modelos, serializers e endpoints.

### 2.1. Modelos (financials/models.py)

Criar um novo modelo `FinancialTransaction` para registrar todas as transações financeiras.

```python
from django.db import models
from events.models import Event

class FinancialTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('INCOME', 'Entrada'),
        ('EXPENSE', 'Saída'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pendente'),
        ('COMPLETED', 'Concluído'),
        ('CANCELED', 'Cancelado'),
    ]

    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPE_CHOICES)
    transaction_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    related_event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='financials')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - {self.get_transaction_type_display()}"
```

### 2.2. Serializers (financials/serializers.py)

Criar um serializer para o modelo `FinancialTransaction`.

```python
from rest_framework import serializers
from .models import FinancialTransaction

class FinancialTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialTransaction
        fields = '__all__'
```

### 2.3. Views (financials/views.py)

- Criar uma `ViewSet` padrão para o CRUD de `FinancialTransaction`.
- Criar uma View customizada (`APIView`) para o dashboard, que retornará dados agregados.

```python
# financials/views.py
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import FinancialTransaction
from .serializers import FinancialTransactionSerializer
import datetime

class FinancialTransactionViewSet(viewsets.ModelViewSet):
    queryset = FinancialTransaction.objects.all()
    serializer_class = FinancialTransactionSerializer

class FinancialDashboardView(APIView):
    def get(self, request):
        # Métricas Principais
        total_income = FinancialTransaction.objects.filter(transaction_type='INCOME', status='COMPLETED').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = FinancialTransaction.objects.filter(transaction_type='EXPENSE', status='COMPLETED').aggregate(total=Sum('amount'))['total'] or 0
        accounts_receivable = FinancialTransaction.objects.filter(transaction_type='INCOME', status='PENDING').aggregate(total=Sum('amount'))['total'] or 0

        # Dados para o gráfico de fluxo de caixa (últimos 12 meses)
        cash_flow_data = []
        today = datetime.date.today()
        for i in range(12, 0, -1):
            month_date = today - datetime.timedelta(days=(i * 30))
            month = month_date.strftime("%Y-%m")
            
            income = FinancialTransaction.objects.filter(transaction_type='INCOME', status='COMPLETED', transaction_date__year=month_date.year, transaction_date__month=month_date.month).aggregate(total=Sum('amount'))['total'] or 0
            expense = FinancialTransaction.objects.filter(transaction_type='EXPENSE', status='COMPLETED', transaction_date__year=month_date.year, transaction_date__month=month_date.month).aggregate(total=Sum('amount'))['total'] or 0
            
            cash_flow_data.append({"month": month, "income": income, "expense": expense})

        response_data = {
            "kpis": {
                "total_income": total_income,
                "total_expense": total_expense,
                "net_profit": total_income - total_expense,
                "accounts_receivable": accounts_receivable,
            },
            "cash_flow_chart": cash_flow_data,
        }
        return Response(response_data)
```

### 2.4. URLs (financials/urls.py e buffetflow/urls.py)

Registrar as novas rotas da API.

---

## 3. Fase 2: Desenvolvimento do Frontend (UI)

Criar a interface do usuário no Next.js, utilizando os componentes `shadcn/ui` e seguindo a identidade visual do projeto.

### 3.1. Estrutura de Arquivos

```
frontend/
└── src/
    ├── app/
    │   └── financeiro/
    │       └── page.tsx
    └── components/
        └── financials/
            ├── kpi-card.tsx
            ├── cash-flow-chart.tsx
            ├── transactions-data-table.tsx
            └── columns.tsx
```

### 3.2. Página Principal (`financeiro/page.tsx`)

Esta página irá orquestrar a exibição dos componentes do dashboard.

- Fará a chamada à API (`/api/financials/dashboard/` e `/api/financials/transactions/`).
- Exibirá os cards de KPIs.
- Renderizará o gráfico de fluxo de caixa.
- Renderizará a tabela de transações.

### 3.3. Componentes

- **`kpi-card.tsx`**: Um card reutilizável para exibir métricas chave (Ex: "Receita Total", "Lucro Líquido").
- **`cash-flow-chart.tsx`**: Um gráfico de barras (usando `recharts`) para visualizar as entradas e saídas mensais. Será similar ao `MonthlyRevenueBarChart.tsx` já existente.
- **`transactions-data-table.tsx`**: Uma tabela de dados (similar a `client-data-table.tsx`) para listar as transações recentes. Incluirá paginação, ordenação e filtros (por data, tipo e status).
- **`columns.tsx`**: Definição das colunas para a tabela de transações, incluindo ações como "Marcar como Concluído".

---

## 4. Fase 3: Integração e Fluxo de Trabalho

Conectar o backend e o frontend para criar um fluxo de trabalho coeso.

### 4.1. Integração com Eventos

- **Gatilho no Backend**: Modificar a `EventViewSet` (em `events/views.py`). Quando um evento for atualizado para um status que indique pagamento (ex: "Pago" ou "Concluído"), o sistema deverá:
    1. Verificar se já existe uma transação financeira para este evento.
    2. Se não existir, criar uma nova `FinancialTransaction` do tipo `INCOME`, com o valor do evento (`Event.value`), a data do pagamento e o status `COMPLETED`.
    3. Se já existir e estiver `PENDING`, atualizá-la para `COMPLETED`.

- **Visualização no Frontend**:
    - A tabela de transações na página Financeiro terá uma coluna "Evento Associado" com um link para a página de detalhes do evento.
    - Na página de detalhes de um Evento, exibir um status financeiro ("Aguardando Pagamento", "Pago").

### 4.2. Ações na Tabela Financeira

- A tabela de transações permitirá ações rápidas, como:
    - Para transações `PENDING`, um botão para "Marcar como Concluído".
    - Um botão para "Cancelar" a transação.
    - Um menu para "Editar" ou "Excluir" a transação.

---

## 5. Cronograma Proposto

- **Semana 1**: Desenvolvimento do Backend (Fase 1).
- **Semana 2**: Desenvolvimento do Frontend (Fase 2).
- **Semana 3**: Integração, testes e refinamentos (Fase 3).

Este plano fornece uma base sólida para a implementação da funcionalidade Financeira, garantindo que ela seja robusta, útil e bem integrada ao restante do sistema.
