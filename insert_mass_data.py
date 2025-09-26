#!/usr/bin/env python3
"""
Script para inserção de dados em massa no sistema BuffetFlow
Cria dados de teste para todas as funcionalidades do sistema
"""

import os
import sys
import django
from datetime import datetime, date, time, timedelta
from decimal import Decimal
import random
from faker import Faker

# Configurar Django
sys.path.append('/home/ederfp/Projetos/saas_buffet/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buffetflow.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Company
from events.models import Event, MenuItem, EventMenu
from financials.models import FinancialTransaction, CostCalculation, Quote, Notification, AuditLog

User = get_user_model()
fake = Faker('pt_BR')

class MassDataInserter:
    def __init__(self):
        self.companies = []
        self.users = []
        self.events = []
        self.menu_items = []
        
    def create_companies_and_users(self, num_companies=5):
        """Cria empresas e usuários associados"""
        print("🏢 Criando empresas e usuários...")
        
        for i in range(num_companies):
            # Criar empresa
            company = Company.objects.create(
                name=fake.company(),
                business_name=fake.company(),
                cnpj=fake.cnpj(),
                email=fake.company_email(),
                phone=fake.phone_number(),
                website=fake.url(),
                address=fake.street_address(),
                city=fake.city(),
                state=fake.state_abbr(),
                postal_code=fake.postcode(),
                default_profit_margin=Decimal(random.uniform(25, 45)),
                max_events_per_month=random.randint(20, 100),
                is_active=True
            )
            self.companies.append(company)
            
            # Criar usuário proprietário
            owner = User.objects.create_user(
                username=fake.user_name(),
                email=fake.email(),
                password='teste123',
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                phone=fake.phone_number(),
                role='owner',
                company=company,
                is_active=True
            )
            self.users.append(owner)
            
            # Criar usuários gerentes e equipe
            for role in ['manager', 'staff']:
                for j in range(random.randint(1, 3)):
                    user = User.objects.create_user(
                        username=fake.user_name(),
                        email=fake.email(),
                        password='teste123',
                        first_name=fake.first_name(),
                        last_name=fake.last_name(),
                        phone=fake.phone_number(),
                        role=role,
                        company=company,
                        is_active=True
                    )
                    self.users.append(user)
            
            print(f"✅ Empresa '{company.name}' criada com {len([u for u in self.users if u.company == company])} usuários")
    
    def create_menu_items(self):
        """Cria itens de cardápio para cada empresa"""
        print("🍽️ Criando itens de cardápio...")
        
        menu_templates = {
            'appetizer': [
                'Canapés de Salmão', 'Bruschetta Italiana', 'Coxinhas de Frango',
                'Bolinho de Bacalhau', 'Mini Quiches', 'Tábua de Frios',
                'Petiscos Mediterrâneos', 'Vol-au-vent', 'Croquetas de Camarão'
            ],
            'main': [
                'Filé Mignon ao Molho Madeira', 'Salmão Grelhado', 'Frango à Parmegiana',
                'Costela de Porco', 'Lasanha Bolonhesa', 'Risotto de Cogumelos',
                'Peixe ao Molho de Maracujá', 'Strogonoff de Frango', 'Moqueca de Peixe'
            ],
            'side': [
                'Arroz Branco', 'Batata Rústica', 'Legumes Grelhados',
                'Purê de Batata', 'Salada Verde', 'Farofa de Banana',
                'Polenta Cremosa', 'Cuscuz Marroquino', 'Vegetais no Vapor'
            ],
            'dessert': [
                'Tiramisu', 'Pudim de Leite', 'Mousse de Chocolate',
                'Torta de Limão', 'Petit Gateau', 'Cheesecake de Morango',
                'Pavê de Chocolate', 'Sorvete Artesanal', 'Brownie com Sorvete'
            ],
            'beverage': [
                'Suco de Laranja Natural', 'Refrigerantes', 'Água Mineral',
                'Cerveja Nacional', 'Vinho Tinto', 'Caipirinha',
                'Champagne', 'Café Expresso', 'Chá Gelado'
            ]
        }
        
        for company in self.companies:
            company_menu_items = []
            for category, items in menu_templates.items():
                for item_name in random.sample(items, random.randint(3, 6)):
                    cost_per_person = Decimal(random.uniform(5, 25))
                    price_per_person = cost_per_person * Decimal(random.uniform(1.3, 2.0))
                    
                    menu_item = MenuItem.objects.create(
                        company=company,
                        name=item_name,
                        category=category,
                        description=fake.text(max_nb_chars=100),
                        cost_per_person=cost_per_person,
                        price_per_person=price_per_person,
                        is_active=True,
                        seasonal=random.choice([True, False])
                    )
                    company_menu_items.append(menu_item)
            
            self.menu_items.extend(company_menu_items)
            print(f"✅ {len(company_menu_items)} itens de cardápio criados para '{company.name}'")
    
    def create_events(self, num_events_per_company=15):
        """Cria eventos para cada empresa"""
        print("🎉 Criando eventos...")
        
        event_types = ['wedding', 'graduation', 'birthday', 'corporate', 'other']
        statuses = ['proposta_pendente', 'proposta_enviada', 'proposta_aceita', 'em_execucao', 'concluido']
        
        for company in self.companies:
            company_users = [u for u in self.users if u.company == company]
            
            for i in range(num_events_per_company):
                event_date = fake.date_between(start_date='-30d', end_date='+90d')
                start_time = time(random.randint(8, 18), random.choice([0, 30]))
                end_time = time(start_time.hour + random.randint(3, 8), start_time.minute)
                
                event_type = random.choice(event_types)
                status = random.choice(statuses)
                
                # Definir preços baseado no status
                estimated_cost = Decimal(random.uniform(2000, 15000))
                final_price = None
                value = None
                
                if status in ['proposta_aceita', 'em_execucao', 'concluido']:
                    final_price = estimated_cost * Decimal(random.uniform(1.2, 1.8))
                    value = final_price
                
                event = Event.objects.create(
                    company=company,
                    created_by=random.choice(company_users),
                    title=f"{fake.catch_phrase()} - {event_type.title()}",
                    event_type=event_type,
                    description=fake.text(max_nb_chars=200),
                    client_name=fake.name(),
                    client_email=fake.email(),
                    client_phone=fake.phone_number(),
                    event_date=event_date,
                    start_time=start_time,
                    end_time=end_time,
                    guest_count=random.randint(20, 300),
                    venue_location=fake.address(),
                    status=status,
                    proposal_validity_date=event_date + timedelta(days=random.randint(7, 30)),
                    estimated_cost=estimated_cost,
                    final_price=final_price,
                    value=value,
                    special_requirements=fake.text(max_nb_chars=150),
                    notes=fake.text(max_nb_chars=100)
                )
                self.events.append(event)
            
            print(f"✅ {num_events_per_company} eventos criados para '{company.name}'")
    
    def create_event_menus(self):
        """Associa itens de cardápio aos eventos"""
        print("🍴 Associando cardápios aos eventos...")
        
        for event in self.events:
            company_menu_items = [item for item in self.menu_items if item.company == event.company]
            
            # Selecionar itens aleatórios para o evento
            selected_items = random.sample(
                company_menu_items, 
                random.randint(5, min(15, len(company_menu_items)))
            )
            
            for menu_item in selected_items:
                EventMenu.objects.create(
                    event=event,
                    menu_item=menu_item,
                    quantity=random.randint(1, 3)
                )
        
        print(f"✅ Cardápios associados a {len(self.events)} eventos")
    
    def create_financial_transactions(self):
        """Cria transações financeiras"""
        print("💰 Criando transações financeiras...")
        
        transaction_types = ['INCOME', 'EXPENSE']
        statuses = ['PENDING', 'COMPLETED', 'CANCELED']
        
        for company in self.companies:
            company_events = [e for e in self.events if e.company == company]
            
            # Criar transações de receita (eventos concluídos)
            for event in company_events:
                if event.status == 'concluido' and event.value:
                    FinancialTransaction.objects.create(
                        description=f"Pagamento evento: {event.title}",
                        amount=event.value,
                        transaction_type='INCOME',
                        transaction_date=event.event_date + timedelta(days=random.randint(1, 7)),
                        status='COMPLETED',
                        related_event=event
                    )
            
            # Criar transações de despesas
            for i in range(random.randint(20, 50)):
                transaction_type = random.choice(transaction_types)
                amount = Decimal(random.uniform(50, 2000))
                
                descriptions = {
                    'INCOME': [
                        'Pagamento de evento', 'Pagamento antecipado', 'Taxa de serviço',
                        'Pagamento adicional', 'Gorjeta recebida'
                    ],
                    'EXPENSE': [
                        'Compra de ingredientes', 'Salário da equipe', 'Combustível',
                        'Aluguel de equipamentos', 'Marketing', 'Manutenção',
                        'Seguro', 'Conta de luz', 'Conta de água', 'Telefone'
                    ]
                }
                
                FinancialTransaction.objects.create(
                    description=random.choice(descriptions[transaction_type]),
                    amount=amount,
                    transaction_type=transaction_type,
                    transaction_date=fake.date_between(start_date='-60d', end_date='today'),
                    status=random.choice(statuses),
                    related_event=random.choice(company_events) if company_events and random.choice([True, False]) else None
                )
        
        print("✅ Transações financeiras criadas")
    
    def create_cost_calculations(self):
        """Cria cálculos de custo para eventos"""
        print("📊 Criando cálculos de custo...")
        
        for event in self.events:
            if event.status in ['proposta_aceita', 'em_execucao', 'concluido']:
                food_cost = Decimal(random.uniform(500, 3000))
                beverage_cost = Decimal(random.uniform(200, 1500))
                staff_cost = Decimal(random.uniform(800, 4000))
                service_hours = Decimal(random.uniform(6, 12))
                hourly_rate = staff_cost / service_hours
                
                CostCalculation.objects.create(
                    event=event,
                    calculated_by=event.created_by,
                    food_cost=food_cost,
                    beverage_cost=beverage_cost,
                    staff_cost=staff_cost,
                    service_hours=service_hours,
                    hourly_rate=hourly_rate,
                    equipment_cost=Decimal(random.uniform(100, 800)),
                    transportation_cost=Decimal(random.uniform(50, 500)),
                    venue_cost=Decimal(random.uniform(0, 2000)),
                    other_costs=Decimal(random.uniform(50, 300)),
                    profit_margin_percentage=Decimal(random.uniform(25, 45))
                )
        
        print("✅ Cálculos de custo criados")
    
    def create_quotes(self):
        """Cria orçamentos para eventos"""
        print("📋 Criando orçamentos...")
        
        quote_statuses = ['draft', 'sent', 'approved', 'rejected', 'expired']
        
        for event in self.events:
            if event.status in ['proposta_pendente', 'proposta_enviada', 'proposta_aceita']:
                status = random.choice(quote_statuses)
                
                # Calcular valores baseados no evento
                base_cost = event.estimated_cost or Decimal(random.uniform(2000, 10000))
                profit_margin = Decimal(random.uniform(25, 45))
                total_price = base_cost * (1 + profit_margin / 100)
                
                quote = Quote.objects.create(
                    event=event,
                    created_by=event.created_by,
                    total_cost=base_cost,
                    profit_margin=profit_margin,
                    total_price=total_price,
                    valid_until=event.proposal_validity_date or event.event_date - timedelta(days=7),
                    payment_terms=fake.text(max_nb_chars=100),
                    terms_and_conditions=fake.text(max_nb_chars=200),
                    status=status,
                    sent_at=fake.date_time_between(start_date='-30d', end_date='now') if status in ['sent', 'approved', 'rejected'] else None,
                    approved_at=fake.date_time_between(start_date='-30d', end_date='now') if status == 'approved' else None,
                    notes=fake.text(max_nb_chars=150)
                )
        
        print("✅ Orçamentos criados")
    
    def create_notifications(self):
        """Cria notificações para as empresas"""
        print("🔔 Criando notificações...")
        
        notification_types = [
            'event_conflict', 'quote_expiring', 'payment_due', 
            'event_reminder', 'general'
        ]
        priorities = ['low', 'medium', 'high', 'urgent']
        
        for company in self.companies:
            company_users = [u for u in self.users if u.company == company]
            company_events = [e for e in self.events if e.company == company]
            
            for i in range(random.randint(10, 30)):
                notification_type = random.choice(notification_types)
                priority = random.choice(priorities)
                
                titles = {
                    'event_conflict': 'Conflito de horário detectado',
                    'quote_expiring': 'Orçamento expirando em breve',
                    'payment_due': 'Pagamento pendente',
                    'event_reminder': 'Lembrete de evento',
                    'general': 'Notificação geral'
                }
                
                Notification.objects.create(
                    company=company,
                    user=random.choice(company_users) if random.choice([True, False]) else None,
                    event=random.choice(company_events) if company_events and random.choice([True, False]) else None,
                    notification_type=notification_type,
                    priority=priority,
                    title=titles[notification_type],
                    message=fake.text(max_nb_chars=200),
                    is_read=random.choice([True, False]),
                    is_dismissed=random.choice([True, False])
                )
        
        print("✅ Notificações criadas")
    
    def create_audit_logs(self):
        """Cria logs de auditoria"""
        print("📝 Criando logs de auditoria...")
        
        actions = ['create', 'update', 'delete', 'view']
        models = ['Event', 'MenuItem', 'Quote', 'FinancialTransaction', 'User']
        
        for company in self.companies:
            company_users = [u for u in self.users if u.company == company]
            
            for i in range(random.randint(50, 150)):
                AuditLog.objects.create(
                    company=company,
                    user=random.choice(company_users),
                    action=random.choice(actions),
                    model_name=random.choice(models),
                    object_id=random.randint(1, 1000),
                    object_repr=fake.catch_phrase(),
                    changes={'field': 'value', 'old_value': 'old', 'new_value': 'new'},
                    ip_address=fake.ipv4(),
                    user_agent=fake.user_agent()
                )
        
        print("✅ Logs de auditoria criados")
    
    def run_all(self):
        """Executa todos os métodos de criação de dados"""
        print("🚀 Iniciando inserção de dados em massa...")
        print("=" * 50)
        
        try:
            self.create_companies_and_users()
            self.create_menu_items()
            self.create_events()
            self.create_event_menus()
            self.create_financial_transactions()
            self.create_cost_calculations()
            self.create_quotes()
            self.create_notifications()
            self.create_audit_logs()
            
            print("=" * 50)
            print("✅ DADOS INSERIDOS COM SUCESSO!")
            print(f"📊 Resumo:")
            print(f"   • {len(self.companies)} empresas")
            print(f"   • {len(self.users)} usuários")
            print(f"   • {len(self.events)} eventos")
            print(f"   • {len(self.menu_items)} itens de cardápio")
            print(f"   • {FinancialTransaction.objects.count()} transações financeiras")
            print(f"   • {CostCalculation.objects.count()} cálculos de custo")
            print(f"   • {Quote.objects.count()} orçamentos")
            print(f"   • {Notification.objects.count()} notificações")
            print(f"   • {AuditLog.objects.count()} logs de auditoria")
            
        except Exception as e:
            print(f"❌ Erro durante a inserção: {str(e)}")
            raise

def main():
    """Função principal"""
    print("🎯 BuffetFlow - Script de Inserção de Dados em Massa")
    print("Este script criará dados de teste para todas as funcionalidades do sistema")
    print()
    
    # Confirmar execução
    response = input("Deseja continuar? (s/N): ").lower()
    if response not in ['s', 'sim', 'y', 'yes']:
        print("Operação cancelada.")
        return
    
    # Executar inserção
    inserter = MassDataInserter()
    inserter.run_all()
    
    print()
    print("🎉 Script concluído! Agora você pode testar todas as funcionalidades do sistema.")
    print("💡 Dica: Use as credenciais 'teste123' para fazer login com qualquer usuário criado.")

if __name__ == "__main__":
    main()
