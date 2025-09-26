# Diretrizes do Backend

Estas são as diretrizes e padrões a serem seguidos no desenvolvimento do backend com Django.

## Linguagem e Framework

- **Linguagem:** Python 3.10+
- **Framework:** Django e Django REST Framework (DRF).

## Estilo de Código

- **Padrão:** Siga rigorosamente o guia de estilo [PEP 8](https://www.python.org/dev/peps/pep-0008/).
- **Formatação:** Utilize `black` para formatação automática de código.
- **Linting:** Utilize `flake8` ou `ruff` para identificar problemas de estilo e erros.

## Estrutura de Diretórios

O projeto segue a estrutura padrão de "apps" do Django. Cada funcionalidade principal (ex: `clients`, `events`, `financials`) deve residir em seu próprio app.

- `models.py`: Definição dos modelos de dados.
- `views.py`: Lógica de negócio e endpoints da API (usando `APIView` ou `ViewSet` do DRF).
- `serializers.py`: Serialização e validação de dados para a API.
- `urls.py`: Definição das rotas do app.
- `tests.py`: Testes unitários e de integração para o app.

## Testes

- Escreva testes para toda nova funcionalidade ou correção de bug.
- Utilize a suíte de testes do Django ou `pytest`.
- Priorize testes unitários para lógica de negócio e testes de integração para os endpoints da API.

## Migrações

- Após qualquer alteração nos `models.py`, gere um novo arquivo de migração:
  ```bash
  python manage.py makemigrations
  ```
- Mantenha os arquivos de migração limpos e evite conflitos.