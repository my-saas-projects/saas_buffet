# Diretrizes do Frontend

Estas são as diretrizes e padrões para o desenvolvimento do frontend com Next.js e TypeScript.

## Linguagem e Framework

- **Linguagem:** TypeScript
- **Framework:** React e Next.js

## Estilo de Código

- **Padrão:** Siga as melhores práticas da comunidade React e TypeScript.
- **Formatação:** Utilize `Prettier` para formatação automática.
- **Linting:** Utilize `ESLint` para identificar problemas de código e garantir a consistência.

## Componentes

- **Biblioteca de UI:** [shadcn/ui](https://ui.shadcn.com/). Dê preferência aos componentes desta biblioteca para manter a consistência visual.
- **Estrutura:** Crie componentes reutilizáveis e bem definidos. Componentes complexos devem ser divididos em subcomponentes menores.
- **Localização:** Armazene os componentes no diretório `src/components`, organizados em subpastas por funcionalidade (ex: `src/components/events`).

## Gerenciamento de Estado

- **Estado Local:** Utilize os hooks do React (`useState`, `useReducer`) para o estado de componentes individuais.
- **Estado Global:** Para estado compartilhado entre múltiplos componentes, utilize a Context API do React (`createContext`).
- **Hooks Customizados:** Encapsule lógicas reutilizáveis em hooks customizados (ex: `useAuth`, `useApi`) e armazene-os em `src/hooks`.

## Estilização

- **Framework CSS:** [Tailwind CSS](https://tailwindcss.com/). Utilize as classes de utilitário do Tailwind para estilizar os componentes.
- **CSS Customizado:** Para estilos globais ou muito específicos, utilize o arquivo `src/app/globals.css`.

## Chamadas de API

- **Cliente HTTP:** Utilize `fetch` ou uma biblioteca como `axios` para fazer requisições à API do backend.
- **Serviços:** Centralize a lógica de chamada de API em arquivos de serviço, localizados em `src/services` (ex: `api.ts`).