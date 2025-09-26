# Plano de Implementação: Geração de Orçamentos em PDF

**Agente Responsável:** Agente de Gerente de Projeto

## 1. Objetivo

Implementar a funcionalidade de geração de orçamentos em formato PDF para os eventos cadastrados na plataforma. O sistema deve permitir que os usuários exportem um orçamento detalhado para um evento específico, que possa ser facilmente compartilhado com os clientes.

## 2. Critérios de Aceite

-   **Geração de PDF:** Deve haver um endpoint na API que, ao receber o ID de um evento, gere um arquivo PDF.
-   **Conteúdo do Orçamento:** O PDF deve conter informações essenciais do evento, como dados do cliente, data, local, serviços contratados, valor total e data de validade da proposta.
-   **Template Personalizável (Fase 1):** O template do PDF deve incluir o logotipo da empresa do usuário. Buscar um logo de buffet na internet.
-   **Interface do Usuário:** A interface de frontend deve apresentar um botão "Gerar Orçamento em PDF" na página de detalhes de um evento.
-   **Exportação Automática:** Ao clicar no botão, o download do arquivo PDF deve ser iniciado automaticamente no navegador do usuário.

## 3. Planejamento Técnico

A implementação será dividida em duas frentes: Backend (API) e Frontend (Interface do Usuário).

### 3.1. Backend (Django)

1.  **Seleção de Biblioteca:**
    -   Utilizaremos a biblioteca `ReportLab` para a geração dos PDFs em Python, por sua flexibilidade e por não depender de um navegador headless.

2.  **Atualização de Modelos:**
    -   Verificar o modelo `Company` (app `users`) e garantir que exista um campo para o upload do logotipo (ex: `logo = models.ImageField(upload_to='logos/')`). Se não existir, criar a migração necessária.

3.  **Criação do Endpoint da API:**
    -   **URL:** Criar um novo endpoint em `events/urls.py`:
        ```
        GET /api/events/<int:event_id>/generate-proposal-pdf/
        ```
    -   **View:** Desenvolver uma nova `APIView` em `events/views.py` para manipular essa requisição.
        -   A view receberá o `event_id` como parâmetro.
        -   Buscará os dados completos do evento, do cliente associado e da empresa (incluindo o logo).
        -   Retornará uma `HttpResponse` com o conteúdo do PDF gerado e o `Content-Type` apropriado (`application/pdf`).

4.  **Lógica de Geração do PDF:**
    -   Criar um novo módulo de serviço (ex: `events/pdf_service.py`).
    -   A função principal receberá o objeto `Event` como argumento.
    -   A lógica irá:
        -   Criar um canvas do `ReportLab`.
        -   Desenhar o logotipo da empresa no cabeçalho.
        -   Adicionar os dados da empresa (nome, endereço, contato).
        -   Adicionar os dados do cliente.
        -   Listar os detalhes do evento: data, hora, local, número de convidados.
        -   Apresentar uma tabela com os itens/serviços do orçamento e seus valores.
        -   Exibir o valor total e a data de validade da proposta.
        -   Salvar o PDF em um buffer de memória (`io.BytesIO`) para ser retornado na resposta HTTP.

### 3.2. Frontend (Next.js)

1.  **Atualização da Interface:**
    -   Na página de detalhes do evento (provavelmente em `src/components/events/EventDetails.tsx` ou similar), adicionar um novo botão: `"Gerar Orçamento"`.

2.  **Chamada de API:**
    -   No `src/services/api.ts`, adicionar uma nova função para buscar o PDF.
        ```typescript
        export const generateEventProposalPDF = async (eventId: number): Promise<Blob> => {
          const response = await apiClient.get(`/events/${eventId}/generate-proposal-pdf/`, {
            responseType: 'blob', // Importante para tratar a resposta como um arquivo
          });
          return response.data;
        };
        ```

3.  **Lógica de Download:**
    -   O componente do botão no frontend chamará a função `generateEventProposalPDF`.
    -   Ao receber a resposta (`Blob`), o código irá:
        -   Criar uma URL de objeto para o Blob (`URL.createObjectURL(blob)`).
        -   Criar um elemento `<a>` invisível no DOM.
        -   Definir o `href` do link para a URL do objeto e o atributo `download` com um nome de arquivo sugestivo (ex: `orcamento-evento-123.pdf`).
        -   Simular um clique no link para iniciar o download.
        -   Revogar a URL do objeto (`URL.revokeObjectURL(url)`) para liberar memória.

## 4. Próximos Passos (Pós-Implementação)

-   **Testes:** Criar testes unitários para o serviço de geração de PDF no backend e testes de integração para o endpoint.
-   **Melhoria Futura:** Evoluir o template para ser mais personalizável, talvez permitindo que o usuário escolha cores ou edite seções de texto através da interface, com os dados salvos no banco.
