# models.py - BuffetFlow Django Models

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal
import uuid


# ========== USUÁRIOS E EMPRESA ==========

class User(AbstractUser):
    """Modelo customizado de usuário para o sistema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefone")
    whatsapp = models.CharField(max_length=20, blank=True, verbose_name="WhatsApp")
    role = models.CharField(
        max_length=20,
        choices=[
            ('owner', 'Proprietário'),
            ('manager', 'Gerente'),
            ('coordinator', 'Coordenador'),
            ('staff', 'Equipe')
        ],
        default='owner',
        verbose_name="Função"
    )
    is_onboarded = models.BooleanField(default=False, verbose_name="Onboarding Completo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ['-created_at']


class Company(models.Model):
    """Dados da empresa de buffet"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companies')
    
    # Informações básicas
    name = models.CharField(max_length=200, verbose_name="Nome do Buffet")
    cnpj = models.CharField(max_length=18, blank=True, verbose_name="CNPJ")
    phone = models.CharField(max_length=20, verbose_name="Telefone")
    email = models.EmailField(verbose_name="Email")
    
    # Endereço
    address = models.CharField(max_length=300, blank=True, verbose_name="Endereço")
    city = models.CharField(max_length=100, blank=True, verbose_name="Cidade")
    state = models.CharField(max_length=2, blank=True, verbose_name="Estado")
    zip_code = models.CharField(max_length=9, blank=True, verbose_name="CEP")
    
    # Configurações
    logo = models.ImageField(upload_to='logos/', blank=True, null=True, verbose_name="Logo")
    default_profit_margin = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=30.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Margem de Lucro Padrão (%)"
    )
    max_events_per_day = models.PositiveIntegerField(default=2, verbose_name="Máx. Eventos por Dia")
    
    # Assinatura/Plano
    plan = models.CharField(
        max_length=20,
        choices=[
            ('trial', 'Trial (14 dias)'),
            ('basic', 'Básico'),
            ('pro', 'Profissional'),
            ('premium', 'Premium')
        ],
        default='trial',
        verbose_name="Plano"
    )
    trial_ends_at = models.DateTimeField(null=True, blank=True, verbose_name="Fim do Trial")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ========== EVENTOS ==========

class Event(models.Model):
    """Modelo principal de eventos"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='events')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='events_created')
    
    # Informações do evento
    event_type = models.CharField(
        max_length=30,
        choices=[
            ('wedding', 'Casamento'),
            ('graduation', 'Formatura'),
            ('birthday', 'Aniversário'),
            ('corporate', 'Corporativo'),
            ('baptism', 'Batizado'),
            ('other', 'Outro')
        ],
        verbose_name="Tipo de Evento"
    )
    title = models.CharField(max_length=200, verbose_name="Título do Evento")
    date = models.DateField(verbose_name="Data do Evento")
    start_time = models.TimeField(verbose_name="Hora de Início")
    end_time = models.TimeField(verbose_name="Hora de Término")
    
    # Cliente
    client_name = models.CharField(max_length=200, verbose_name="Nome do Cliente")
    client_phone = models.CharField(max_length=20, verbose_name="Telefone do Cliente")
    client_email = models.EmailField(blank=True, verbose_name="Email do Cliente")
    
    # Detalhes do evento
    guest_count = models.PositiveIntegerField(verbose_name="Número de Convidados")
    venue = models.CharField(max_length=300, blank=True, verbose_name="Local do Evento")
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('quote', 'Orçamento'),
            ('confirmed', 'Confirmado'),
            ('preparing', 'Em Preparação'),
            ('ongoing', 'Em Andamento'),
            ('completed', 'Concluído'),
            ('cancelled', 'Cancelado')
        ],
        default='quote',
        verbose_name="Status"
    )
    
    # Observações
    notes = models.TextField(blank=True, verbose_name="Observações")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['company', 'date']),
            models.Index(fields=['status']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'date', 'start_time'],
                name='unique_event_time_per_company'
            )
        ]
    
    def __str__(self):
        return f"{self.title} - {self.date}"
    
    @property
    def is_conflicting(self):
        """Verifica se há conflito de horário com outros eventos"""
        overlapping = Event.objects.filter(
            company=self.company,
            date=self.date,
            status__in=['confirmed', 'preparing', 'ongoing']
        ).exclude(id=self.id)
        
        for event in overlapping:
            if (self.start_time < event.end_time and self.end_time > event.start_time):
                return True
        return False


# ========== CARDÁPIO E ITENS ==========

class MenuItem(models.Model):
    """Itens do cardápio disponíveis"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='menu_items')
    
    name = models.CharField(max_length=200, verbose_name="Nome do Item")
    category = models.CharField(
        max_length=30,
        choices=[
            ('appetizer', 'Entrada'),
            ('main', 'Prato Principal'),
            ('side', 'Acompanhamento'),
            ('dessert', 'Sobremesa'),
            ('beverage', 'Bebida'),
            ('other', 'Outro')
        ],
        verbose_name="Categoria"
    )
    description = models.TextField(blank=True, verbose_name="Descrição")
    cost_per_person = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Custo por Pessoa (R$)"
    )
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Item do Cardápio"
        verbose_name_plural = "Itens do Cardápio"
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} - R$ {self.cost_per_person}"


