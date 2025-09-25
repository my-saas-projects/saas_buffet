# BuffetFlow - Sistema de Gestão para Buffets

Sistema completo para gestão de buffets de festas, desenvolvido com Django REST Framework e React TypeScript.

## 🚀 Como Inicializar o Sistema com Docker

O BuffetFlow é totalmente containerizado, simplificando a configuração e execução do ambiente de desenvolvimento.

### Pré-requisitos

-   Docker e Docker Compose
-   Git
-   Node.js 16+ (para o frontend)

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd saas_buffet
```

### 2. Iniciar o Ambiente de Desenvolvimento

Com o Docker instalado, inicie todos os serviços (Backend, Banco de Dados e Redis) com um único comando:

```bash
docker-compose up --build
```

Após a execução, os seguintes serviços estarão disponíveis:
-   **Backend (API):** `http://localhost:8000`
-   **Banco de Dados (PostgreSQL):** `localhost:5432`
-   **Redis:** `localhost:6379`

### 3. Comandos Comuns do Backend

Para executar comandos `manage.py`, como migrações e criação de superusuário, utilize `docker-compose exec`:

```bash
# Para executar migrações do banco de dados:
docker-compose exec web python manage.py migrate

# Para criar um superusuário (acesso ao Admin):
docker-compose exec web python manage.py createsuperuser
```

### 4. Iniciar o Frontend

O frontend é executado localmente e se conecta ao backend containerizado.

#### 4.1. Navegar para o Diretório

Em um **novo terminal**, a partir da raiz do projeto:
```bash
cd frontend
```

#### 4.2. Instalar Dependências

```bash
npm install
```

#### 4.3. Iniciar o Servidor

```bash
npm run dev
```

O frontend estará acessível em `http://localhost:3000`.

## 📋 Funcionalidades Implementadas

### ✅ Fase 0 - Configuração do Projeto
- [x] Projeto Django com Docker
- [x] Ambiente virtual configurado
- [x] Banco de dados PostgreSQL
- [x] Apps estruturados (users, events, financials)
- [x] Frontend React TypeScript
- [x] Comunicação API configurada

### ✅ Fase 1 - MVP (Produto Mínimo Viável)

#### Sprint 1: Gestão de Usuários e Empresas
- [x] Sistema de autenticação (login/registro)
- [x] Gestão de perfis de usuário
- [x] Cadastro e edição de empresas
- [x] Sistema de roles (owner, manager, staff)

#### Sprint 2: Gestão de Eventos
- [x] CRUD completo de eventos
- [x] Verificação de conflitos de agenda
- [x] Calendar view (agenda visual)
- [x] Filtros e busca de eventos

#### Sprint 3: Cardápio e Custos Básicos
- [x] CRUD de itens do cardápio
- [x] Associação de cardápios a eventos
- [x] Cálculo automático de custos

#### Sprint 4: Financeiro e Orçamentos
- [x] Calculadora detalhada de custos
- [x] Sistema de orçamentos com versionamento
- [x] Gestão de status e prazos
- [x] Sugestão de preços com margem de lucro

#### Sprint 5: Dashboard e Notificações
- [x] Dashboard com estatísticas e alertas
- [x] Sistema de notificações
- [x] Logs de auditoria
- [x] Visão de próximos eventos

## 🔗 Endpoints da API

### Autenticação
- `POST /api/users/register/` - Registro de usuário
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `GET /api/users/profile/` - Perfil do usuário
- `GET /api/users/company/` - Dados da empresa

### Eventos
- `GET /api/events/` - Listar eventos
- `POST /api/events/` - Criar evento
- `GET /api/events/{id}/` - Detalhes do evento
- `PUT /api/events/{id}/` - Atualizar evento
- `DELETE /api/events/{id}/` - Deletar evento
- `GET /api/events/calendar/` - Visualização do calendário

### Cardápio
- `GET /api/events/menu-items/` - Listar itens do cardápio
- `POST /api/events/menu-items/` - Criar item do cardápio
- `GET /api/events/menu-items/{id}/` - Detalhes do item
- `POST /api/events/{id}/menu/` - Adicionar item ao evento

### Financeiro
- `GET /api/financials/dashboard/` - Dashboard principal
- `GET /api/financials/cost-calculations/` - Cálculos de custo
- `GET /api/financials/quotes/` - Orçamentos
- `GET /api/financials/notifications/` - Notificações

## 🗄️ Banco de Dados

O sistema utiliza **SQLite** por padrão para desenvolvimento e pode ser configurado para **PostgreSQL** em produção.

### Modelos Principais:
- **User** - Usuários do sistema com roles
- **Company** - Dados das empresas de buffet
- **Event** - Eventos/festas
- **MenuItem** - Itens do cardápio
- **EventMenu** - Associação evento-cardápio
- **CostCalculation** - Cálculos de custo
- **Quote** - Orçamentos
- **Notification** - Sistema de notificações
- **AuditLog** - Logs de auditoria

## 🔧 Configurações de Desenvolvimento

### Acessar Admin Django
1. Navegar para backend: `cd backend`
2. Ativar ambiente virtual: `source venv_saas_buffet/bin/activate`
3. Criar superusuário: `python manage.py createsuperuser`
4. Acessar: `http://localhost:8000/admin/`

### Estrutura de Pastas
```
saas_buffet/
├── backend/             # Backend Django
│   ├── buffetflow/      # Configurações do Django
│   ├── users/           # App de usuários e empresas
│   ├── events/          # App de eventos e cardápios
│   ├── financials/      # App financeiro e dashboard
│   ├── manage.py        # Script de gerenciamento Django
│   ├── requirements.txt # Dependências Python
│   ├── Dockerfile       # Docker para backend
│   └── venv_saas_buffet/# Ambiente virtual Python
├── frontend/            # App React TypeScript
├── docs/                # Documentação
├── plans/               # Planos de execução
├── docker-compose.yml   # Orquestração Docker
└── README.md           # Este arquivo
```

## 🚨 Solução de Problemas

### Erro de Banco de Dados
Se houver erro de conexão com PostgreSQL, o sistema usa SQLite automaticamente.

### Porta em Uso
Se as portas 8000 ou 3000 estiverem em uso:
```bash
# Backend em outra porta (do diretório backend/)
cd backend
source venv_saas_buffet/bin/activate
python manage.py runserver 0.0.0.0:8001

# Frontend em outra porta
PORT=3001 npm start
```

### Dependências
Se houver problemas com dependências:
```bash
# Backend (do diretório backend/)
cd backend
source venv_saas_buffet/bin/activate
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação em `/docs/`
- Plano de execução em `/plans/execution_plan.md`
- Issues do projeto no GitHub