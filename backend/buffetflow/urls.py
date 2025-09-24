"""
URL configuration for buffetflow project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from financials import views as financial_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/events/', include('events.urls')),
    path('api/financials/', include('financials.urls')),
    # Frontend compatibility endpoints
    path('api/quotes/', financial_views.quotes_view, name='quotes_proxy'),
    path('api/financial-summary/', financial_views.financial_summary_view, name='financial_summary'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
