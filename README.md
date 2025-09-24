# BuffetFlow - Sistema de Gestão para Buffets

Sistema completo para gestão de buffets de festas, desenvolvido com Django REST Framework e React TypeScript.

## 🚀 Como Inicializar o Sistema

### Pré-requisitos

- Python 3.11+
- Node.js 16+
- Git
- Docker (opcional, para PostgreSQL)

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd saas_buffet
```

### 2. Configurar o Backend (Django)

#### 2.1. Navegar para o diretório backend

```bash
cd backend
```

#### 2.2. Criar e Ativar Ambiente Virtual

```bash
python3 -m venv venv_saas_buffet
source venv_saas_buffet/bin/activate  # Linux/Mac
# ou
venv_saas_buffet\Scripts\activate     # Windows
```

#### 2.3. Instalar Dependências

```bash
pip install -r requirements.txt
```

#### 2.3. Configurar Variáveis de Ambiente

Copie o arquivo `.env` de exemplo (ou crie um novo):

```bash
cp .env.example .env  # se existir
# ou crie o arquivo .env com:
```

**Conteúdo do arquivo `.env`:**
```env
DEBUG=True
SECRET_KEY=django-insecure-*x7a$@vi*yn(e@77cuz_kc-pzi*&z+sot(-1w1uwj0)kr435*&
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
REDIS_URL=redis://localhost:6379/0

# Para usar PostgreSQL (opcional):
# DATABASE_URL=postgresql://buffetflow_user:buffetflow_pass@localhost:5432/buffetflow_db
```

#### 2.4. Executar Migrações

```bash
python manage.py migrate
```

#### 2.5. Criar Superusuário (Opcional)

```bash
python manage.py createsuperuser
```

#### 2.6. Iniciar o Servidor Django

```bash
python manage.py runserver 0.0.0.0:8000
```

O backend estará disponível em: `http://localhost:8000`

### 3. Configurar o Frontend (React)

#### 3.1. Navegar para o Diretório do Frontend

```bash
cd frontend
```

#### 3.2. Instalar Dependências

```bash
npm install
```

#### 3.3. Configurar Variáveis de Ambiente

Verifique se o arquivo `.env` no frontend está configurado:

```env
REACT_APP_API_URL=http://localhost:8000/api
GENERATE_SOURCEMAP=false
```

#### 3.4. Iniciar o Servidor React

```bash
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🐳 Usando Docker (Opcional)

### Para PostgreSQL + Redis

```bash
docker-compose up -d db redis
```

### Para todo o sistema

```bash
docker-compose up
```

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