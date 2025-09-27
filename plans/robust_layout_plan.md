# Plano de Melhoria do Layout

## Agente Responsável

**Agente de Desenvolvedor Frontend**

## Objetivo

Modernizar e profissionalizar o layout da aplicação, melhorando a usabilidade e a estética, sem alterar o esquema de cores existente. Adicionar a funcionalidade de modo escuro/claro.

## Detalhes do Plano

### 1. Análise da Estrutura Atual

- **Revisar `src/app/layout.tsx`**: Entender a estrutura principal da página, incluindo a disposição dos componentes de navegação e conteúdo.
- **Mapear Componentes de Navegação**: Identificar os componentes que atualmente servem como menu principal e header.
- **Analisar Estilos Globais**: Verificar `src/app/globals.css` para entender como os estilos são aplicados e como o tema de cores é definido.

### 2. Proposta de Novo Layout com Menu Lateral

- **Desenvolver um Componente de Menu Lateral (`SideNav.tsx`)**:
    - O menu deve ser fixo na lateral esquerda.
    - Deve conter os mesmos links de navegação do menu atual.
    - O design deve ser limpo e profissional, utilizando componentes da biblioteca `shadcn/ui`.
- **Reestruturar o `layout.tsx`**:
    - Integrar o novo `SideNav.tsx`.
    - Ajustar o layout principal para que o conteúdo principal ocupe o espaço restante à direita do menu.
    - O header será mantido, mas poderá ter seu conteúdo ajustado para melhor alinhamento com o menu lateral.

### 3. Implementação do Botão de Inversão de Cores (Modo Escuro/Claro)

- **Adicionar um Botão ao Header**:
    - No componente do header, adicionar um novo ícone/botão ao lado do botão de "Configurações".
    - O ícone pode ser um sol/lua para representar a troca de tema.
- **Criar um Hook de Tema (`useTheme.ts`)**:
    - Este hook será responsável por gerenciar o estado do tema (claro ou escuro).
    - O estado será persistido no `localStorage` para que a preferência do usuário seja mantida.
- **Aplicar Estilos Condicionais**:
    - Utilizar o estado do tema para aplicar classes CSS que invertem as cores.
    - Onde o fundo é branco, passará a ser preto, e o texto preto passará a ser branco (e vice-versa).
    - Os estilos devem ser aplicados de forma global para garantir consistência em toda a aplicação.
    - As cores primárias e secundárias do tema original devem ser mantidas, apenas o fundo e o texto principal serão invertidos.

### 4. Passos de Implementação

1.  **Criar o arquivo `plans/robust_layout_plan.md`** com este planejamento.
2.  **Desenvolver o componente `src/components/layout/SideNav.tsx`**.
3.  **Atualizar o `src/app/layout.tsx`** para usar o novo `SideNav` e ajustar a estrutura.
4.  **Criar o hook `src/hooks/use-theme.ts`**.
5.  **Adicionar o botão de troca de tema no header**.
6.  **Atualizar `src/app/globals.css`** com as variáveis de cor para o tema escuro.
7.  **Testar** a responsividade do novo layout e a funcionalidade de troca de tema.

## Considerações

- **Não alterar o esquema de cores**: O plano foca em inverter as cores de fundo e texto, mantendo a paleta de cores original para botões, links e outros elementos de destaque.
- **Manter a responsividade**: O novo layout deve ser totalmente responsivo, garantindo uma boa experiência em dispositivos móveis. O menu lateral pode ser recolhido ou transformado em um menu "hambúrguer" em telas menores.
