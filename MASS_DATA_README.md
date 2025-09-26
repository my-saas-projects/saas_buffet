# 🎯 Script de Inserção de Dados em Massa - BuffetFlow

Este script cria dados de teste em massa para o sistema BuffetFlow, permitindo testar todas as funcionalidades e telas do sistema.

## 📋 O que o script cria

### 🏢 Empresas e Usuários
- **5 empresas** com dados completos (CNPJ, endereço, configurações)
- **Usuários** para cada empresa:
  - 1 proprietário (owner)
  - 1-3 gerentes (manager) 
  - 1-3 membros da equipe (staff)
- **Credenciais**: Todos os usuários têm senha `teste123`

### 🎉 Eventos
- **15 eventos por empresa** (75 eventos total)
- **Tipos**: Casamento, Formatura, Aniversário, Corporativo, Outro
- **Status**: Proposta Pendente, Enviada, Aceita, Em Execução, Concluído
- **Dados**: Cliente, local, data, horário, número de convidados, preços

### 🍽️ Cardápio
- **Itens de cardápio** para cada empresa:
  - Entradas (3-6 itens)
  - Pratos principais (3-6 itens)
  - Acompanhamentos (3-6 itens)
  - Sobremesas (3-6 itens)
  - Bebidas (3-6 itens)
- **Preços**: Custo e preço por pessoa calculados automaticamente
- **Associações**: Cada evento tem 5-15 itens do cardápio

### 💰 Financeiro
- **Transações**: Receitas e despesas para cada empresa
- **Cálculos de custo**: Para eventos aceitos/em execução/concluídos
- **Orçamentos**: Para eventos com propostas pendentes/enviadas/aceitas
- **Dados realistas**: Valores baseados no tipo e tamanho dos eventos

### 🔔 Notificações e Auditoria
- **Notificações**: Conflitos, lembretes, pagamentos pendentes
- **Logs de auditoria**: Registro de todas as ações dos usuários
- **Dados históricos**: Atividades dos últimos 60 dias

## 🚀 Como executar

### Opção 1: Script automatizado (Recomendado)
```bash
./install_and_run.sh
```

### Opção 2: Execução manual
```bash
# 1. Instalar dependências
cd backend
source venv_saas_buffet/bin/activate
pip install faker

# 2. Executar script
cd ..
python3 insert_mass_data.py
```

## 📊 Dados criados

Após a execução, você terá:

- **5 empresas** com dados completos
- **~20 usuários** (4 por empresa em média)
- **75 eventos** distribuídos entre as empresas
- **~200 itens de cardápio** (40 por empresa)
- **~300 transações financeiras**
- **~50 cálculos de custo**
- **~60 orçamentos**
- **~100 notificações**
- **~500 logs de auditoria**

## 🧪 Testando o sistema

### 1. Acesse o Admin Django
```
http://localhost:8000/admin/
```

### 2. Faça login com qualquer usuário criado
- **Email**: Qualquer email gerado pelo script
- **Senha**: `teste123`

### 3. Teste as funcionalidades
- ✅ **Dashboard**: Visualize métricas e gráficos
- ✅ **Eventos**: Crie, edite, visualize eventos
- ✅ **Cardápio**: Gerencie itens e associações
- ✅ **Financeiro**: Veja transações e relatórios
- ✅ **Orçamentos**: Crie e gerencie propostas
- ✅ **Notificações**: Teste sistema de alertas
- ✅ **Usuários**: Gerencie equipe e permissões

## 🔧 Personalização

Para modificar a quantidade de dados criados, edite o arquivo `insert_mass_data.py`:

```python
# Linha 45: Número de empresas
self.create_companies_and_users(num_companies=5)

# Linha 95: Eventos por empresa  
self.create_events(num_events_per_company=15)
```

## ⚠️ Importante

- **Backup**: Faça backup do banco antes de executar
- **Desenvolvimento**: Use apenas em ambiente de desenvolvimento
- **Dados fake**: Todos os dados são gerados automaticamente
- **Senhas**: Todos os usuários têm senha `teste123`

## 🐛 Solução de problemas

### Erro de importação Django
```bash
cd backend
source venv_saas_buffet/bin/activate
python manage.py migrate
```

### Erro de dependências
```bash
pip install faker django
```

### Erro de permissão
```bash
chmod +x install_and_run.sh
```

## 📈 Próximos passos

Após executar o script:

1. **Teste todas as telas** do sistema
2. **Verifique os relatórios** financeiros
3. **Teste os fluxos** de eventos
4. **Valide as notificações** e alertas
5. **Confirme os cálculos** de custo e preço

---

🎉 **Agora você tem dados suficientes para testar completamente o sistema BuffetFlow!**
