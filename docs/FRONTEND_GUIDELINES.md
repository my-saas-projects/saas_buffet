# Diretrizes do Frontend

O frontend é construído com Next.js, React e TypeScript.

## Estrutura de Diretórios

-   `src/app`: Contém as rotas e páginas da aplicação, seguindo o App Router do Next.js.
-   `src/components`: Contém componentes React reutilizáveis. Componentes de UI específicos, gerados pelo `shadcn/ui`, estão em `src/components/ui`.
-   `src/lib`: Contém funções utilitárias e configurações.
-   `src/services`: Contém a lógica de comunicação com a API, como o cliente Axios (`api.ts`).
-   `src/hooks`: Contém hooks React customizados.

## Padrões de Código

-   Use `PascalCase` para nomes de componentes React.
-   Use `camelCase` para nomes de variáveis e funções.
-   Prefira o uso de componentes de `shadcn/ui` para manter a consistência visual.

## Gerenciamento de Estado

-   Para estado local, use os hooks do React (`useState`, `useReducer`).
-   Para estado global, considere o uso de `Context API` ou uma biblioteca como Zustand, se necessário.
