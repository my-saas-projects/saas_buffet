# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

BuffetFlow is a SaaS application for buffet management built with a Django REST Framework backend and Next.js frontend. The project uses Docker for backend services and runs the frontend locally.

### Backend (Django)
- **Location**: `/backend/`
- **Main project**: `buffetflow` (Django settings and configuration)
- **Apps**:
  - `users` - User management and authentication
  - `events` - Event/party management and menu items
  - `financials` - Cost calculations, quotes, and dashboard
  - `companies` - Company/buffet business data
- **Database**: PostgreSQL (via Docker) with SQLite fallback
- **Authentication**: Token-based using Django REST Framework
- **Language**: Brazilian Portuguese (pt-br timezone: America/Sao_Paulo)

### Frontend (Next.js)
- **Location**: `/frontend/`
- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **UI**: shadcn/ui components with Tailwind CSS
- **State**: React hooks, Zustand for global state
- **API Client**: Axios with TanStack Query
- **Forms**: react-hook-form with Zod validation

## Development Commands

### Backend (with Docker)
```bash
# Start all services (backend, database, redis)
docker-compose up --build

# Run Django management commands
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py shell

# Alternative: local development (requires virtual env)
cd backend
source venv_saas_buffet/bin/activate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # Development server (localhost:3000)
npm run build  # Production build
npm run lint   # ESLint checking
```

## Services and Ports
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: PostgreSQL on localhost:5432
- **Redis**: localhost:6379
- **Django Admin**: http://localhost:8000/admin/

## Key API Endpoints
- `/api/users/` - User authentication and profiles
- `/api/events/` - Event management and menu items
- `/api/financials/` - Dashboard, cost calculations, quotes
- `/api/financials/dashboard/` - Main dashboard with statistics

## Code Conventions

### Backend
- Follow PEP 8 standards
- Use `snake_case` for variables, functions, modules
- Use `PascalCase` for classes
- Custom user model: `users.User`
- Create new apps with: `docker-compose exec web python manage.py startapp <name>`

### Frontend
- Use `PascalCase` for React components
- Use `camelCase` for variables and functions
- Prefer shadcn/ui components for consistency
- Follow Next.js App Router patterns
- API communication via `/src/services/api.ts`

## Environment Configuration
- Backend reads `.env` from project root
- Database URL configurable via `DATABASE_URL`
- CORS configured for localhost:3000-3002
- Static files served with WhiteNoise

## Testing
Check the project for specific test commands - no standard test framework is currently configured.