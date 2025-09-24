from django.contrib import admin
from .models import CostCalculation, Quote, Notification, AuditLog

@admin.register(CostCalculation)
class CostCalculationAdmin(admin.ModelAdmin):
    list_display = ('event', 'total_cost', 'suggested_price', 'profit_margin_percentage', 'calculated_by', 'created_at')
    list_filter = ('event__company', 'created_at', 'profit_margin_percentage')
    search_fields = ('event__title', 'event__client_name')
    readonly_fields = ('total_cost', 'suggested_price', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Event Information', {
            'fields': ('event', 'calculated_by')
        }),
        ('Food & Beverage Costs', {
            'fields': ('food_cost', 'beverage_cost')
        }),
        ('Labor Costs', {
            'fields': ('staff_cost', 'service_hours', 'hourly_rate')
        }),
        ('Other Costs', {
            'fields': ('equipment_cost', 'transportation_cost', 'venue_cost', 'other_costs')
        }),
        ('Profit Margin', {
            'fields': ('profit_margin_percentage',)
        }),
        ('Calculated Results', {
            'fields': ('total_cost', 'suggested_price'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('quote_number', 'event', 'version', 'total_price', 'status', 'valid_until', 'created_at')
    list_filter = ('status', 'event__company', 'created_at', 'valid_until')
    search_fields = ('quote_number', 'event__title', 'event__client_name')
    readonly_fields = ('quote_number', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Quote Information', {
            'fields': ('quote_number', 'event', 'version', 'created_by')
        }),
        ('Financial Details', {
            'fields': ('total_cost', 'profit_margin', 'total_price')
        }),
        ('Terms & Conditions', {
            'fields': ('valid_until', 'payment_terms', 'terms_and_conditions')
        }),
        ('Status & Timeline', {
            'fields': ('status', 'sent_at', 'approved_at')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'priority', 'company', 'user', 'is_read', 'created_at')
    list_filter = ('notification_type', 'priority', 'is_read', 'company', 'created_at')
    search_fields = ('title', 'message', 'user__email')
    readonly_fields = ('created_at', 'read_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('title', 'message', 'notification_type', 'priority')
        }),
        ('Recipients', {
            'fields': ('company', 'user', 'event')
        }),
        ('Status', {
            'fields': ('is_read', 'is_dismissed', 'read_at')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'model_name', 'object_repr', 'company', 'created_at')
    list_filter = ('action', 'model_name', 'company', 'created_at')
    search_fields = ('user__email', 'object_repr', 'model_name')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Action Information', {
            'fields': ('user', 'action', 'model_name', 'object_id', 'object_repr')
        }),
        ('Context', {
            'fields': ('company', 'changes')
        }),
        ('Request Information', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )
