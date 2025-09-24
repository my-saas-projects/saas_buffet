from django.db import models
from django.conf import settings
from users.models import Company
from events.models import Event

class CostCalculation(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='cost_calculation')
    calculated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Ingredient costs
    food_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    beverage_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Labor costs
    staff_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    # Other costs
    equipment_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transportation_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    venue_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_costs = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Profit margin
    profit_margin_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=30.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def total_cost(self):
        return (self.food_cost + self.beverage_cost + self.staff_cost + 
                self.equipment_cost + self.transportation_cost + 
                self.venue_cost + self.other_costs)
    
    def suggested_price(self):
        total = self.total_cost()
        profit_amount = total * (self.profit_margin_percentage / 100)
        return total + profit_amount
    
    def __str__(self):
        return f"Cost calculation for {self.event.title}"

class Quote(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('sent', 'Enviado'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('expired', 'Expirado'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='quotes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    quote_number = models.CharField(max_length=50, unique=True)
    version = models.IntegerField(default=1)
    
    # Quote details
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    profit_margin = models.DecimalField(max_digits=5, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Terms
    valid_until = models.DateField()
    payment_terms = models.TextField(blank=True, null=True)
    terms_and_conditions = models.TextField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    sent_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Additional information
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['event', 'version']
    
    def __str__(self):
        return f"Quote {self.quote_number} - {self.event.title} (v{self.version})"
    
    def save(self, *args, **kwargs):
        if not self.quote_number:
            # Generate quote number based on event and date
            from datetime import datetime
            date_str = datetime.now().strftime('%Y%m%d')
            self.quote_number = f"QT-{date_str}-{self.event.id:04d}-{self.version:02d}"
        super().save(*args, **kwargs)

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('event_conflict', 'Conflito de Evento'),
        ('quote_expiring', 'Orçamento Expirando'),
        ('payment_due', 'Pagamento Pendente'),
        ('event_reminder', 'Lembrete de Evento'),
        ('general', 'Geral'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.company.name}"

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Criado'),
        ('update', 'Atualizado'),
        ('delete', 'Deletado'),
        ('view', 'Visualizado'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    object_repr = models.CharField(max_length=200)
    
    changes = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} {self.get_action_display()} {self.model_name} ({self.object_repr})"
