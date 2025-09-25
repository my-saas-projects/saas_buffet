from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

from events.models import Event
from clients.models import Client

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    company = request.user.company
    
    # Date calculations
    today = datetime.now().date()
    current_month_start = today.replace(day=1)
    
    # Queries
    total_events = Event.objects.filter(company=company).count()
    confirmed_events = Event.objects.filter(company=company, status__in=['proposta_aceita', 'em_execucao', 'pos_evento', 'concluido']).count()
    
    monthly_revenue = Event.objects.filter(
        company=company, 
        event_date__gte=current_month_start,
        status__in=['proposta_aceita', 'em_execucao', 'pos_evento', 'concluido']
    ).aggregate(total=Sum('value'))['total'] or 0
    
    avg_guest_count = Event.objects.filter(company=company).aggregate(avg=Avg('guest_count'))['avg'] or 0
    
    pending_proposals = Event.objects.filter(company=company, status__in=['proposta_pendente', 'proposta_enviada']).count()
    
    new_clients_this_month = Client.objects.filter(
        company=company,
        created_at__gte=current_month_start
    ).count()

    stats = {
        'total_events': total_events,
        'confirmed_events': confirmed_events,
        'monthly_revenue': monthly_revenue,
        'avg_guest_count': round(avg_guest_count, 2),
        'pending_proposals': pending_proposals,
        'new_clients_this_month': new_clients_this_month,
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upcoming_events(request):
    company = request.user.company
    today = datetime.now().date()
    
    upcoming = Event.objects.filter(
        company=company,
        event_date__gte=today,
        status__in=['proposta_aceita', 'em_execucao']
    ).order_by('event_date', 'start_time')[:5]
    
    data = [
        {
            'id': event.id,
            'title': event.title,
            'date': event.event_date,
            'time': event.start_time,
            'guestCount': event.guest_count,
            'status': event.status,
            'clientName': event.client_name
        } for event in upcoming
    ]
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_status_distribution(request):
    company = request.user.company
    
    status_distribution = Event.objects.filter(company=company)\
        .values('status')\
        .annotate(count=Count('id'))\
        .order_by('status')
        
    return Response(status_distribution)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_monthly_revenue_chart(request):
    company = request.user.company
    
    # Get data for the last 6 months
    six_months_ago = datetime.now().date() - relativedelta(months=5)
    six_months_ago = six_months_ago.replace(day=1)

    revenue_data = Event.objects.filter(
        company=company,
        event_date__gte=six_months_ago,
        status__in=['proposta_aceita', 'em_execucao', 'pos_evento', 'concluido']
    ).annotate(month=TruncMonth('event_date'))\
     .values('month')\
     .annotate(revenue=Sum('value'))\
     .order_by('month')

    # Format for recharts
    chart_data = [
        {
            'month': item['month'].strftime('%b'), # e.g., 'Jan'
            'revenue': float(item['revenue'])
        } for item in revenue_data
    ]

    return Response(chart_data)