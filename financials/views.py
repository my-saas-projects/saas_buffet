from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime, timedelta
from events.models import Event
from .models import CostCalculation, Quote, Notification, AuditLog
from .serializers import (
    CostCalculationSerializer,
    QuoteSerializer,
    QuoteListSerializer,
    NotificationSerializer,
    AuditLogSerializer
)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def cost_calculations_view(request):
    if request.method == 'GET':
        event_id = request.GET.get('event_id')
        if event_id:
            try:
                event = Event.objects.get(id=event_id, company=request.user.company)
                cost_calc = CostCalculation.objects.get(event=event)
                serializer = CostCalculationSerializer(cost_calc)
                return Response(serializer.data)
            except (Event.DoesNotExist, CostCalculation.DoesNotExist):
                return Response({'error': 'Cost calculation not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            cost_calcs = CostCalculation.objects.filter(event__company=request.user.company)
            serializer = CostCalculationSerializer(cost_calcs, many=True)
            return Response(serializer.data)
    
    elif request.method == 'POST':
        event_id = request.data.get('event')
        if not event_id:
            return Response({'error': 'Event ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = Event.objects.get(id=event_id, company=request.user.company)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create cost calculation
        cost_calc, created = CostCalculation.objects.get_or_create(
            event=event,
            defaults={'calculated_by': request.user}
        )
        
        serializer = CostCalculationSerializer(cost_calc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(calculated_by=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def cost_calculation_detail_view(request, event_id):
    try:
        event = Event.objects.get(id=event_id, company=request.user.company)
        cost_calc = CostCalculation.objects.get(event=event)
    except (Event.DoesNotExist, CostCalculation.DoesNotExist):
        return Response({'error': 'Cost calculation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = CostCalculationSerializer(cost_calc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        cost_calc.delete()
        return Response({'message': 'Cost calculation deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def quotes_view(request):
    if request.method == 'GET':
        quotes = Quote.objects.filter(event__company=request.user.company)
        
        # Filter by status
        status_filter = request.GET.get('status')
        if status_filter:
            quotes = quotes.filter(status=status_filter)
        
        # Filter by event
        event_id = request.GET.get('event_id')
        if event_id:
            quotes = quotes.filter(event_id=event_id)
        
        serializer = QuoteListSerializer(quotes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        event_id = request.data.get('event')
        if not event_id:
            return Response({'error': 'Event ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = Event.objects.get(id=event_id, company=request.user.company)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Determine next version number
        latest_quote = Quote.objects.filter(event=event).order_by('-version').first()
        next_version = (latest_quote.version + 1) if latest_quote else 1
        
        serializer = QuoteSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save(
                event=event,
                created_by=request.user,
                version=next_version
            )
            return Response(QuoteSerializer(quote).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def quote_detail_view(request, quote_id):
    quote = get_object_or_404(Quote, id=quote_id, event__company=request.user.company)
    
    if request.method == 'GET':
        serializer = QuoteSerializer(quote)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = QuoteSerializer(quote, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        quote.delete()
        return Response({'message': 'Quote deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_quote_view(request, quote_id):
    quote = get_object_or_404(Quote, id=quote_id, event__company=request.user.company)
    
    if quote.status != 'draft':
        return Response({'error': 'Only draft quotes can be sent'}, status=status.HTTP_400_BAD_REQUEST)
    
    quote.status = 'sent'
    quote.sent_at = timezone.now()
    quote.save()
    
    return Response({'message': 'Quote sent successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notifications_view(request):
    notifications = Notification.objects.filter(company=request.user.company)
    
    # Filter by read status
    is_read = request.GET.get('is_read')
    if is_read is not None:
        notifications = notifications.filter(is_read=is_read.lower() == 'true')
    
    # Filter by type
    notification_type = request.GET.get('type')
    if notification_type:
        notifications = notifications.filter(notification_type=notification_type)
    
    # Filter by priority
    priority = request.GET.get('priority')
    if priority:
        notifications = notifications.filter(priority=priority)
    
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read_view(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, company=request.user.company)
    
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save()
    
    return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def audit_logs_view(request):
    if request.user.role not in ['owner', 'manager']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    logs = AuditLog.objects.filter(company=request.user.company)
    
    # Filter by user
    user_id = request.GET.get('user_id')
    if user_id:
        logs = logs.filter(user_id=user_id)
    
    # Filter by model
    model_name = request.GET.get('model_name')
    if model_name:
        logs = logs.filter(model_name=model_name)
    
    # Filter by action
    action = request.GET.get('action')
    if action:
        logs = logs.filter(action=action)
    
    # Date range filter
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    if start_date:
        logs = logs.filter(created_at__gte=start_date)
    if end_date:
        logs = logs.filter(created_at__lte=end_date)
    
    logs = logs[:100]  # Limit to last 100 entries
    
    serializer = AuditLogSerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_view(request):
    if not request.user.company:
        return Response({'error': 'No company associated'}, status=status.HTTP_400_BAD_REQUEST)
    
    company = request.user.company
    today = timezone.now().date()
    next_week = today + timedelta(days=7)
    this_month_start = today.replace(day=1)
    
    # Upcoming events (next 7 days)
    upcoming_events = Event.objects.filter(
        company=company,
        event_date__gte=today,
        event_date__lte=next_week,
        status__in=['confirmed', 'in_progress']
    ).order_by('event_date', 'start_time')[:5]
    
    # Event statistics
    total_events_this_month = Event.objects.filter(
        company=company,
        event_date__gte=this_month_start,
        event_date__lte=today
    ).count()
    
    confirmed_events = Event.objects.filter(
        company=company,
        status='confirmed',
        event_date__gte=today
    ).count()
    
    # Revenue statistics
    completed_events_this_month = Event.objects.filter(
        company=company,
        event_date__gte=this_month_start,
        event_date__lte=today,
        status='completed'
    )
    
    total_revenue_this_month = sum(
        event.final_price or 0 for event in completed_events_this_month
    )
    
    # Pending quotes
    pending_quotes = Quote.objects.filter(
        event__company=company,
        status='sent'
    ).count()
    
    expiring_quotes = Quote.objects.filter(
        event__company=company,
        status='sent',
        valid_until__lte=next_week
    ).count()
    
    # Unread notifications
    unread_notifications = Notification.objects.filter(
        company=company,
        is_read=False
    ).count()
    
    # Recent notifications
    recent_notifications = Notification.objects.filter(
        company=company
    ).order_by('-created_at')[:5]
    
    # Conflicts
    conflicting_events = []
    for event in Event.objects.filter(company=company, status__in=['confirmed', 'in_progress']):
        if event.is_conflicting():
            conflicting_events.append(event.id)
    
    dashboard_data = {
        'upcoming_events': [
            {
                'id': event.id,
                'title': event.title,
                'client_name': event.client_name,
                'event_date': event.event_date,
                'start_time': event.start_time,
                'guest_count': event.guest_count,
                'status': event.status
            } for event in upcoming_events
        ],
        'statistics': {
            'total_events_this_month': total_events_this_month,
            'confirmed_events': confirmed_events,
            'total_revenue_this_month': float(total_revenue_this_month),
            'pending_quotes': pending_quotes,
            'expiring_quotes': expiring_quotes,
            'unread_notifications': unread_notifications,
            'conflicting_events': len(conflicting_events)
        },
        'recent_notifications': NotificationSerializer(recent_notifications, many=True).data,
        'alerts': {
            'expiring_quotes': expiring_quotes > 0,
            'conflicting_events': len(conflicting_events) > 0,
            'unread_notifications': unread_notifications > 0
        }
    }
    
    return Response(dashboard_data)
