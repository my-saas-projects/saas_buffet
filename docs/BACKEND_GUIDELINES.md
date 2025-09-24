# Diretrizes do Backend

O backend é construído com Django e Django REST Framework.

## Estrutura de Diretórios

-   `buffetflow`: Contém as configurações principais do projeto Django.
-   `events`, `financials`, `users`: São exemplos de "apps" do Django. Cada app representa um módulo da aplicação com seus próprios models, views, serializers e urls.

## Padrões de Código

-   Siga os padrões de estilo de código definidos pelo PEP 8.
-   Use `snake_case` para nomes de variáveis, funções e módulos.
-   Use `PascalCase` para nomes de classes.

## Criando um Novo App

Para adicionar uma nova funcionalidade, crie um novo app:

```bash
python manage.py startapp <nome_do_app>
```

Depois de criar o app, adicione-o à lista de `INSTALLED_APPS` no arquivo `buffetflow/settings.py`.
