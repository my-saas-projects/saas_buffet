flowchart TD
    Start([Usuário Acessa BuffetFlow]) --> Login{Já tem conta?}
    
    Login -->|Sim| LoginForm[Fazer Login]
    Login -->|Não| Register[Criar Conta]
    
    Register --> Onboarding[Onboarding Guiado<br/>- Dados do Buffet<br/>- Config Básicas]
    LoginForm --> Dashboard
    Onboarding --> Dashboard
    
    Dashboard[Dashboard Principal<br/>📊 Visão Geral] --> MenuOpcoes{Escolher Ação}
    
    MenuOpcoes --> Eventos[📅 Gestão de Eventos]
    MenuOpcoes --> Financeiro[💰 Controle Financeiro]
    MenuOpcoes --> Agenda[📆 Agenda Visual]
    MenuOpcoes --> Config[⚙️ Configurações]
    
    %% Fluxo de Eventos
    Eventos --> EventosAcao{Ação Desejada}
    EventosAcao --> NovoEvento[Criar Novo Evento]
    EventosAcao --> ListarEventos[Ver Eventos Existentes]
    
    NovoEvento --> FormEvento[Formulário Rápido<br/>- Data e Horário<br/>- Tipo de Evento<br/>- Nº Convidados<br/>- Cardápio Básico]
    FormEvento --> ValidarConflito{Verificar<br/>Conflitos de Data}
    ValidarConflito -->|Conflito| AlertaConflito[❌ Alerta de Conflito<br/>Sugerir Datas]
    ValidarConflito -->|OK| SalvarEvento[✅ Evento Salvo]
    AlertaConflito --> FormEvento
    SalvarEvento --> GerarOrcamento{Gerar Orçamento?}
    
    ListarEventos --> DetalheEvento[Ver Detalhes<br/>do Evento]
    DetalheEvento --> EditarEvento[Editar Informações]
    EditarEvento --> FormEvento
    
    %% Fluxo Financeiro
    Financeiro --> CalcCustos[Calculadora de Custos]
    CalcCustos --> InputCustos[Inserir Dados<br/>- Ingredientes<br/>- Mão de Obra<br/>- Outros Custos]
    InputCustos --> ResultadoCalc[Visualizar<br/>- Custo Total<br/>- Margem Projetada<br/>- Preço Sugerido]
    ResultadoCalc --> AjustarPreco{Ajustar Preço?}
    AjustarPreco -->|Sim| InputCustos
    AjustarPreco -->|Não| SalvarCusto[Salvar Cálculo]
    
    %% Geração de Orçamento
    GerarOrcamento -->|Sim| ConfigOrcamento[Configurar Orçamento<br/>- Template<br/>- Logo<br/>- Dados do Cliente]
    GerarOrcamento -->|Não| Dashboard
    ConfigOrcamento --> PreviewPDF[Visualizar PDF]
    PreviewPDF --> AprovarPDF{Aprovar?}
    AprovarPDF -->|Sim| ExportarPDF[📄 Exportar PDF]
    AprovarPDF -->|Não| ConfigOrcamento
    ExportarPDF --> EnviarCliente[Enviar para Cliente<br/>via WhatsApp/Email]
    
    %% Fluxo da Agenda
    Agenda --> ViewCalendario[Calendário Interativo]
    ViewCalendario --> FiltroView{Visualização}
    FiltroView --> MesView[Visão Mensal]
    FiltroView --> SemanaView[Visão Semanal]
    FiltroView --> DiaView[Visão Diária]
    
    MesView --> VerDisponibilidade[Ver Disponibilidade<br/>🟢 Livre<br/>🟡 Parcial<br/>🔴 Ocupado]
    SemanaView --> VerDisponibilidade
    DiaView --> VerDisponibilidade
    
    VerDisponibilidade --> ClicarData{Clicar em Data}
    ClicarData -->|Data Livre| NovoEvento
    ClicarData -->|Data Ocupada| DetalheEvento
    
    %% Fluxo de Configurações
    Config --> ConfigOpcoes{Configurar}
    ConfigOpcoes --> DadosEmpresa[Dados da Empresa]
    ConfigOpcoes --> Integracao[Integrações<br/>- WhatsApp<br/>- Google Calendar]
    ConfigOpcoes --> ExportDados[Exportar Dados<br/>para Excel]
    
    %% Retornos ao Dashboard
    SalvarEvento --> Dashboard
    EnviarCliente --> Dashboard
    SalvarCusto --> Dashboard
    DadosEmpresa --> Dashboard
    Integracao --> Dashboard
    ExportDados --> Dashboard
    
    %% Notificações e Alertas
    Dashboard --> Notificacoes[🔔 Notificações<br/>- Prazos Próximos<br/>- Conflitos<br/>- Lembretes]
    
    %% Estilos
    style Start fill:#e1f5fe
    style Dashboard fill:#fff3e0
    style NovoEvento fill:#c8e6c9
    style CalcCustos fill:#ffe0b2
    style ExportarPDF fill:#d1c4e9
    style AlertaConflito fill:#ffcdd2
    style SalvarEvento fill:#c8e6c9
    style Notificacoes fill:#fff9c4
