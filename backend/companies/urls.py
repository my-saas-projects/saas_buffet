from django.urls import path
from . import views

app_name = 'companies'

urlpatterns = [
    path('', views.companies_view, name='companies'),
    path('my-company/', views.my_company_view, name='my_company'),
    path('payment-methods/', views.payment_methods_view, name='payment_methods'),
    path('payment-methods/<int:pk>/', views.payment_method_detail_view, name='payment_method_detail'),
    path('<uuid:pk>/', views.company_detail_view, name='company_detail'),
]


