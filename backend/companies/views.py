from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from users.models import Company
from .models import PaymentMethod
from .serializers import CompanySerializer, PaymentMethodSerializer, PaymentMethodCreateSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def companies_view(request):
    if request.method == 'GET':
        queryset = Company.objects.filter(is_active=True)
        serializer = CompanySerializer(queryset, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            company = serializer.save()
            # Se o usuário não tiver empresa, associa e dá papel de owner
            user = request.user
            if not user.company:
                user.company = company
                if user.role != 'owner':
                    user.role = 'owner'
                user.save()
            return Response(CompanySerializer(company).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def company_detail_view(request, pk):
    try:
        company = Company.objects.get(pk=pk)
    except Company.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(CompanySerializer(company).data)

    if request.method == 'PUT':
        # Permissão: somente owner/manager da mesma empresa
        if request.user.company_id != company.id or request.user.role not in ['owner', 'manager']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # Permissão: somente owner da mesma empresa
        if request.user.company_id != company.id or request.user.role != 'owner':
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        company.is_active = False
        company.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def my_company_view(request):
    user = request.user
    if not user.company:
        return Response({'detail': 'User does not have a company associated.'}, status=status.HTTP_404_NOT_FOUND)

    company = user.company

    if request.method == 'GET':
        return Response(CompanySerializer(company).data)

    if request.method == 'PATCH':
        # Permissão: somente owner/manager da empresa
        if request.user.role not in ['owner', 'manager']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def payment_methods_view(request):
    user = request.user
    if not user.company:
        return Response({'detail': 'User does not have a company associated.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        payment_methods = PaymentMethod.objects.filter(company=user.company, is_active=True)
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        # Permissão: somente owner/manager da empresa
        if request.user.role not in ['owner', 'manager']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PaymentMethodCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Aqui seria iniciado o processo de setup com o provedor de pagamento
            # Por enquanto, vamos simular retornando um setup intent
            card_holder_name = serializer.validated_data['card_holder_name']

            # TODO: Integrar com provedor de pagamento real (Stripe, Pagar.me, etc.)
            # Por enquanto retornamos um mock response
            mock_response = {
                'setup_intent_id': 'si_mock_123456789',
                'client_secret': 'si_mock_123456789_secret_abc',
                'card_holder_name': card_holder_name,
                'message': 'Setup intent criado. Use o client_secret no frontend para coletar dados do cartão.'
            }
            return Response(mock_response, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def payment_method_detail_view(request, pk):
    user = request.user
    if not user.company:
        return Response({'detail': 'User does not have a company associated.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        payment_method = PaymentMethod.objects.get(pk=pk, company=user.company)
    except PaymentMethod.DoesNotExist:
        return Response({'detail': 'Payment method not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PaymentMethodSerializer(payment_method)
        return Response(serializer.data)

    if request.method == 'PATCH':
        # Permissão: somente owner/manager da empresa
        if request.user.role not in ['owner', 'manager']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Para operação de tornar padrão
        if 'is_default' in request.data and request.data['is_default']:
            # Remove default de todos os outros métodos
            PaymentMethod.objects.filter(company=user.company, is_default=True).update(is_default=False)
            payment_method.is_default = True
            payment_method.save()
            return Response(PaymentMethodSerializer(payment_method).data)

        # Para outras operações de atualização
        serializer = PaymentMethodSerializer(payment_method, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # Permissão: somente owner/manager da empresa
        if request.user.role not in ['owner', 'manager']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Não permitir deletar o método padrão se for o único
        if payment_method.is_default:
            other_methods = PaymentMethod.objects.filter(company=user.company, is_active=True).exclude(pk=pk)
            if not other_methods.exists():
                return Response(
                    {'detail': 'Cannot delete the only payment method.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # TODO: Remover do provedor de pagamento também
        payment_method.is_active = False
        payment_method.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


