# Diretrizes de Desenvolvimento do Frontend

Este documento estabelece os padrões para o desenvolvimento da aplicação frontend com React e TypeScript.

## Linguagem e Frameworks

- **Framework**: React 18+
- **Linguagem**: TypeScript
- **Estilo**: CSS Modules ou Component-specific CSS files (ex: `Login.css`)

## Estilo de Código

- **Padrões**: Siga os padrões da comunidade para React e TypeScript.
- **Linting e Formatação**: O projeto deve ser configurado com `ESLint` para análise estática de código e `Prettier` para formatação automática, garantindo um estilo de código consistente.

## Estrutura de Pastas

A estrutura de pastas em `src/` é organizada por funcionalidade para facilitar a manutenção:

- **`components/`**: Contém componentes React reutilizáveis em várias partes da aplicação (ex: `Layout`, `Button`, `Input`).
- **`pages/`**: Contém os componentes que representam as páginas principais da aplicação (ex: `Dashboard`, `Login`, `Events`). Cada página pode ter seu próprio arquivo de estilo.
- **`contexts/`**: Para gerenciamento de estado global através da Context API (ex: `AuthContext`).
- **`services/`**: Centraliza a lógica de comunicação com a API backend. O `api.ts` (usando Axios ou Fetch) é um exemplo.
- **`hooks/`**: Para hooks customizados que encapsulam lógica reutilizável (ex: `useFetch`, `useAuth`).
- **`utils/`**: Funções utilitárias puras que podem ser usadas em qualquer lugar do projeto (ex: formatação de datas, validações).

## Componentes

- **Funcionais**: Dê preferência a componentes funcionais com Hooks em vez de componentes de classe.
- **Tipagem**: Todos os componentes devem ter suas props tipadas com TypeScript.
- **Estilização**: A estilização deve ser local ao componente sempre que possível, importando um arquivo CSS específico para ele. Evite estilos globais, exceto para resets e temas base.

## Gerenciamento de Estado

- **Estado Local**: Use os hooks `useState` e `useReducer` para gerenciar o estado de componentes individuais.
- **Estado Global**: Para estado compartilhado entre múltiplos componentes (como informações de autenticação), utilize a **Context API**. Para casos mais complexos, uma biblioteca como Redux ou Zustand pode ser considerada no futuro.

## Comunicação com a API

- **Centralização**: Toda a lógica de chamada à API deve residir na pasta `services/`. Isso desacopla a lógica de busca de dados dos componentes.
- **Tratamento de Erros**: Implemente um tratamento de erros robusto para as chamadas de API, informando o usuário de forma clara quando algo der errado.
