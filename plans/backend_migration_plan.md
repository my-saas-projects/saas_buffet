# Plano de Migração do Backend

**Agente Responsável:** Agente Gerente de Projeto

## Objetivo

Reestruturar o projeto para mover todos os componentes do backend (aplicações Django, configurações, etc.) para um diretório dedicado chamado `backend/`. Isso melhorará a organização do projeto, separando claramente as responsabilidades de frontend e backend.

## Planejamento

### Passo 1: Criar o Diretório `backend`

- Na raiz do projeto, criar um novo diretório chamado `backend`.

### Passo 2: Mover os Componentes do Backend

- Mover os seguintes diretórios e arquivos para a nova pasta `backend/`:
    - `buffetflow/`
    - `events/`
    - `financials/`
    - `users/`
    - `manage.py`
    - `requirements.txt`
    - `Dockerfile`
    - `docker-compose.yml`

### Passo 3: Atualizar Arquivos de Configuração

- **`docker-compose.yml`**:
    - Atualizar o `build context` no serviço de backend para apontar para o novo diretório.
        - Exemplo: `build: ./backend`
    - Ajustar os volumes para refletir a nova estrutura de pastas.
        - Exemplo: `volumes: ./backend:/app`

- **`Dockerfile`**:
    - Revisar os comandos `COPY` e `WORKDIR` para garantir que os caminhos estejam corretos dentro do novo contexto de build. Por exemplo, `COPY requirements.txt .` continuará funcionando se o contexto do build for `./backend`.

### Passo 4: Ambiente Virtual

- O ambiente virtual (`venv/`) não deve ser movido. A recomendação é recriá-lo dentro da pasta `backend/` para manter o encapsulamento do ambiente de desenvolvimento do backend.
    1. Remover o diretório `venv/` antigo.
    2. Navegar para `backend/` e executar `python -m venv venv_saas_buffet`.

### Passo 5: Verificação

- Após a reestruturação, será necessário:
    1. Reconstruir a imagem Docker com `docker-compose build`.
    2. Iniciar os serviços com `docker-compose up`.
    3. Verificar se a aplicação Django está funcionando corretamente.
    4. Testar a comunicação entre o frontend e o backend para garantir que os endpoints da API continuam acessíveis.

## Estrutura de Pastas Alvo

```
/
├── backend/
│   ├── buffetflow/
│   ├── events/
│   ├── financials/
│   ├── users/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   └── ...
└── ...
```
