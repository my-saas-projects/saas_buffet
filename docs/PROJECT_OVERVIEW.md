# Visão Geral do Projeto

Este projeto é uma plataforma SaaS chamada **BuffetFlow**, projetada para gerenciar buffets e locais de eventos. Possui uma arquitetura desacoplada com um backend em Django/Python e um frontend em Next.js/TypeScript. Todo o ambiente é containerizado usando Docker.

- **Backend:** Django REST Framework, servindo uma API RESTful.
- **Frontend:** Next.js (React) com TypeScript, utilizando shadcn/ui para componentes.
- **Banco de Dados:** PostgreSQL, gerenciado pelo Docker.
- **Serviços:** Redis é usado para cache e tarefas em segundo plano.
