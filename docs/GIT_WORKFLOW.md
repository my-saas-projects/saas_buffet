# Fluxo de Trabalho com Git

Este documento descreve o fluxo de trabalho com Git adotado no projeto, inspirado no GitFlow. O objetivo é manter o repositório organizado e facilitar o desenvolvimento paralelo e a estabilidade do código.

## Branches Principais

Existem duas branches principais com tempo de vida infinito:

- **`main`**: Esta branch contém o código de produção. Todo o código na `main` deve ser estável e "deployável". Apenas merges da branch `develop` (ou hotfixes) são permitidos.
- **`develop`**: Esta é a branch de integração principal para o desenvolvimento. Contém o código com as últimas funcionalidades desenvolvidas e aguardando o próximo release. É a branch base para o desenvolvimento de novas features.

## Branches de Suporte

São branches com tempo de vida limitado, usadas para auxiliar o desenvolvimento.

### 1. Feature Branches

- **Convenção de Nomenclatura**: `feature/<nome-da-feature>` (ex: `feature/user-authentication`).
- **Origem**: Devem ser criadas a partir da branch `develop`.
- **Merge**: Devem ser mescladas de volta na branch `develop`.
- **Propósito**: Desenvolver novas funcionalidades. Nunca devem interagir diretamente com a `main`.

**Fluxo:**
```bash
# Sair da develop
git checkout -b feature/minha-feature develop

# Após o desenvolvimento...
git checkout develop
git merge --no-ff feature/minha-feature
git push

# Remover a branch local
git branch -d feature/minha-feature
```

### 2. Release Branches

- **Convenção de Nomenclatura**: `release/<versao>` (ex: `release/v1.2.0`).
- **Origem**: Devem ser criadas a partir da `develop`.
- **Propósito**: Preparar um novo release de produção. Permite que a `develop` continue recebendo features para o próximo ciclo, enquanto a versão atual é finalizada.
- **Merge**: Quando finalizada, a branch de release é mesclada tanto na `main` quanto na `develop`.

### 3. Hotfix Branches

- **Convenção de Nomenclatura**: `hotfix/<descricao-do-hotfix>` (ex: `hotfix/fix-login-bug`).
- **Origem**: Devem ser criadas a partir da `main`.
- **Propósito**: Corrigir bugs críticos em produção de forma rápida.
- **Merge**: Quando finalizada, a branch de hotfix é mesclada tanto na `main` quanto na `develop` para garantir que a correção seja incorporada no próximo release.

## Commits

- **Mensagens Claras**: As mensagens de commit devem ser claras, concisas e escritas no modo imperativo (ex: "Adiciona feature de login" em vez de "Adicionada feature de login").
- **Atomicidade**: Faça commits pequenos e atômicos. Cada commit deve representar uma única mudança lógica.

## Pull Requests (PRs)

- **Revisão de Código**: Todo o código novo deve passar por um Pull Request antes de ser mesclado na `develop` ou `main`.
- **Descrição**: O PR deve ter uma descrição clara do que foi feito e por quê.
- **Aprovação**: O PR deve ser revisado e aprovado por pelo menos um outro membro da equipe.
