from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import datetime, date
from .models import Event, MenuItem, EventMenu
from .serializers import (
    EventSerializer,
    EventCreateSerializer,
    EventListSerializer,
    EventAgendaSerializer,
    MenuItemSerializer,
    EventMenuSerializer
)

def validate_event_status_change(event_data):
    """
    Validate status changes and required fields
    """
    status_val = event_data.get('status')
    proposal_validity_date = event_data.get('proposal_validity_date')

    if status_val == 'proposta_enviada' and not proposal_validity_date:
        return {'proposal_validity_date': ['Este campo é obrigatório quando o status é "Proposta Enviada".']}

    return None

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def events_view(request):
    if request.method == 'GET':
        events = Event.objects.filter(company=request.user.company)
        
        # Filter by date range
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        if start_date:
            events = events.filter(event_date__gte=start_date)
        if end_date:
            events = events.filter(event_date__lte=end_date)
        
        # Filter by status
        status_filter = request.GET.get('status')
        if status_filter:
            events = events.filter(status=status_filter)
        
        # Filter by event type
        event_type = request.GET.get('event_type')
        if event_type:
            events = events.filter(event_type=event_type)
        
        # Search
        search = request.GET.get('search')
        if search:
            events = events.filter(
                Q(title__icontains=search) |
                Q(client_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.company:
            return Response({'error': 'No company associated'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate status change
        validation_errors = validate_event_status_change(request.data)
        if validation_errors:
            return Response(validation_errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = EventCreateSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save(
                company=request.user.company,
                created_by=request.user
            )
            return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def event_detail_view(request, event_id):
    event = get_object_or_404(Event, id=event_id, company=request.user.company)
    
    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Validate status change
        validation_errors = validate_event_status_change(request.data)
        if validation_errors:
            return Response(validation_errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = EventCreateSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(EventSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        event.delete()
        return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def calendar_view(request):
    if not request.user.company:
        return Response({'error': 'No company associated'}, status=status.HTTP_400_BAD_REQUEST)

    events = Event.objects.filter(company=request.user.company)

    # Support both date range and month/year filtering
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if start_date and end_date:
        # Date range filtering for agenda view
        events = events.filter(event_date__gte=start_date, event_date__lte=end_date)
    else:
        # Legacy month/year filtering
        year = int(request.GET.get('year', datetime.now().year))
        month = int(request.GET.get('month', datetime.now().month))
        events = events.filter(event_date__year=year, event_date__month=month)

    events = events.order_by('event_date', 'start_time')

    # Use optimized serializer for agenda view
    serializer = EventAgendaSerializer(events, many=True)

    # Return different response formats based on filtering method
    if start_date and end_date:
        return Response({'events': serializer.data})
    else:
        year = int(request.GET.get('year', datetime.now().year))
        month = int(request.GET.get('month', datetime.now().month))
        return Response({
            'year': year,
            'month': month,
            'events': serializer.data
        })

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def menu_items_view(request):
    if request.method == 'GET':
        menu_items = MenuItem.objects.filter(company=request.user.company, is_active=True)
        
        category = request.GET.get('category')
        if category:
            menu_items = menu_items.filter(category=category)
        
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.company:
            return Response({'error': 'No company associated'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company=request.user.company)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def menu_item_detail_view(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id, company=request.user.company)
    
    if request.method == 'GET':
        serializer = MenuItemSerializer(menu_item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        menu_item.delete()
        return Response({'message': 'Menu item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_menu_to_event_view(request, event_id):
    event = get_object_or_404(Event, id=event_id, company=request.user.company)
    menu_item_id = request.data.get('menu_item_id')
    quantity = request.data.get('quantity', 1)
    
    if not menu_item_id:
        return Response({'error': 'menu_item_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    menu_item = get_object_or_404(MenuItem, id=menu_item_id, company=request.user.company)
    
    event_menu, created = EventMenu.objects.get_or_create(
        event=event,
        menu_item=menu_item,
        defaults={'quantity': quantity}
    )
    
    if not created:
        event_menu.quantity = quantity
        event_menu.save()
    
    serializer = EventMenuSerializer(event_menu)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_menu_from_event_view(request, event_id, menu_item_id):
    event = get_object_or_404(Event, id=event_id, company=request.user.company)
    event_menu = get_object_or_404(EventMenu, event=event, menu_item_id=menu_item_id)
    
    event_menu.delete()
    return Response({'message': 'Menu item removed from event'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def event_menu_items_view(request, event_id):
    """Get or add menu items for a specific event"""
    event = get_object_or_404(Event, id=event_id, company=request.user.company)

    if request.method == 'GET':
        event_menus = EventMenu.objects.filter(event=event).select_related('menu_item')
        serializer = EventMenuSerializer(event_menus, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        menu_item_id = request.data.get('menu_item')
        quantity = request.data.get('quantity', 1)

        if not menu_item_id:
            return Response({'error': 'menu_item is required'}, status=status.HTTP_400_BAD_REQUEST)

        menu_item = get_object_or_404(MenuItem, id=menu_item_id, company=request.user.company)

        event_menu, created = EventMenu.objects.get_or_create(
            event=event,
            menu_item=menu_item,
            defaults={'quantity': quantity}
        )

        if not created:
            event_menu.quantity = quantity
            event_menu.save()

        serializer = EventMenuSerializer(event_menu)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def event_cost_calculation_view(request, event_id):
    """Get or create/update cost calculation for an event"""
    event = get_object_or_404(Event, id=event_id, company=request.user.company)

    # Import here to avoid circular imports
    from financials.models import CostCalculation
    from financials.serializers import CostCalculationSerializer

    if request.method == 'GET':
        try:
            cost_calc = CostCalculation.objects.get(event=event)
            serializer = CostCalculationSerializer(cost_calc)
            return Response(serializer.data)
        except CostCalculation.DoesNotExist:
            return Response({'error': 'Cost calculation not found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method in ['POST', 'PUT']:
        try:
            cost_calc = CostCalculation.objects.get(event=event)
            # Update existing
            serializer = CostCalculationSerializer(cost_calc, data=request.data, partial=True)
        except CostCalculation.DoesNotExist:
            # Create new
            serializer = CostCalculationSerializer(data=request.data)

        if serializer.is_valid():
            cost_calc = serializer.save(event=event, calculated_by=request.user)
            return Response(CostCalculationSerializer(cost_calc).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
