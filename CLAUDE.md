# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuffetFlow is a SaaS platform for buffet and event management built with Django REST Framework (backend) and Next.js TypeScript (frontend). The system manages events, menus, costs, and provides financial dashboards for buffet businesses.

## Development Commands

### Backend (Django)
```bash
# From backend/ directory
cd backend

# Activate virtual environment
source venv_saas_buffet/bin/activate

# Start development server
python manage.py runserver 0.0.0.0:8000

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create new migration
python manage.py makemigrations

# Access Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test
```

### Frontend (Next.js)
```bash
# From frontend/ directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Docker Commands
```bash
# Start PostgreSQL + Redis only
docker-compose up -d db redis

# Start full stack
docker-compose up

# Stop services
docker-compose down
```

## Architecture

### Backend Structure
- **Location**: All backend code is located in the `backend/` directory
- **Django Project**: `backend/buffetflow/` - Main settings and configuration
- **Apps**:
  - `backend/users/` - Custom User model, Company model, authentication
  - `backend/events/` - Event, MenuItem, EventMenu models and management
  - `backend/financials/` - Cost calculations, quotes, dashboard data
- **Virtual Environment**: `backend/venv_saas_buffet/` - Isolated Python environment

### Frontend Structure
- **Next.js TypeScript App** in `frontend/` with App Router
- **UI Components**: shadcn/ui based components in `src/components/ui/`
- **Custom Components**: Feature-specific components in `src/components/`
- **Pages**: App Router pages in `src/app/`
- **Configuration**: TypeScript and ESLint errors are ignored during builds for development

### Key Models
- **User**: Custom user with roles (owner, manager, staff) and company association
- **Company**: Buffet business entity with default settings and profit margins
- **Event**: Main event entity with client info, datetime, status, conflict detection
- **MenuItem**: Menu items with cost/price per person and categories
- **EventMenu**: Junction table linking events to menu items with quantities

### Authentication
- Token-based authentication using DRF Token Authentication
- Email as username field
- Role-based access control (owner/manager/staff)
- CORS configured for frontend ports 3000-3002

### Database
- **Development**: PostgreSQL Docker
- **Production**: PostgreSQL via `DATABASE_URL` environment variable
- **Automatic fallback**: Uses SQLite if PostgreSQL unavailable

### Environment Configuration
Backend uses python-decouple for environment variables:
- `DEBUG` - Development mode
- `SECRET_KEY` - Django secret
- `ALLOWED_HOSTS` - Comma-separated hosts
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection for Celery

Frontend environment:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000/api)

## Development Workflow

1. **Backend First**: Ensure Django server is running before frontend
2. **API Endpoints**: Follow REST conventions, all API routes under `/api/`
3. **Models**: Use Django ORM with proper relationships and constraints
4. **Serializers**: DRF serializers handle API data transformation
5. **Frontend**: Next.js with TypeScript and shadcn/ui components
6. **State Management**: React hooks and context for state management

## Key Features Implemented

- Multi-tenant system (company-based data isolation)
- Event scheduling with conflict detection
- Menu management with cost calculations
- Financial dashboard and cost analysis
- Role-based permissions
- Token authentication
- Responsive Next.js frontend with shadcn/ui

## Testing

Use Django's built-in test runner from the backend directory:
```bash
cd backend
source venv_saas_buffet/bin/activate
python manage.py test
```

For frontend testing:
```bash
cd frontend && npm test
```

## Key Directories

```
saas_buffet/
├── backend/             # Django backend
│   ├── buffetflow/      # Django project settings
│   ├── users/           # User and Company models
│   ├── events/          # Event and MenuItem models
│   ├── financials/      # Financial calculations and dashboard
│   └── venv_saas_buffet/# Python virtual environment
├── frontend/            # Next.js frontend
│   ├── src/app/         # App Router pages
│   ├── src/components/  # React components
│   └── src/components/ui/# shadcn/ui components
├── agents/              # AI development agents
├── docs/                # Project documentation
└── plans/               # Execution and development plans
```

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `GET /api/users/profile/` - User profile
- `GET /api/users/company/` - Company data

### Events
- `GET /api/events/` - List events
- `POST /api/events/` - Create event
- `GET /api/events/{id}/` - Event details
- `PUT /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `GET /api/events/calendar/` - Calendar view

### Menu
- `GET /api/events/menu-items/` - List menu items
- `POST /api/events/menu-items/` - Create menu item
- `GET /api/events/menu-items/{id}/` - Menu item details
- `POST /api/events/{id}/menu/` - Add item to event

### Financial
- `GET /api/financials/dashboard/` - Dashboard data
- `GET /api/financials/cost-calculations/` - Cost calculations
- `GET /api/financials/quotes/` - Quotes
- `GET /api/financials/notifications/` - Notifications


# BuffetFlow Project Documentation

Welcome to the official documentation of the BuffetFlow project. This directory contains all the guides and standards necessary to understand the architecture, set up the environment, and contribute to the project.

## Table of Contents

- [Project Overview](./PROJECT_OVERVIEW.md)
- [Getting Started Guide](./GETTING_STARTED.md)
- [Backend Guidelines](./BACKEND_GUIDELINES.md)
- [Frontend Guidelines](./FRONTEND_GUIDELINES.md)
- [API Conventions](./API_CONVENTIONS.md)
- [Git Workflow](./GIT_WORKFLOW.md)

# AI Agents for Development

This directory contains a collection of specialized AI agents, each designed to assist in a specific role within the software development lifecycle of the BuffetFlow project.

## When to Use AI Agents

Use these agents to automate tasks, ensure compliance with project standards, and accelerate development. Each agent is pre-configured with the relevant context and guidelines for its area of expertise.

Invoke an agent when you need to:
- **Generate code** that follows backend or frontend guidelines.
- **Create new API endpoints** that comply with established conventions.
- **Get an overview** of the project status or plan new features.
- **Automate Git workflow**, such as creating branches or formatting commit messages.

## Agent Index

- [Project Manager Agent](./project_manager_agent.md)
- [Backend Developer Agent](./backend_developer_agent.md)
- [Frontend Developer Agent](./frontend_developer_agent.md)
- [API Specialist Agent](./api_specialist_agent.md)
- [DevOps Agent](./devops_agent.md)