class EventMenu(models.Model):
    """Cardápio selecionado para um evento"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='menus')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity_multiplier = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=1.00,
        verbose_name="Multiplicador de Quantidade"
    )
    
    class Meta:
        verbose_name = "Cardápio do Evento"
        verbose_name_plural = "Cardápios dos Eventos"
        unique_together = ['event', 'menu_item']
    
    @property
    def total_cost(self):
        return self.menu_item.cost_per_person * self.event.guest_count * self.quantity_multiplier


# ========== FINANCEIRO ==========

class CostCalculation(models.Model):
    """Cálculo de custos de um evento"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='cost_calculation')
    
    # Custos
    food_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name="Custo de Alimentos (R$)"
    )
    labor_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name="Custo de Mão de Obra (R$)"
    )
    rental_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name="Custo de Aluguel/Equipamentos (R$)"
    )
    other_costs = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name="Outros Custos (R$)"
    )
    
    # Preços
    suggested_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Preço Sugerido (R$)"
    )
    final_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Preço Final (R$)"
    )
    
    # Margem
    profit_margin_percent = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Margem de Lucro (%)"
    )
    
    # Timestamps
    calculated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cálculo de Custos"
        verbose_name_plural = "Cálculos de Custos"
    
    @property
    def total_cost(self):
        return self.food_cost + self.labor_cost + self.rental_cost + self.other_costs
    
    @property
    def projected_profit(self):
        return self.final_price - self.total_cost
    
    @property
    def actual_margin(self):
        if self.final_price > 0:
            return ((self.final_price - self.total_cost) / self.final_price) * 100
        return 0


class Quote(models.Model):
    """Orçamentos gerados"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='quotes')
    
    # Versão do orçamento
    version = models.PositiveIntegerField(default=1, verbose_name="Versão")
    
    # Configurações do PDF
    template = models.CharField(
        max_length=20,
        choices=[
            ('elegant', 'Elegante'),
            ('modern', 'Moderno'),
            ('simple', 'Simples')
        ],
        default='elegant',
        verbose_name="Template"
    )
    
    # Conteúdo
    content = models.JSONField(verbose_name="Conteúdo do Orçamento")
    total_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Valor Total (R$)"
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Rascunho'),
            ('sent', 'Enviado'),
            ('approved', 'Aprovado'),
            ('rejected', 'Rejeitado')
        ],
        default='draft',
        verbose_name="Status"
    )
    
    # Arquivo PDF
    pdf_file = models.FileField(upload_to='quotes/', blank=True, null=True, verbose_name="Arquivo PDF")
    
    # Datas
    valid_until = models.DateField(verbose_name="Válido até")
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Enviado em")
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name="Aprovado em")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Orçamento"
        verbose_name_plural = "Orçamentos"
        ordering = ['-created_at']
        unique_together = ['event', 'version']
    
    def __str__(self):
        return f"Orçamento v{self.version} - {self.event.title}"


# ========== NOTIFICAÇÕES ==========

class Notification(models.Model):
    """Sistema de notificações e alertas"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    
    type = models.CharField(
        max_length=30,
        choices=[
            ('deadline', 'Prazo Próximo'),
            ('conflict', 'Conflito de Agenda'),
            ('payment', 'Pagamento'),
            ('reminder', 'Lembrete'),
            ('system', 'Sistema')
        ],
        verbose_name="Tipo"
    )
    
    title = models.CharField(max_length=200, verbose_name="Título")
    message = models.TextField(verbose_name="Mensagem")
    
    # Relacionamento opcional com evento
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    
    # Status
    is_read = models.BooleanField(default=False, verbose_name="Lida")
    is_sent_whatsapp = models.BooleanField(default=False, verbose_name="Enviada via WhatsApp")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.type} - {self.title}"


# ========== INTEGRAÇÕES ==========

class Integration(models.Model):
    """Configurações de integrações externas"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='integrations')
    
    service = models.CharField(
        max_length=30,
        choices=[
            ('whatsapp', 'WhatsApp'),
            ('google_calendar', 'Google Calendar'),
            ('excel', 'Excel Export')
        ],
        verbose_name="Serviço"
    )
    
    is_active = models.BooleanField(default=False, verbose_name="Ativo")
    config = models.JSONField(default=dict, verbose_name="Configurações")
    
    # Tokens e credenciais (criptografar em produção)
    access_token = models.TextField(blank=True, verbose_name="Token de Acesso")
    refresh_token = models.TextField(blank=True, verbose_name="Token de Atualização")
    
    last_sync = models.DateTimeField(null=True, blank=True, verbose_name="Última Sincronização")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Integração"
        verbose_name_plural = "Integrações"
        unique_together = ['company', 'service']
    
    def __str__(self):
        return f"{self.company.name} - {self.service}"


# ========== AUDITORIA ==========

class AuditLog(models.Model):
    """Log de auditoria para rastreamento de ações importantes"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='audit_logs')
    
    action = models.CharField(max_length=100, verbose_name="Ação")
    model_name = models.CharField(max_length=50, verbose_name="Modelo")
    object_id = models.CharField(max_length=50, verbose_name="ID do Objeto")
    
    changes = models.JSONField(default=dict, verbose_name="Mudanças")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', 'created_at']),
        ]