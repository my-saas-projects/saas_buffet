# Diretrizes de Desenvolvimento do Backend

Este documento define os padrões e as melhores práticas para o desenvolvimento do backend com Django e Django Rest Framework (DRF).

## Linguagem e Frameworks

- **Linguagem**: Python 3.10+
- **Framework**: Django
- **API**: Django Rest Framework (DRF)

## Estilo de Código

- **PEP 8**: Todo o código Python deve seguir estritamente as convenções da [PEP 8](https://www.python.org/dev/peps/pep-0008/).
- **Linters e Formatadores**: Recomenda-se o uso de ferramentas como `Black` para formatação automática e `Flake8` ou `Ruff` para linting, garantindo a consistência do código.

## Estrutura de Apps Django

- **Modularidade**: Cada funcionalidade principal do sistema deve ser encapsulada em seu próprio app Django (ex: `users`, `events`, `financials`).
- **Nomenclatura**: Os apps devem ter nomes curtos, em letras minúsculas e no plural quando representarem um recurso.

## Models

- **Nomenclatura**: Nomes de modelos devem ser em `CamelCase` e no singular (ex: `Event`, `Client`).
- **Campos**: Use nomes de campos em `snake_case`.
- **Lógica de Negócio**: Métodos que contêm lógica de negócio específica de um modelo devem ser implementados no próprio modelo ou em um `Manager` associado.

## Views e Serializers (DRF)

- **Views**: Prefira o uso de `ViewSets` genéricos do DRF (ex: `ModelViewSet`) para operações CRUD padrão. Para lógica mais complexa, use `APIView`.
- **Serializers**: Use `ModelSerializer` para serializar e desserializar modelos do Django. Validações complexas devem ser implementadas nos métodos `validate_<field>` ou `validate` do serializer.
- **Permissões**: Utilize o sistema de permissões do DRF para controlar o acesso aos endpoints.

## URLs

- **Padrão de Nomenclatura**: As URLs da API devem seguir o padrão `/api/v1/<recurso>/`.
- **Versionamento**: A API deve ser versionada na URL para facilitar futuras atualizações sem quebrar a compatibilidade com o frontend.

## Testes

- **Cobertura**: Todos os novos endpoints, modelos e lógicas de negócio devem ser acompanhados de testes unitários e de integração.
- **Localização**: Os testes devem ser escritos no arquivo `tests.py` de cada app ou em um diretório `tests/` dentro do app.
