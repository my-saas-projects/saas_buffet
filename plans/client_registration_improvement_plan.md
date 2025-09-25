# Plano de Melhoria do Cadastro de Cliente e Correção de Bug

Este plano detalha as etapas necessárias para aprimorar o formulário de cadastro de clientes, adicionando distinção entre pessoa física e jurídica, e para corrigir um bug existente na página de detalhes do cliente.

**Agentes de IA Responsáveis:**
- **Agente Desenvolvedor Backend:** Para modificações no modelo de dados e na API.
- **Agente Desenvolvedor Frontend:** Para alterações na interface do usuário e correção do bug no Next.js.

---

## 1. Backend (Agente Desenvolvedor Backend)

### 1.1. Modificar o Modelo `Client`

**Arquivo:** `backend/clients/models.py`

- Adicionar um campo `client_type` para diferenciar "Pessoa Física" de "Pessoa Jurídica".
- Adicionar os campos específicos para cada tipo, definindo os campos obrigatórios e opcionais.

**Campos a serem adicionados:**
- `client_type`: `CharField` com escolhas ('FISICA', 'JURIDICA').
- **Pessoa Física:**
    - `full_name`: `CharField` (obrigatório se `client_type` for 'FISICA').
    - `rg`: `CharField` (opcional).
    - `cpf`: `CharField` (opcional).
- **Pessoa Jurídica:**
    - `fantasy_name`: `CharField` (obrigatório se `client_type` for 'JURIDICA').
    - `corporate_name`: `CharField` (opcional).
    - `cnpj`: `CharField` (opcional).
    - `state_registration`: `CharField` (opcional).
- **Campos Comuns (revisar se já existem ou precisam ser adicionados/ajustados):**
    - `address`: `CharField` (opcional).
    - `zip_code`: `CharField` (opcional).
    - `email`: `EmailField` (opcional).

### 1.2. Atualizar o Serializer

**Arquivo:** `backend/clients/serializers.py`

- Incluir todos os novos campos no `ClientSerializer`.
- Garantir que a validação reflita a obrigatoriedade condicional de `full_name` e `fantasy_name`.

### 1.3. Gerar Migração no Banco de Dados

- Executar o comando `docker-compose exec web python manage.py makemigrations clients` para criar o arquivo de migração com as alterações do modelo.

---

## 2. Frontend (Agente Desenvolvedor Frontend)

### 2.1. Aprimorar o Formulário de Cliente

**Arquivo:** `frontend/src/components/clients/client-form.tsx`

- Adicionar um componente de seleção (Radio Group ou Select) para o campo `client_type` ("Pessoa Física" / "Pessoa Jurídica").
- Implementar a renderização condicional dos campos com base no `client_type` selecionado.
- Adicionar os novos campos de input para cada tipo de pessoa.
- Atualizar a lógica de submissão do formulário para enviar os dados corretos à API.
- Ajustar a validação do formulário (provavelmente com Zod) para garantir que `full_name` ou `fantasy_name` sejam preenchidos conforme o tipo de cliente.

### 2.2. Atualizar Tipos da API

**Arquivo:** `frontend/src/services/api.ts` (ou onde os tipos de cliente estiverem definidos)

- Adicionar os novos campos à interface ou tipo que representa o cliente para garantir a consistência de tipos em todo o frontend.

### 2.3. Corrigir Bug na Página de Detalhes do Cliente

**Arquivo:** `frontend/src/app/clients/[id]/page.tsx`

- **Problema:** O erro `A param property was accessed directly with params.id` indica que `params` é uma Promise e precisa ser resolvida antes de acessar `id`.
- **Solução:** Utilizar `React.use()` para extrair o valor de `params` de forma síncrona no componente, conforme recomendado pela mensagem de erro do Next.js.

**Exemplo da correção:**
```typescript
// Antes (com erro)
// const { id } = params;

// Depois (corrigido)
import { use } from 'react';

// ... dentro do componente
const resolvedParams = use(params);
const { id } = resolvedParams;
```
A implementação exata dependerá da estrutura do código existente, que será analisada antes da aplicação da correção.

---

## 3. Passos de Verificação

1.  Após as alterações no backend, executar as migrações com `docker-compose exec web python manage.py migrate`.
2.  Testar a API manualmente (via Insomnia/Postman) para garantir que os novos campos são aceitos e validados corretamente.
3.  No frontend, verificar se o formulário de criação/edição de cliente exibe os campos corretos dinamicamente.
4.  Testar a criação e edição de um cliente "Pessoa Física" e um "Pessoa Jurídica".
5.  Verificar se a página de detalhes do cliente (`/clients/[id]`) carrega sem o erro no console do navegador.
