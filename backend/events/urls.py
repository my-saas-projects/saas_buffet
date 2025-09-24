from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.events_view, name='events'),
    path('<int:event_id>/', views.event_detail_view, name='event_detail'),
    path('calendar/', views.calendar_view, name='calendar'),
    
    path('menu-items/', views.menu_items_view, name='menu_items'),
    path('menu-items/<int:item_id>/', views.menu_item_detail_view, name='menu_item_detail'),
    
    path('<int:event_id>/menu/', views.add_menu_to_event_view, name='add_menu_to_event'),
    path('<int:event_id>/menu/<int:menu_item_id>/', views.remove_menu_from_event_view, name='remove_menu_from_event'),
]