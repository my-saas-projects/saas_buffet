from django.urls import path
from .views import (
    get_dashboard_stats,
    get_upcoming_events,
    get_event_status_distribution,
    get_monthly_revenue_chart,
)

urlpatterns = [
    path('stats/', get_dashboard_stats, name='dashboard-stats'),
    path('upcoming_events/', get_upcoming_events, name='dashboard-upcoming-events'),
    path('event_status_distribution/', get_event_status_distribution, name='dashboard-event-status-distribution'),
    path('monthly_revenue_chart/', get_monthly_revenue_chart, name='dashboard-monthly-revenue-chart'),
]
