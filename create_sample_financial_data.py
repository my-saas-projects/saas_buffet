#!/usr/bin/env python
import os
import sys
import django
import datetime
from decimal import Decimal

# Add the backend directory to the path
sys.path.append('/home/ederfp/Projetos/saas_buffet')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buffetflow.settings')

django.setup()

from financials.models import FinancialTransaction

# Create sample financial transactions
def create_sample_transactions():
    # Sample income transactions
    income_transactions = [
        {
            'description': 'Pagamento Casamento Silva',
            'amount': Decimal('8500.00'),
            'transaction_type': 'INCOME',
            'transaction_date': datetime.date.today() - datetime.timedelta(days=5),
            'status': 'COMPLETED'
        },
        {
            'description': 'Entrada Formatura João',
            'amount': Decimal('3200.00'),
            'transaction_type': 'INCOME',
            'transaction_date': datetime.date.today() - datetime.timedelta(days=10),
            'status': 'COMPLETED'
        },
        {
            'description': 'Pagamento Aniversário Maria',
            'amount': Decimal('2800.00'),
            'transaction_type': 'INCOME',
            'transaction_date': datetime.date.today(),
            'status': 'PENDING'
        },
        {
            'description': 'Entrada Evento Corporativo',
            'amount': Decimal('12000.00'),
            'transaction_type': 'INCOME',
            'transaction_date': datetime.date.today() + datetime.timedelta(days=15),
            'status': 'PENDING'
        }
    ]

    # Sample expense transactions
    expense_transactions = [
        {
            'description': 'Compra de Ingredientes',
            'amount': Decimal('1500.00'),
            'transaction_type': 'EXPENSE',
            'transaction_date': datetime.date.today() - datetime.timedelta(days=3),
            'status': 'COMPLETED'
        },
        {
            'description': 'Pagamento Fornecedor Bebidas',
            'amount': Decimal('800.00'),
            'transaction_type': 'EXPENSE',
            'transaction_date': datetime.date.today() - datetime.timedelta(days=7),
            'status': 'COMPLETED'
        },
        {
            'description': 'Aluguel Equipamentos',
            'amount': Decimal('600.00'),
            'transaction_type': 'EXPENSE',
            'transaction_date': datetime.date.today() - datetime.timedelta(days=1),
            'status': 'COMPLETED'
        },
        {
            'description': 'Pagamento Funcionários',
            'amount': Decimal('4200.00'),
            'transaction_type': 'EXPENSE',
            'transaction_date': datetime.date.today(),
            'status': 'PENDING'
        }
    ]

    all_transactions = income_transactions + expense_transactions

    for transaction_data in all_transactions:
        transaction, created = FinancialTransaction.objects.get_or_create(
            description=transaction_data['description'],
            defaults=transaction_data
        )
        if created:
            print(f"Created transaction: {transaction.description}")
        else:
            print(f"Transaction already exists: {transaction.description}")

    print(f"\nTotal transactions in database: {FinancialTransaction.objects.count()}")

if __name__ == '__main__':
    create_sample_transactions()