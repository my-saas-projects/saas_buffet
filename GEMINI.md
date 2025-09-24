# BuffetFlow - Sistema de Gestão para Buffets

## Project Overview

BuffetFlow is a SaaS platform designed to simplify the management of buffets and event venues. The project is built with a modern web application architecture, clearly separating the backend from the frontend.

*   **Backend**: Developed with Django and Django Rest Framework (DRF) in Python. It is responsible for all business logic, data manipulation, and serving a RESTful API for the frontend.
*   **Frontend**: A Single-Page Application (SPA) developed with React and TypeScript. It is responsible for the user interface, navigation experience, and communication with the backend via API.
*   **Database**: PostgreSQL is the main database, managed by the Django ORM.
*   **Containerization**: The development and production environment is fully containerized using Docker and Docker Compose.

## Building and Running

### Backend (Django)

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
2.  **Run migrations:**
    ```bash
    python manage.py migrate
    ```
3.  **Start the server:**
    ```bash
    python manage.py runserver
    ```

### Frontend (React)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the server:**
    ```bash
    npm start
    ```

## Development Conventions

### API Conventions

The project follows the RESTful API conventions detailed in `docs/API_CONVENTIONS.md`.

*   **Endpoints**: Use plural nouns (e.g., `/api/events/`).
*   **Data Format**: JSON with `snake_case` for keys.
*   **Authentication**: Token-based authentication using the `Authorization` header.
*   **HTTP Methods**:
    *   `GET`: Retrieve resources.
    *   `POST`: Create a new resource.
    *   `PUT`/`PATCH`: Update a resource.
    *   `DELETE`: Remove a resource.

### Code Style

*   **Backend**: Follows the PEP 8 style guide for Python code.
*   **Frontend**: Uses the ESLint configuration defined in `frontend/package.json`.

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