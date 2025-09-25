# Gemini - Project Context

## Project Overview

This project is a SaaS platform called **BuffetFlow**, designed to manage buffets and event venues. It features a decoupled architecture with a Django/Python backend and a Next.js/TypeScript frontend. The entire environment is containerized using Docker.

- **Backend:** Django REST Framework, serving a RESTful API.
- **Frontend:** Next.js (React) with TypeScript, utilizing shadcn/ui for components.
- **Database:** PostgreSQL, managed by Docker.
- **Services:** Redis is used for caching and background tasks.

## Building and Running with Docker

The entire development environment is managed via Docker Compose.

### 1. Start All Services

From the project root directory, run:

```bash
docker-compose up --build
```

This command builds the images and starts the containers for the backend, database, and Redis.

### 2. Backend Management Commands

To run Django management commands, use `docker-compose exec`:

```bash
# Run database migrations
docker-compose exec web python manage.py migrate

# Create a superuser
docker-compose exec web python manage.py createsuperuser
```

### 3. Frontend Development

The frontend is run locally and connects to the containerized backend.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Development Conventions

### API

-   **Endpoints:** Plural nouns (e.g., `/api/events/`).
-   **Authentication:** Token-based (JWT) via `Authorization: Bearer <token>` header.
-   **Data Format:** JSON with `snake_case` for keys.
-   **HTTP Verbs:** Standard usage (`GET`, `POST`, `PATCH`, `DELETE`).
-   **Status Codes:** Conventional HTTP status codes are used to indicate success or failure.

### Code Style

-   **Backend:** Follows standard Python/Django conventions.
-   **Frontend:** Follows standard React/TypeScript conventions.

### Git Workflow

-   Refer to `docs/GIT_WORKFLOW.md` for branching and commit message conventions.

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