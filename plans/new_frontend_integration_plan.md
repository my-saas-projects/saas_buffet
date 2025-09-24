# Plano de Integração do Novo Frontend

**Agente Responsável:** Agente Desenvolvedor Frontend

**Objetivo:** Integrar o novo frontend (Next.js) ao backend existente (Django), desativar o backend embutido do novo frontend (Prisma, Next.js API Routes) e remover a estrutura do frontend antigo (`old_frontend`).

---

## 1. Análise da Tecnologia do Novo Frontend

O novo frontend é uma aplicação moderna baseada em **Next.js 15** com as seguintes tecnologias principais:

- **Linguagem:** TypeScript 5
- **Framework:** Next.js 15 (com App Router)
- **Estilização:** Tailwind CSS 4 e shadcn/ui para componentes.
- **Gerenciamento de Estado e Dados:** TanStack Query e Zustand.
- **Formulários:** React Hook Form com Zod para validação.
- **Cliente HTTP:** Axios.
- **Backend Embutido (a ser desativado):**
  - **ORM:** Prisma
  - **Banco de Dados:** SQLite
  - **API:** Next.js API Routes (`/src/app/api/**`)
  - **Servidor Customizado:** `server.ts` com `socket.io` para WebSocket.

## 2. Plano de Execução

### Fase 1: Configuração do Ambiente

1.  **Instalar Dependências:**
    -   Navegar até o diretório `frontend/`.
    -   Executar o comando `npm install` para instalar todas as dependências listadas no `package.json`.

2.  **Analisar Variáveis de Ambiente:**
    -   Verificar a necessidade de um arquivo `.env.local` para configurar a URL da API do backend Django. O frontend antigo usava `REACT_APP_API_URL`. O novo frontend precisará de uma variável similar, como `NEXT_PUBLIC_API_URL`.

### Fase 2: Integração com o Backend Django

O objetivo principal é fazer o frontend Next.js se comunicar com a API Django, em vez de usar suas próprias rotas de API e banco de dados.

1.  **Configurar Cliente de API Centralizado:**
    -   Criar um arquivo `frontend/src/services/api.ts` (similar ao do `old_frontend`).
    -   Configurar o `axios` para usar a `NEXT_PUBLIC_API_URL` como `baseURL`.
    -   Implementar um interceptor do `axios` para adicionar o token de autenticação (`Authorization: Token <token>`) em todas as requisições, lendo o token do `localStorage`.

2.  **Adaptar a Autenticação (`useAuth` hook):**
    -   Modificar o hook `frontend/src/hooks/use-auth.ts`.
    -   A função `login` deve chamar o endpoint `POST /users/login/` do backend Django usando o novo serviço de API.
    -   Após o login bem-sucedido, o token recebido do Django deve ser salvo no `localStorage`.
    -   A função `checkAuth` deve verificar a validade do token, possivelmente fazendo uma chamada a um endpoint como `/users/profile/` no Django.
    -   Remover a lógica de `register` e outras chamadas que usam as API routes do Next.js e adaptá-las para os endpoints correspondentes do Django.

3.  **Refatorar Chamadas de API:**
    -   Mapear todas as API routes existentes em `frontend/src/app/api/**` para os endpoints equivalentes no backend Django.
        -   `GET /api/events` -> `GET /events/`
        -   `POST /api/events` -> `POST /events/`
        -   E assim por diante para `companies`, `users`, etc.
    -   Substituir as chamadas `fetch` para as API routes internas (ex: `fetch('/api/events')`) por chamadas usando o cliente `axios` configurado para a API Django (ex: `api.get('/events/')`).

### Fase 3: Limpeza e Desativação do Backend Embutido

1.  **Remover Código Desnecessário:**
    -   Excluir o diretório `frontend/src/app/api/`.
    -   Excluir o diretório `frontend/prisma/`.
    -   Remover as dependências de backend do `package.json`: `prisma`, `socket.io`, `socket.io-client`.
        -   **Ponto de Atenção:** A remoção do `socket.io` pressupõe que a funcionalidade de WebSocket vista em `examples/websocket/page.tsx` não é um requisito principal. Se for, a integração com o backend Django precisará de uma solução de WebSocket (como Django Channels), e o cliente no frontend deverá ser reconfigurado.

2.  **Simplificar o Servidor:**
    -   Remover o arquivo `frontend/server.ts`.
    -   Ajustar o script `dev` no `package.json` de `nodemon --exec "npx tsx server.ts" ...` para simplesmente `next dev`.
    -   Ajustar o script `start` de `NODE_ENV=production tsx server.ts ...` para `next start`.

### Fase 4: Remoção do Frontend Antigo

1.  **Verificar se há algo a ser salvo:**
    -   Analisar a pasta `old_frontend` para garantir que nenhum ativo ou lógica crítica foi esquecida.

2.  **Excluir o Diretório:**
    -   Após a verificação, executar o comando `rm -rf old_frontend` para remover permanentemente a pasta do projeto.

## 3. Verificação

-   Iniciar o novo frontend com `npm run dev`.
-   Testar o fluxo de autenticação (login/logout) contra o backend Django.
-   Verificar se a listagem e criação de eventos estão funcionando corretamente.
-   Navegar por todas as páginas para garantir que não há erros de console relacionados a chamadas de API.
