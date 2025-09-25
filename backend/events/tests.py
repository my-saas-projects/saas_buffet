from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time, timedelta
from events.models import Event
from users.models import Company

User = get_user_model()

class AgendaEndpointTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test user and company
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

        self.company = Company.objects.create(
            name='Test Buffet',
            email='buffet@test.com',
            phone='(11) 99999-9999'
        )

        self.user.company = self.company
        self.user.save()

        # Authenticate the client
        self.client.force_authenticate(user=self.user)

        # Create test events
        today = date.today()

        # Event within range
        self.event1 = Event.objects.create(
            company=self.company,
            created_by=self.user,
            title='Casamento Silva',
            event_type='wedding',
            event_date=today + timedelta(days=5),
            start_time=time(18, 0),
            end_time=time(23, 0),
            client_name='João Silva',
            client_email='joao@example.com',
            client_phone='(11) 88888-8888',
            guest_count=100,
            status='proposta_aceita'
        )

        # Another event within range
        self.event2 = Event.objects.create(
            company=self.company,
            created_by=self.user,
            title='Aniversário Santos',
            event_type='birthday',
            event_date=today + timedelta(days=10),
            start_time=time(19, 0),
            end_time=time(22, 0),
            client_name='Maria Santos',
            client_email='maria@example.com',
            client_phone='(11) 77777-7777',
            guest_count=50,
            status='proposta_enviada'
        )

        # Event outside range (should not appear)
        self.event3 = Event.objects.create(
            company=self.company,
            created_by=self.user,
            title='Formatura Oliveira',
            event_type='graduation',
            event_date=today + timedelta(days=50),
            start_time=time(20, 0),
            end_time=time(1, 0),
            client_name='Pedro Oliveira',
            client_email='pedro@example.com',
            client_phone='(11) 66666-6666',
            guest_count=80,
            status='proposta_pendente'
        )

    def test_agenda_endpoint_with_date_range(self):
        """Test agenda endpoint with start_date and end_date parameters"""
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)

        url = reverse('events:agenda')
        response = self.client.get(url, {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('events', response.data)

        events = response.data['events']
        self.assertEqual(len(events), 2)  # Only events within range

        # Check first event data
        event_data = events[0]
        expected_fields = [
            'id', 'title', 'event_date', 'start_time', 'end_time',
            'status', 'status_display', 'event_type', 'event_type_display',
            'client_name'
        ]

        for field in expected_fields:
            self.assertIn(field, event_data)

        # Verify event data
        self.assertEqual(event_data['title'], 'Casamento Silva')
        self.assertEqual(event_data['status'], 'proposta_aceita')
        self.assertEqual(event_data['event_type'], 'wedding')
        self.assertEqual(event_data['client_name'], 'João Silva')

    def test_agenda_endpoint_legacy_month_year(self):
        """Test agenda endpoint with legacy month/year parameters"""
        today = date.today()

        url = reverse('events:agenda')
        response = self.client.get(url, {
            'year': today.year,
            'month': today.month
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('events', response.data)
        self.assertIn('year', response.data)
        self.assertIn('month', response.data)

        self.assertEqual(response.data['year'], today.year)
        self.assertEqual(response.data['month'], today.month)

    def test_agenda_endpoint_no_company(self):
        """Test agenda endpoint returns error when user has no company"""
        # Create user without company
        user_no_company = User.objects.create_user(
            username='nocompany',
            email='nocompany@example.com',
            password='testpass123'
        )

        client = APIClient()
        client.force_authenticate(user=user_no_company)

        url = reverse('events:agenda')
        response = client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'No company associated')

    def test_agenda_endpoint_unauthenticated(self):
        """Test agenda endpoint requires authentication"""
        client = APIClient()  # No authentication

        url = reverse('events:agenda')
        response = client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_agenda_endpoint_company_isolation(self):
        """Test that events are filtered by company"""
        # Create another company and user
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )

        other_company = Company.objects.create(
            name='Other Buffet',
            email='other@buffet.com',
            phone='(11) 55555-5555'
        )

        other_user.company = other_company
        other_user.save()

        # Create event for other company
        Event.objects.create(
            company=other_company,
            created_by=other_user,
            title='Other Company Event',
            event_type='corporate',
            event_date=date.today() + timedelta(days=5),
            start_time=time(14, 0),
            end_time=time(18, 0),
            client_name='Other Client',
            client_email='other@client.com',
            client_phone='(11) 44444-4444',
            guest_count=25,
            status='proposta_aceita'
        )

        # Test with original user - should not see other company's event
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)

        url = reverse('events:agenda')
        response = self.client.get(url, {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        events = response.data['events']

        # Should only see own company's events
        self.assertEqual(len(events), 2)
        event_titles = [event['title'] for event in events]
        self.assertIn('Casamento Silva', event_titles)
        self.assertIn('Aniversário Santos', event_titles)
        self.assertNotIn('Other Company Event', event_titles)

    def test_agenda_serializer_fields(self):
        """Test that the agenda serializer returns only the expected fields"""
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)

        url = reverse('events:agenda')
        response = self.client.get(url, {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        events = response.data['events']

        if events:
            event = events[0]
            expected_fields = {
                'id', 'title', 'event_date', 'start_time', 'end_time',
                'status', 'status_display', 'event_type', 'event_type_display',
                'client_name'
            }

            actual_fields = set(event.keys())
            self.assertEqual(actual_fields, expected_fields)

            # Ensure no extra fields that might contain sensitive data
            unwanted_fields = [
                'client_email', 'client_phone', 'notes', 'special_requirements',
                'estimated_cost', 'final_price', 'value'
            ]

            for field in unwanted_fields:
                self.assertNotIn(field, event)