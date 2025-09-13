# **Documento de Requisitos de Produto (PRD) para Micro SaaS de Gestão de Buffets de Festas**

## **1. Visão Geral**

### **Nome do Produto**
BuffetFlow (ou nome provisório: Sistema de Gestão para Buffets de Festas).

### **Descrição**
BuffetFlow é um Micro SaaS especializado na gestão de buffets de festas, focado em resolver dores como controle financeiro caótico, agenda desorganizada e estoque ineficiente. Projetado para ser simples, acessível e escalável, o produto atende buffets pequenos e médios que lidam com eventos sociais (casamentos, formaturas, aniversários). Ele opera no modelo SaaS com assinatura mensal, priorizando automação e integração para reduzir erros e aumentar a lucratividade.

### **Versão do PRD**
1.0 (Data: 12 de setembro de 2025).

### **Equipe Responsável**
- Product Owner: [Seu Nome ou AI Assistant]
- Desenvolvedores: Equipe de 2-3 devs (foco em Python/Django para backend, React para frontend).
- Stakeholders: Empresários de buffets (baseado em pesquisas de mercado).

### **Objetivo do PRD**
Definir os requisitos para o desenvolvimento de um MVP viável na Fase 1, com roadmap para expansões futuras, garantindo um produto lean que valide o mercado rapidamente.

## **2. Problema a Resolver**

### **Contexto do Mercado**
- O setor de buffets no Brasil tem mais de 15.000 empresas, com faturamento anual de R$ 12 bilhões, mas 60% enfrentam falências por má gestão financeira e operacional.
- Dores principais: Falta de controle de custos por evento, agenda manual com conflitos, desperdício de estoque e precificação imprecisa.
- Soluções existentes (ex.: TPA Buffet, BuffetMax) são complexas e caras para buffets pequenos, com baixa adoção tecnológica (80% usam planilhas).

### **Problema Principal**
Buffets perdem dinheiro e clientes devido à falta de uma ferramenta simples para gerenciar eventos de forma integrada, levando a erros operacionais, desperdícios e baixa margem de lucro.

### **Oportunidade**
Um Micro SaaS acessível (R$ 297-997/mês) pode capturar 500-1.000 clientes em 1-2 anos, gerando ARR de R$ 500k-1M, focando em simplicidade e ROI imediato.

## **3. Público-Alvo**

### **Persona Primária**
- **Nome**: Ana, proprietária de buffet médio.
- **Idade**: 35-50 anos.
- **Perfil**: Gerencia 5-20 eventos/mês, faturamento R$ 50k-200k/mês, equipe de 5-15 pessoas. Não é técnica, usa WhatsApp e Excel para gestão.
- **Necessidades**: Controle rápido de agenda, custos e estoque sem curva de aprendizado alta.
- **Dor**: Perde 15-20% em desperdício e erra precificação em 30% dos eventos.

### **Persona Secundária**
- **Nome**: João, coordenador de eventos em buffet pequeno.
- **Perfil**: Foca em operações diárias, precisa de mobilidade e alertas em tempo real.

### **Tamanho do Mercado**
- Buffets pequenos/médios: 10.000+ no Brasil.
- Segmentos: Casamentos (60%), formaturas (20%), aniversários (20%).

## **4. Objetivos e Métricas de Sucesso**

### **Objetivos Gerais**
- Reduzir erros operacionais em 50% para usuários.
- Aumentar margem de lucro em 20% via controle de custos.
- Validar MVP com 50 usuários pagantes em 3 meses.

### **Métricas Chave (KPIs)**
- **Aquisição**: 100 sign-ups no lançamento; taxa de conversão de trial para pago: 30%.
- **Retenção**: Churn mensal < 5%; NPS > 8/10.
- **Financeiro**: ARR de R$ 100k nos primeiros 6 meses.
- **Uso**: 80% dos usuários acessam diariamente; redução de 30% no tempo de gestão por evento.

## **5. Funcionalidades e Requisitos**

O produto será dividido em fases. **Fase 1 (MVP)** foca em funcionalidades essenciais para validar o core value: gestão financeira e agenda simples. Expansões em fases subsequentes adicionam complexidade.

### **Fase 1: MVP (Versão Mínima Viável)**
- **Objetivo**: Lançar em 2-3 meses, validar com 20-50 beta users, focar em ROI rápido.
- **Requisitos Funcionais**:
  - **Cadastro de Eventos**: Criação simples de eventos com data, tipo (casamento, formatura, aniversário), número de convidados e cardápio básico.
  - **Agenda Visual**: Calendário interativo com visão mensal/semanal, alertas de conflitos e disponibilidade automática.
  - **Calculadora de Custos**: Ferramenta para estimar custos por evento (ingredientes, mão de obra, margem projetada). Integração básica com planilhas de custos.
  - **Orçamentos Automatizados**: Geração de propostas em PDF com precificação dinâmica baseada em inputs do usuário.
  - **Dashboard Simples**: Visão geral de eventos futuros, fluxo de caixa projetado e alertas de prazos.
