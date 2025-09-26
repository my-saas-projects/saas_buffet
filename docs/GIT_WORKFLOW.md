# Fluxo de Trabalho com Git

Este documento descreve o fluxo de trabalho com Git e as convenções de branch e commit para o projeto BuffetFlow.

## Estratégia de Branches

Adotamos uma estratégia baseada no GitFlow, com as seguintes branches principais:

- **`main`**: Contém o código em produção. Apenas merges de `develop` são permitidos. Nenhum commit direto deve ser feito aqui.
- **`develop`**: Branch de integração principal. Contém as funcionalidades mais recentes que estão prontas para o próximo release. É a base para a criação de novas branches.

### Branches de Suporte

- **`feature/<nome-da-feature>`**: Para o desenvolvimento de novas funcionalidades.
  - **Exemplo:** `feature/event-calendar`
  - **Criada a partir de:** `develop`
  - **Merge para:** `develop` (via Pull Request)

- **`fix/<nome-da-correcao>`**: Para correções de bugs.
  - **Exemplo:** `fix/login-error`
  - **Criada a partir de:** `develop`
  - **Merge para:** `develop` (via Pull Request)

- **`hotfix/<nome-da-correcao-urgente>`**: Para correções críticas em produção.
  - **Criada a partir de:** `main`
  - **Merge para:** `main` e `develop`

## Convenção de Commits

Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Isso melhora a legibilidade do histórico e permite a automação de versionamento.

O formato é: `<tipo>(<escopo>): <descrição>`

### Tipos Comuns:

- **`feat`**: Uma nova funcionalidade.
- **`fix`**: Uma correção de bug.
- **`docs`**: Alterações na documentação.
- **`style`**: Alterações de formatação, sem impacto no código.
- **`refactor`**: Refatoração de código, sem alterar a funcionalidade.
- **`test`**: Adição ou modificação de testes.
- **`chore`**: Tarefas de build, configuração, etc.

### Exemplos:

```
feat(events): add client selection to event form
fix(api): correct serialization of financial data
docs(readme): update setup instructions
```

## Pull Requests (PRs)

- Todo o código deve ser enviado para a branch `develop` através de um Pull Request.
- Um PR deve ter uma descrição clara do que foi feito.
- É necessário que pelo menos um outro desenvolvedor revise e aprove o PR antes do merge.