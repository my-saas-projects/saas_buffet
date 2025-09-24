from django.urls import path
from . import views

app_name = 'companies'

urlpatterns = [
    path('', views.companies_view, name='companies'),
    path('<uuid:pk>/', views.company_detail_view, name='company_detail'),
]


