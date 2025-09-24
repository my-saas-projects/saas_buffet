from django.db import models
from django.conf import settings
from users.models import Company

class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('wedding', 'Casamento'),
        ('graduation', 'Formatura'),
        ('birthday', 'Aniversário'),
        ('corporate', 'Corporativo'),
        ('other', 'Outro'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('confirmed', 'Confirmado'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluído'),
        ('cancelled', 'Cancelado'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='events')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_events')
    
    # Basic information
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    
    # Client information
    client_name = models.CharField(max_length=200)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=20)
    
    # Event details
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    guest_count = models.IntegerField()
    venue_location = models.CharField(max_length=300)
    
    # Status and pricing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Additional information
    special_requirements = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['event_date', 'start_time']
        unique_together = ['company', 'event_date', 'start_time']
    
    def __str__(self):
        return f"{self.title} - {self.event_date}"
    
    def is_conflicting(self):
        overlapping_events = Event.objects.filter(
            company=self.company,
            event_date=self.event_date,
            status__in=['confirmed', 'in_progress']
        ).exclude(pk=self.pk)
        
        for event in overlapping_events:
            if (self.start_time < event.end_time and self.end_time > event.start_time):
                return True
        return False

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('appetizer', 'Entrada'),
        ('main', 'Prato Principal'),
        ('side', 'Acompanhamento'),
        ('dessert', 'Sobremesa'),
        ('beverage', 'Bebida'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='menu_items')
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    
    # Pricing per person
    cost_per_person = models.DecimalField(max_digits=8, decimal_places=2)
    price_per_person = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Availability
    is_active = models.BooleanField(default=True)
    seasonal = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        unique_together = ['company', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class EventMenu(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='menu_items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'menu_item']
    
    def __str__(self):
        return f"{self.event.title} - {self.menu_item.name}"
    
    def total_cost(self):
        return self.menu_item.cost_per_person * self.event.guest_count * self.quantity
    
    def total_price(self):
        return self.menu_item.price_per_person * self.event.guest_count * self.quantity
