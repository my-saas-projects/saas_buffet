# Plano de Melhoria para a Página de Agenda

Este plano detalha as etapas para aprimorar a aparência e a usabilidade da página de Agenda, utilizando as diretrizes de frontend do projeto e os componentes do `shadcn/ui`.

## 1. Revisão e Refinamento do Layout Geral

- **Container Principal:** Envolver o calendário em um componente `<Card>` do `shadcn/ui` para criar uma borda e uma sombra sutis, destacando-o do fundo da página.
- **Cabeçalho da Página:** Aprimorar o cabeçalho, mantendo o título "Agenda de Eventos", mas adicionando um subtítulo mais descritivo.
- **Legenda de Status:** Adicionar uma legenda visual para as cores dos status dos eventos. Isso pode ser feito com uma série de componentes `<Badge>` ao lado ou abaixo do calendário, explicando o que cada cor significa (ex: Proposta Pendente, Concluído).

## 2. Aprimoramento da Aparência do Calendário

- **Estilo dos Eventos:** Customizar a aparência dos eventos no calendário para que fiquem mais alinhados com a identidade visual do `shadcn/ui`. Isso inclui o uso de cores de fundo baseadas no status do evento e a garantia de que o texto seja legível.
- **Tooltips:** Adicionar tooltips aos eventos que aparecem ao passar o mouse, exibindo um resumo rápido do evento (título, horário e cliente).

## 3. Melhoria do Modal de Detalhes do Evento

- **Layout do Modal:** Redesenhar o layout do modal para uma apresentação mais limpa e organizada das informações.
- **Ícones e Informações:** Utilizar ícones de forma mais eficaz para cada detalhe do evento (data, hora, cliente, tipo de evento, status).
- **Botões de Ação:** Melhorar o design e o posicionamento dos botões "Ver Detalhes" e "Fechar". Adicionar um botão "Ir para o Cliente" se o cliente estiver associado ao evento.

## 4. Adição de Elementos Interativos

- **Criação Rápida de Eventos:** Implementar a função `handleDateSelect` para permitir que os usuários criem um novo evento clicando diretamente em uma data no calendário. Isso pode abrir um formulário em um novo modal.
- **Navegação do Calendário:** Adicionar botões de ação no cabeçalho do calendário, como "Hoje" para retornar à data atual e seletores de visualização (Mês, Semana, Dia).

## 5. Refatoração e Limpeza do Código

- **Tipagem:** Garantir que todos os componentes e funções estejam devidamente tipados com TypeScript.
- **Otimização:** Revisar o código para identificar possíveis melhorias de desempenho e legibilidade.
