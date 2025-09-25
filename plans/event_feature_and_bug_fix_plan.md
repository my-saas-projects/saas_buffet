# Plano de Melhorias e Correções para Eventos

**Agente Responsável:** Agente Gerente de Projeto

**Objetivo:** Detalhar as etapas necessárias para implementar novas funcionalidades e corrigir bugs críticos na seção de Eventos da plataforma BuffetFlow.

---

## 1. Backend (Django)

### 1.1. Modificação do Modelo `Event`

O modelo de dados de eventos precisa ser ajustado para acomodar os novos requisitos.

- **Arquivo:** `backend/events/models.py`
- **Tarefa 1: Tornar o campo de localização opcional.**
  - Localizar o campo que armazena o endereço do evento (ex: `location` ou `local`).
  - Adicionar os atributos `null=True` e `blank=True` para permitir que o campo seja nulo no banco de dados e vazio em formulários.
- **Tarefa 2: Adicionar o campo de valor do evento.**
  - Adicionar um novo campo `value` do tipo `DecimalField`.
  - Configurar o campo com `max_digits=10`, `decimal_places=2`, `null=True`, e `blank=True` para torná-lo opcional.

### 1.2. Geração e Aplicação de Migrações

Após a alteração do modelo, é necessário refletir as mudanças no banco de dados.

- **Comandos:**
  ```bash
  # Ativar o ambiente virtual
  source backend/venv_saas_buffet/bin/activate
  
  # Gerar o arquivo de migração
  python backend/manage.py makemigrations events
  
  # Aplicar a migração ao banco de dados
  python backend/manage.py migrate events
  ```

### 1.3. Atualização do Serializer

O serializer da API precisa ser atualizado para incluir o novo campo `value`.

- **Arquivo:** `backend/events/serializers.py`
- **Tarefa:**
  - Localizar o `EventSerializer`.
  - Adicionar `'value'` à lista de campos (`fields`) para que ele seja exposto na API.

---

## 2. Frontend (Next.js)

### 2.1. Ajustes no Formulário de Evento

O formulário de criação e edição de eventos deve ser atualizado para refletir as mudanças do backend.

- **Arquivo:** `frontend/src/components/events/event-form.tsx`
- **Tarefa 1: Remover a obrigatoriedade do campo de localização.**
  - Revisar a validação do formulário (provavelmente usando Zod ou uma biblioteca similar) e remover a regra que exige o preenchimento do campo de endereço.
- **Tarefa 2: Adicionar o campo "Valor do Evento".**
  - Adicionar um novo campo de `Input` no formulário para o `value`.
  - O campo deve ser do tipo `number` e formatado para aceitar valores monetários.
  - A validação deve tratar o campo como opcional.

### 2.2. Correção dos Botões de Edição

Os botões de "Editar Evento" precisam ter sua funcionalidade restaurada.

- **Arquivos a investigar:**
  - `frontend/src/components/events/events-list.tsx` (para a lista de eventos)
  - Um componente de detalhes do evento (a ser localizado, ex: `frontend/src/app/events/[id]/page.tsx`)
- **Tarefa:**
  - **Diagnóstico:** Verificar o manipulador de eventos `onClick` dos botões de edição. O problema pode ser um link de navegação quebrado, uma chamada de função incorreta ou um estado que não está sendo gerenciado corretamente.
  - **Implementação:** Corrigir a lógica para garantir que, ao clicar em "Editar", o usuário seja redirecionado para o formulário de edição com os dados do evento selecionado preenchidos.

---

## 3. Verificação e Validação

Após a conclusão das etapas de backend e frontend, será necessário realizar testes manuais para garantir que:
1.  É possível criar um evento sem preencher a localização e o valor.
2.  É possível adicionar/editar a localização e o valor de um evento existente.
3.  Os botões de "Editar Evento" na lista e na tela de detalhes funcionam corretamente, abrindo o formulário de edição.
