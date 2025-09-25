# Plano de Melhoria Visual dos Status de Evento

**Agente Responsável:** Agente Desenvolvedor Frontend

**Objetivo:** Diferenciar os status dos eventos, atribuindo uma cor única e visualmente distinta para cada um. Isso melhorará a experiência do usuário, permitindo uma avaliação mais rápida e intuitiva da lista de eventos.

**Análise:**

*   O componente responsável pela exibição da lista de eventos é o `frontend/src/components/events/events-list.tsx`.
*   Este componente utiliza o componente `<Badge>` para exibir o status do evento.
*   A cor do badge é determinada pela função `getStatusColor`, que, por sua vez, utiliza o objeto `EVENT_STATUS_COLORS` definido em `frontend/src/lib/constants.ts`.
*   As cores atuais são baseadas em um fundo claro com texto escuro (ex: `bg-yellow-100 text-yellow-800`).

**Plano de Ação:**

1.  **Modificar o mapeamento de cores:**
    *   O arquivo a ser modificado é o `frontend/src/lib/constants.ts`.
    *   O objeto `EVENT_STATUS_COLORS` será atualizado com cores mais vibrantes e distintas, utilizando as classes de cores do TailwindCSS.

2.  **Novo Mapeamento de Cores Proposto:**

| Status | Cor Antiga | Nova Cor |
| --- | --- | --- |
| `PROPOSTA_PENDENTE` | `bg-yellow-100 text-yellow-800` | `bg-yellow-500 text-white` |
| `PROPOSTA_ENVIADA` | `bg-blue-100 text-blue-800` | `bg-blue-500 text-white` |
| `PROPOSTA_RECUSADA` | `bg-red-100 text-red-800` | `bg-red-500 text-white` |
| `PROPOSTA_ACEITA` | `bg-green-100 text-green-800` | `bg-green-500 text-white` |
| `EM_EXECUCAO` | `bg-purple-100 text-purple-800` | `bg-purple-500 text-white` |
| `POS_EVENTO` | `bg-indigo-100 text-indigo-800` | `bg-indigo-500 text-white` |
| `CONCLUIDO` | `bg-gray-100 text-gray-800` | `bg-gray-500 text-white` |

**Passos de Implementação:**

1.  Abrir o arquivo `frontend/src/lib/constants.ts`.
2.  Localizar o objeto `EVENT_STATUS_COLORS`.
3.  Substituir os valores das cores existentes pelos novos valores definidos na tabela acima.
4.  Salvar o arquivo.
5.  (Opcional) Executar a aplicação em ambiente de desenvolvimento para verificar visualmente se as cores foram aplicadas corretamente.

**Justificativa:**

A utilização de cores sólidas e vibrantes para os status melhorará a legibilidade e a identificação rápida do estado de cada evento, tornando a interface mais amigável e eficiente para o usuário.
