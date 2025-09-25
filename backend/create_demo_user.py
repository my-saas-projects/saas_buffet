#!/usr/bin/env python
"""
Script para criar usuário de demonstração
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buffetflow.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Company
from rest_framework.authtoken.models import Token

User = get_user_model()

def create_demo_user():
    """Criar usuário e empresa de demonstração"""
    
    # Verificar se usuário já existe
    if User.objects.filter(email='demo@buffetflow.com').exists():
        print("✅ Usuário demo já existe!")
        user = User.objects.get(email='demo@buffetflow.com')
    else:
        # Criar usuário
        user = User.objects.create_user(
            username='demo',
            email='demo@buffetflow.com',
            password='demo123',
            first_name='Demo',
            last_name='User',
            phone='(11) 99999-9999',
            role='owner'
        )
        print("✅ Usuário demo criado!")
    
    # Verificar se empresa já existe
    if not hasattr(user, 'company') or user.company is None:
        # Criar empresa
        company = Company.objects.create(
            name='Buffet Demonstração',
            phone='(11) 99999-9999',
            email='demo@buffetflow.com',
            address='Rua Demo, 123',
            city='São Paulo',
            state='SP',
            postal_code='01234-567',
            default_profit_margin=30.0,
            max_events_per_month=50,
            is_active=True
        )
        user.company = company
        user.save()
        print("✅ Empresa demo criada!")
    else:
        print("✅ Empresa demo já existe!")
    
    # Criar token de autenticação
    token, created = Token.objects.get_or_create(user=user)
    if created:
        print("✅ Token criado!")
    else:
        print("✅ Token já existe!")
    
    print(f"\n🎯 Dados para login:")
    print(f"Email: demo@buffetflow.com")
    print(f"Senha: demo123")
    print(f"Token: {token.key}")

if __name__ == '__main__':
    create_demo_user()