- **Requisitos Não Funcionais**:
  - **Usabilidade**: Interface mobile-first, intuitiva (sem treinamento > 10 min).
  - **Segurança**: Autenticação básica (email/senha), dados criptografados.
  - **Integrações**: Exportação para Excel; API simples para WhatsApp (alertas).
  - **Limitações do MVP**: Até 50 eventos/mês; sem estoque avançado.

### **Fase 2: Expansão Básica (Pós-Validação, +3 meses)**
- **Novas Funcionalidades**:
  - Controle de Estoque: Previsão de compras e alertas de validade.
  - Gestão de Equipe: Escalas automáticas e atribuição de tarefas.
  - Relatórios Financeiros: Análise de margem real vs. projetada.
  - Integrações: WhatsApp para notificações; Google Calendar.

### **Fase 3: Avançado (6-12 meses)**
- **Funcionalidades Premium**:
  - IA para Previsão: Sugestões de cardápios e otimização de custos.
  - Portal do Cliente: Acesso para noivos/formandos acompanharem o progresso.
  - Contratos Digitais: Assinatura eletrônica integrada.
  - Analytics Avançado: Relatórios de sazonalidade e fidelização.

## **6. Histórias de Usuário**

### **Fase 1 (MVP)**
- Como proprietário de buffet, quero cadastrar um novo evento rapidamente para não perder oportunidades de venda. (Critério: Formulário com < 10 campos, salvamento em < 1 min).
- Como gerente, quero visualizar a agenda para evitar conflitos de datas. (Critério: Calendário colorido com alertas vermelhos para overlaps).
- Como dono, quero calcular custos de um evento para precificar corretamente. (Critério: Input de convidados/cardápio gera estimativa de custo/margem em segundos).
- Como usuário, quero gerar orçamentos em PDF para enviar a clientes. (Critério: Template personalizável com logo e exportação automática).

### **Fases Futuras**
- Como coordenador, quero prever compras de estoque para evitar desperdícios. (Fase 2).
- Como proprietário, quero relatórios de fluxo de caixa para planejar sazonalidade. (Fase 3).

## **7. Requisitos Técnicos**

### **Tecnologia Stack (Lean para Micro SaaS)**
- **Backend**: Python/Django (simples e escalável).
- **Frontend**: React.js (para interfaces responsivas).
- **Banco de Dados**: PostgreSQL (gratuito e robusto).
- **Hospedagem**: Railway ou Vercel (custo baixo, ~R$ 50/mês inicial).
- **Autenticação**: Firebase ou Auth0.
- **Integrações**: Google Sheets para import/export; Twilio para WhatsApp.
- **Segurança**: HTTPS, GDPR-like para dados de clientes.
- **Escalabilidade**: Projetado para 1.000 usuários iniciais; custo < R$ 200/mês em nuvem.

### **Requisitos de Desempenho**
- Tempo de resposta: < 2s por ação.
- Disponibilidade: 99% uptime.
- Mobile: 100% responsivo.

## **8. Cronograma e Roadmap**

### **Fase 1 (MVP): 2-3 Meses**
- **Mês 1**: Planejamento, wireframes e protótipo.
- **Mês 2**: Desenvolvimento core e testes internos.
- **Mês 3**: Beta testing com 20 usuários, lançamento público.
- **Custo Estimado**: R$ 20.000-50.000 (devs freelancers).

### **Roadmap Geral**
- **Q4 2025**: Lançamento MVP e aquisição de 50 clientes.
- **Q1 2026**: Fase 2, com feedback de usuários.
- **Q2 2026**: Fase 3, expansão para integrações avançadas.

## **9. Riscos e Assunções**

### **Riscos**
- **Adoção baixa**: Mitigação: Trial gratuito de 14 dias e onboarding guiado.
- **Concorrência**: Sistemas como TPA Buffet são caros; diferenciar por simplicidade.
- **Mudanças regulatórias**: Legislação de eventos; monitorar e adaptar.
- **Técnicos**: Dependência de integrações externas; ter backups manuais.

### **Assunções**
- Usuários têm acesso básico a internet/smartphones.
- Mercado valida o MVP com 20% de conversão de trials.
- Foco inicial no Brasil (idioma português).
