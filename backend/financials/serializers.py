from rest_framework import serializers
from .models import FinancialTransaction, CostCalculation, Quote, Notification, AuditLog

class FinancialTransactionSerializer(serializers.ModelSerializer):
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    related_event_title = serializers.CharField(source='related_event.title', read_only=True)

    class Meta:
        model = FinancialTransaction
        fields = '__all__'

class CostCalculationSerializer(serializers.ModelSerializer):
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    suggested_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CostCalculation
        fields = '__all__'
        read_only_fields = ('calculated_by', 'created_at', 'updated_at')

class QuoteSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    client_name = serializers.CharField(source='event.client_name', read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ('quote_number', 'created_by', 'created_at', 'updated_at')

class QuoteListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    client_name = serializers.CharField(source='event.client_name', read_only=True)
    
    class Meta:
        model = Quote
        fields = ('id', 'quote_number', 'version', 'event_title', 'client_name', 
                 'total_price', 'status', 'status_display', 'valid_until', 
                 'sent_at', 'approved_at', 'created_at')

class NotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('company', 'created_at', 'read_at')

class AuditLogSerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ('company', 'user', 'created_at')