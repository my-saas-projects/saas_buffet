from django.contrib import admin
from .models import PaymentMethod


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['company', 'card_brand', 'card_last_four', 'is_default', 'is_active', 'created_at']
    list_filter = ['card_brand', 'is_default', 'is_active', 'created_at']
    search_fields = ['company__name', 'card_last_four', 'provider_customer_id']
    readonly_fields = ['created_at', 'updated_at', 'provider_customer_id', 'provider_payment_method_id']
    ordering = ['-is_default', '-created_at']