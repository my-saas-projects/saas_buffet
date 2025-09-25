# Plano de Melhoria do Fluxo de Status de Eventos

Este plano detalha as etapas necessárias para corrigir e padronizar o sistema de status de eventos em toda a plataforma BuffetFlow, abordando tanto o backend quanto o frontend.

O agente de IA mais adequado para supervisionar e coordenar esta tarefa é o **Agente Gerente de Projeto**, pois envolve planejamento, definição de requisitos e coordenação entre as diferentes partes do sistema (backend, frontend, API).

## 1. Objetivo

O objetivo principal é refinar o ciclo de vida de um evento, introduzindo um fluxo de status mais granular e corrigindo a exibição incorreta do status 'draft' na interface do usuário.

## 2. Novo Fluxo de Status

O campo `status` no modelo de Evento será atualizado para seguir o seguinte fluxo:

1.  **Proposta Pendente** (Default na criação)
2.  **Proposta Enviada**
    -   Neste status, um campo `data_validade_proposta` (data de validade) será obrigatório.
3.  **Proposta Recusada**
    -   A partir daqui, o evento pode ser movido para 'Proposta Enviada' (para uma nova tentativa) ou 'Concluído'.
4.  **Proposta Aceita**
5.  **Evento em Execução**
6.  **Pós Evento** (Fase de coleta de feedback)
7.  **Evento Concluído**

## 3. Plano de Execução

### Backend (Django)

1.  **Atualizar o Modelo `Event` (`backend/events/models.py`):**
    *   Modificar o campo `status` para usar `CharField` com um `choices` contendo os novos status definidos acima.
    *   Definir `default='PROPOSTA_PENDENTE'`.
    *   Adicionar um novo campo `proposal_validity_date = models.DateField(null=True, blank=True)` para armazenar a data de validade da proposta.

2.  **Criar e Aplicar Migrações:**
    *   Executar `python manage.py makemigrations events`.
    *   Executar `python manage.py migrate`.

3.  **Atualizar o Serializer (`backend/events/serializers.py`):**
    *   Garantir que o `EventSerializer` exponha o campo `status` com as novas opções e o novo campo `proposal_validity_date`.

4.  **Atualizar a View (`backend/events/views.py`):**
    *   Na criação de um novo evento (`POST /api/events/`), garantir que o status padrão seja 'Proposta Pendente' se nenhum outro for fornecido.
    *   Adicionar lógica para validar que `proposal_validity_date` seja fornecido quando o status for alterado para 'Proposta Enviada'.

### Frontend (Next.js)

1.  **Atualizar Tipos e Constantes:**
    *   Definir os novos status em um arquivo de constantes ou enum para ser usado em todo o frontend.
    *   Atualizar a interface/tipo `Event` para incluir `status` com os novos valores literais e o campo opcional `proposal_validity_date`.

2.  **Componente de Formulário de Evento (`frontend/src/components/events/event-form.tsx`):**
    *   Substituir o campo de texto do status por um componente `<Select>` (shadcn/ui) com os novos status.
    *   Definir o valor padrão do select para 'Proposta Pendente' ao criar um novo evento.
    *   Implementar a lógica para exibir e exigir o campo de data `proposal_validity_date` somente quando o status 'Proposta Enviada' for selecionado.

3.  **Componente de Lista de Eventos (`frontend/src/components/events/events-list.tsx`):**
    *   Garantir que o `Card` de cada evento exiba corretamente o novo valor do status.
    *   Considerar o uso de `Badge` (shadcn/ui) com cores diferentes para cada status para melhorar a visualização.

4.  **Página de Detalhes do Evento:**
    *   Localizar o arquivo responsável pelos detalhes do evento (provavelmente em `frontend/src/app/events/[id]/page.tsx` ou similar).
    *   Atualizar a exibição para mostrar o status formatado e a `data_validade_proposta` (se aplicável).
    *   Implementar a lógica de transição de status (ex: botões para 'Aceitar Proposta', 'Recusar Proposta', etc.).

### API (Coordenação)

*   O **Agente Especialista em API** deve garantir que os endpoints `POST /api/events/` e `PATCH /api/events/{id}/` estejam alinhados com as mudanças, aceitando e retornando os novos valores de status e o campo `proposal_validity_date`. A documentação da API em `docs/API_CONVENTIONS.md` deve ser atualizada para refletir essas mudanças.
