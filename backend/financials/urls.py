from django.urls import path
from . import views

app_name = 'financials'

urlpatterns = [
    # Dashboard
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # Cost calculations
    path('cost-calculations/', views.cost_calculations_view, name='cost_calculations'),
    path('cost-calculations/<int:cost_id>/', views.cost_calculation_detail_view, name='cost_calculation_detail'),

    # Quotes
    path('quotes/', views.quotes_view, name='quotes'),
    path('quotes/<int:quote_id>/', views.quote_detail_view, name='quote_detail'),
    path('quotes/<int:quote_id>/send/', views.send_quote_view, name='send_quote'),

    # Notifications
    path('notifications/', views.notifications_view, name='notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read_view, name='mark_notification_read'),

    # Audit logs
    path('audit-logs/', views.audit_logs_view, name='audit_logs'),
]