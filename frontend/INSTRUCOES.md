# BuffetFlow - Sistema de Gestão para Buffets de Festas

## 🚀 Como Testar o Sistema

### 1. Acessar o Sistema
O sistema está rodando em: `http://localhost:3000`

### 2. Páginas Disponíveis

#### Página Principal (Landing)
- **URL:** `http://localhost:3000`
- **Descrição:** Página inicial com informações do sistema

#### Autenticação Simplificada (Recomendado para testes)
- **URL:** `http://localhost:3000/simple-auth`
- **Descrição:** Página de login simplificada para testes
- **Credenciais:** `demo@buffetflow.com` / `demo123`

#### Autenticação Completa
- **URL:** `http://localhost:3000/auth`
- **Descrição:** Página completa de login/registro
- **Credenciais Demo:** `demo@buffetflow.com` / `demo123`

#### Onboarding
- **URL:** `http://localhost:3000/onboarding`
- **Descrição:** Configuração inicial do sistema (3 passos)

#### Dashboard
- **URL:** `http://localhost:3000`
- **Descrição:** Painel principal após login

#### Gerenciamento de Eventos
- **URL:** `http://localhost:3000/events`
- **Descrição:** Página completa para gerenciar eventos

### 3. Fluxo de Uso Recomendado

1. **Acessar a página de login simplificada:**
   ```
   http://localhost:3000/simple-auth
   ```

2. **Fazer login com credenciais demo:**
   - Email: `demo@buffetflow.com`
   - Senha: `demo123`

3. **Será redirecionado para o onboarding:**
   - Complete os 3 passos de configuração

4. **Acessar o dashboard:**
   - Visualize as estatísticas
   - Veja os eventos de exemplo

5. **Gerenciar eventos:**
   - Acesse `http://localhost:3000/events`
   - Crie novos eventos
   - Visualize detalhes

### 4. Funcionalidades Disponíveis

✅ **Dashboard Principal**
- Estatísticas da empresa
- Próximos eventos
- Alertas e notificações

✅ **Autenticação**
- Login e registro
- Sessão persistente
- Redirecionamento automático

✅ **Onboarding**
- Configuração da empresa
- Configurações operacionais
- Cardápio básico

✅ **Gerenciamento de Eventos**
- Cadastro de eventos
- Lista com filtros
- Detalhamento de eventos

### 5. Depuração

#### Verificar Console do Navegador
1. Abra o navegador (Chrome/Firefox)
2. Pressione F12 para abrir DevTools
3. Vá para a aba "Console"
4. Faça login e observe as mensagens

#### Verificar Console do Servidor
1. Verifique o terminal onde o Next.js está rodando
2. Procure por mensagens de login como:
   ```
   Login request received: { email: 'demo@buffetflow.com', password: '***' }
   User found: YES
   ```

### 6. Solução de Problemas

#### Problema: Login não funciona
1. Verifique se está usando as credenciais corretas
2. Verifique o console do navegador por erros
3. Tente a página simplificada: `/simple-auth`

#### Problema: Redirecionamento não funciona
1. Verifique se o toast de sucesso aparece
2. Aguarde 500ms (tempo de redirecionamento)
3. Verifique o console por mensagens de erro

#### Problema: Página não carrega
1. Verifique se o servidor está rodando na porta 3000
2. Tente atualizar a página (F5)
3. Limpe o cache do navegador

### 7. Estrutura do Sistema

#### Backend (APIs)
- `/api/auth/login` - Autenticação
- `/api/auth/register` - Registro
- `/api/auth/me` - Dados do usuário
- `/api/companies` - Gestão de empresas
- `/api/events` - CRUD de eventos
- `/api/test` - Teste de conexão

#### Frontend (Páginas)
- `/` - Dashboard
- `/auth` - Login/Registro
- `/simple-auth` - Login simplificado
- `/onboarding` - Configuração inicial
- `/events` - Gerenciamento de eventos

### 8. Tecnologias Utilizadas

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Prisma ORM, SQLite
- **Banco de Dados:** SQLite
- **Estado:** React hooks, localStorage

---

**Desenvolvido como MVP para BuffetFlow**