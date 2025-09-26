# Visão Geral do Projeto

**BuffetFlow** é uma plataforma SaaS (Software as a Service) projetada para simplificar a gestão de buffets e locais de eventos. A plataforma oferece uma solução completa para administrar clientes, eventos, agendamentos e finanças, com o objetivo de otimizar a eficiência operacional e centralizar as informações.

## Arquitetura

O projeto utiliza uma arquitetura desacoplada, com um backend robusto em Django (Python) e um frontend moderno em Next.js (TypeScript).

- **Backend:** Construído com Django e Django REST Framework, servindo uma API RESTful para todas as operações.
- **Frontend:** Desenvolvido com Next.js e TypeScript, utilizando componentes da biblioteca shadcn/ui para uma interface de usuário elegante e responsiva.
- **Banco de Dados:** PostgreSQL, um sistema de gerenciamento de banco de dados relacional de código aberto, orquestrado via Docker.
- **Serviços Adicionais:** Redis é utilizado para caching e gerenciamento de tarefas em segundo plano, melhorando a performance e a escalabilidade da aplicação.

## Ambiente de Desenvolvimento

Todo o ambiente de desenvolvimento é containerizado com Docker, garantindo consistência e facilidade na configuração inicial.