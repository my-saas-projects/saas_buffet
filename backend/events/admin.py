from django.contrib import admin
from .models import Event, MenuItem, EventMenu

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'event_date', 'start_time', 'client',
                    'guest_count', 'status', 'company', 'created_at')
    list_filter = ('event_type', 'status', 'company', 'event_date', 'created_at')
    search_fields = ('title', 'client__name', 'client__email', 'description')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'event_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'event_type', 'description', 'company', 'created_by')
        }),
        ('Client Information', {
            'fields': ('client',)
        }),
        ('Event Details', {
            'fields': ('event_date', 'start_time', 'end_time', 'guest_count', 'venue_location')
        }),
        ('Status & Pricing', {
            'fields': ('status', 'estimated_cost', 'final_price')
        }),
        ('Additional Information', {
            'fields': ('special_requirements', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'cost_per_person', 'price_per_person', 
                    'is_active', 'company', 'created_at')
    list_filter = ('category', 'is_active', 'seasonal', 'company', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description', 'company')
        }),
        ('Pricing', {
            'fields': ('cost_per_person', 'price_per_person')
        }),
        ('Availability', {
            'fields': ('is_active', 'seasonal')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(EventMenu)
class EventMenuAdmin(admin.ModelAdmin):
    list_display = ('event', 'menu_item', 'quantity', 'total_cost', 'total_price', 'created_at')
    list_filter = ('event__company', 'menu_item__category', 'created_at')
    search_fields = ('event__title', 'menu_item__name')
    readonly_fields = ('total_cost', 'total_price', 'created_at')
    
    def total_cost(self, obj):
        return f"R$ {obj.total_cost():.2f}"
    
    def total_price(self, obj):
        return f"R$ {obj.total_price():.2f}"
