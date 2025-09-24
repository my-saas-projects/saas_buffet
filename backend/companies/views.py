from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from users.models import Company
from .serializers import CompanySerializer


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


