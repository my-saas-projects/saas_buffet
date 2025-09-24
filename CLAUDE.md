# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuffetFlow is a SaaS platform for buffet and event management built with Django REST Framework (backend) and React TypeScript (frontend). The system manages events, menus, costs, and provides financial dashboards for buffet businesses.

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
```

### Frontend (React)
```bash
# From frontend/ directory
npm install        # Install dependencies
npm start         # Start development server (port 3000)
npm run build     # Build for production
npm test          # Run tests
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
- **Location**: All backend code is now located in the `backend/` directory
- **Django Project**: `backend/buffetflow/` - Main settings and configuration
- **Apps**:
  - `backend/users/` - Custom User model, Company model, authentication
  - `backend/events/` - Event, MenuItem, EventMenu models and management
  - `backend/financials/` - Cost calculations, quotes, dashboard data
- **Virtual Environment**: `backend/venv_saas_buffet/` - Isolated Python environment

### Frontend Structure
- **React TypeScript SPA** in `frontend/`
- **Context-based auth**: `src/contexts/AuthContext.tsx`
- **Pages**: Dashboard, Events, Menu, Financial, Login
- **API Service**: `src/services/api.ts` - Axios-based API client

### Key Models
- **User**: Custom user with roles (owner, manager, staff) and company association
- **Company**: Buffet business entity with default settings
- **Event**: Main event entity with client info, datetime, status, conflict detection
- **MenuItem**: Menu items with cost/price per person
- **EventMenu**: Junction table linking events to menu items with quantities

### Authentication
- Token-based authentication using DRF Token Authentication
- Email as username field
- Role-based access control (owner/manager/staff)
- CORS configured for frontend ports 3000-3002

### Database
- **Development**: SQLite (default)
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
5. **Frontend**: TypeScript React with functional components and hooks
6. **State Management**: React Context for auth, component state for local data

## Key Features Implemented

- Multi-tenant system (company-based data isolation)
- Event scheduling with conflict detection
- Menu management with cost calculations
- Financial dashboard and cost analysis
- Role-based permissions
- Token authentication
- Responsive React frontend

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