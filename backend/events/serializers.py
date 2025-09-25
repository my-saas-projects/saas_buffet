from rest_framework import serializers
from .models import Event, MenuItem, EventMenu

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'
        read_only_fields = ('company', 'created_at', 'updated_at')

class EventMenuSerializer(serializers.ModelSerializer):
    menu_item_data = MenuItemSerializer(source='menu_item', read_only=True)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = EventMenu
        fields = '__all__'
        read_only_fields = ('event', 'created_at')

class EventSerializer(serializers.ModelSerializer):
    menu_items = EventMenuSerializer(many=True, read_only=True)
    is_conflicting = serializers.BooleanField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('company', 'created_by', 'created_at', 'updated_at', 'is_conflicting')

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ('company', 'created_by', 'created_at', 'updated_at')

class EventListSerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_conflicting = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = ('id', 'title', 'event_type', 'event_type_display', 'status', 'status_display',
                 'event_date', 'start_time', 'end_time', 'guest_count', 'client_name',
                 'estimated_cost', 'final_price', 'value', 'is_conflicting', 'proposal_validity_date')