from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import Company
from .models import FinancialTransaction
from datetime import date

User = get_user_model()

class FinancialTransactionAPITest(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Test Buffet")
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            company=self.company
        )
        self.client.force_authenticate(user=self.user)

    def test_create_financial_transaction(self):
        """Test creating a new financial transaction"""
        data = {
            "description": "Pagamento de fornecedor",
            "amount": "150.50",
            "transaction_type": "EXPENSE",
            "transaction_date": str(date.today()),
            "status": "COMPLETED"
        }

        response = self.client.post('/api/financials/transactions/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FinancialTransaction.objects.count(), 1)

        transaction = FinancialTransaction.objects.first()
        self.assertEqual(transaction.description, "Pagamento de fornecedor")
        self.assertEqual(str(transaction.amount), "150.50")
        self.assertEqual(transaction.transaction_type, "EXPENSE")
        self.assertEqual(transaction.status, "COMPLETED")

    def test_create_financial_transaction_income(self):
        """Test creating an income transaction"""
        data = {
            "description": "Pagamento de cliente",
            "amount": "500.00",
            "transaction_type": "INCOME",
            "transaction_date": str(date.today()),
            "status": "PENDING"
        }

        response = self.client.post('/api/financials/transactions/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        transaction = FinancialTransaction.objects.first()
        self.assertEqual(transaction.transaction_type, "INCOME")
        self.assertEqual(transaction.status, "PENDING")

    def test_list_financial_transactions(self):
        """Test listing financial transactions"""
        FinancialTransaction.objects.create(
            description="Test transaction",
            amount=100.00,
            transaction_type="INCOME",
            transaction_date=date.today()
        )

        response = self.client.get('/api/financials/transactions/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
