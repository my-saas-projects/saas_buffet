# Plano de Melhoria: Visualização de Eventos no Dashboard

**Agente Responsável:** Agente Gerente de Projeto

## Objetivo

Otimizar a experiência do usuário, permitindo que a lista de eventos agendados seja exibida diretamente na página principal (Dashboard) ao clicar no item de menu "Eventos". Isso elimina a necessidade de navegar para uma página separada e clicar em "Gerenciar Eventos", tornando o acesso à informação mais rápido e intuitivo.

## Arquivos Afetados (Estimativa)

*   `frontend/src/app/page.tsx`: A página principal do Dashboard, que precisará ser modificada para incluir a lógica de exibição da lista de eventos.
*   `frontend/src/app/events/page.tsx`: A página de eventos existente, cujo conteúdo (a lista) será movido para o dashboard. A página em si pode ser removida ou reaproveitada.
*   `frontend/src/components/events/events-list.tsx`: O componente que renderiza a lista de eventos. Ele será reutilizado no dashboard.
*   `frontend/src/components/ui/sidebar.tsx`: O componente de navegação, onde o link "Eventos" será ajustado para controlar a exibição no dashboard em vez de navegar para `/events`.

## Plano de Execução

1.  **Análise da Estrutura Atual:**
    *   Examinar `frontend/src/app/page.tsx` para identificar a melhor forma de integrar um novo componente de forma condicional.
    *   Analisar como `frontend/src/app/events/page.tsx` busca e exibe os dados dos eventos.

2.  **Integração do Componente no Dashboard:**
    *   Modificar `frontend/src/app/page.tsx` para importar e renderizar o componente `events-list.tsx`.
    *   A exibição da lista de eventos no dashboard será controlada por um estado local ou um parâmetro de URL (ex: `/?section=events`).

3.  **Ajuste da Navegação:**
    *   No `sidebar.tsx`, o link "Eventos" não irá mais redirecionar para `/events`. Em vez disso, ele irá manipular o estado da página principal para exibir a seção de eventos.

4.  **Refatoração e Limpeza:**
    *   Após mover a lógica para o dashboard, a página `frontend/src/app/events/page.tsx` provavelmente se tornará redundante. Avaliar sua remoção para simplificar a base de código.

5.  **Validação:**
    *   Garantir que a lista de eventos carregue corretamente no dashboard.
    *   Verificar se o restante do conteúdo do dashboard permanece funcional.
    *   Testar a navegação para confirmar que a experiência do usuário está fluida e de acordo com o objetivo.
