from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'client_type', 'full_name', 'rg', 'cpf', 'fantasy_name',
            'corporate_name', 'cnpj', 'state_registration', 'address',
            'zip_code', 'name', 'email', 'phone', 'company', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'company', 'created_at', 'updated_at']

    def validate(self, data):
        client_type = data.get('client_type')

        if client_type == 'FISICA':
            if not data.get('full_name'):
                raise serializers.ValidationError({
                    'full_name': 'Nome completo é obrigatório para pessoa física.'
                })
        elif client_type == 'JURIDICA':
            if not data.get('fantasy_name'):
                raise serializers.ValidationError({
                    'fantasy_name': 'Nome fantasia é obrigatório para pessoa jurídica.'
                })

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['company'] = user.company
        return super().create(validated_data)