# Visão Geral do Projeto

## O que é o BuffetFlow?

BuffetFlow é uma plataforma SaaS (Software as a Service) projetada para simplificar a gestão de buffets e casas de eventos. A solução oferece ferramentas para controle de agendamentos, gestão financeira, cadastro de clientes e geração de relatórios, centralizando as operações em um único lugar.

## Arquitetura

O projeto é construído sobre uma arquitetura moderna de aplicação web, separando claramente o backend do frontend.

- **Backend**: Desenvolvido com **Django** e **Django Rest Framework (DRF)** em **Python**. É responsável por toda a lógica de negócio, manipulação de dados e por servir uma API RESTful para o frontend.

- **Frontend**: Uma Single-Page Application (SPA) desenvolvida com **React** e **TypeScript**. É responsável pela interface do usuário, experiência de navegação e comunicação com o backend via API.

- **Banco de Dados**: **PostgreSQL** é o banco de dados principal, gerenciado pelo ORM do Django. É ideal pela sua robustez e escalabilidade.

- **Containerização**: O ambiente de desenvolvimento e produção é totalmente containerizado usando **Docker** e **Docker Compose**. Isso garante consistência entre os ambientes e simplifica a configuração inicial.
