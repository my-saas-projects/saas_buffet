from rest_framework import serializers
from users.models import Company
from .models import PaymentMethod


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'business_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'cnpj': {'required': False, 'allow_blank': True, 'allow_null': True},
            'website': {'required': False, 'allow_blank': True, 'allow_null': True},
            'address': {'required': False},
            'city': {'required': False},
            'state': {'required': False},
            'postal_code': {'required': False},
            'default_profit_margin': {'required': False},
            'max_events_per_month': {'required': False},
        }

    def validate(self, attrs):
        # Campos obrigatórios de acordo com o modelo: name, email, phone
        if self.instance is None:  # criação
            missing = []
            for field in ['name', 'email', 'phone']:
                if not attrs.get(field) or not str(attrs.get(field)).strip():
                    missing.append(field)
            if missing:
                error_msg = f"Campos obrigatórios não preenchidos: {', '.join(missing)}"
                raise serializers.ValidationError({'error': error_msg})

        state = attrs.get('state')
        if state and len(state) != 2:
            raise serializers.ValidationError({'state': 'Use UF com 2 letras (ex: SP).'})

        return attrs

    def create(self, validated_data):
        # Preencher campos opcionais não nulos do modelo com strings vazias caso ausentes
        for field in ['address', 'city', 'state', 'postal_code']:
            if field not in validated_data or validated_data.get(field) is None:
                validated_data[field] = ''
        return super().create(validated_data)


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'card_brand', 'card_last_four', 'card_exp_month',
            'card_exp_year', 'is_default', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        # Validação básica de cartão
        exp_month = attrs.get('card_exp_month')
        exp_year = attrs.get('card_exp_year')

        if exp_month and (exp_month < 1 or exp_month > 12):
            raise serializers.ValidationError({'card_exp_month': 'Mês deve estar entre 1 e 12.'})

        if exp_year and exp_year < 2024:
            raise serializers.ValidationError({'card_exp_year': 'Ano de validade deve ser atual ou futuro.'})

        return attrs


class PaymentMethodCreateSerializer(serializers.Serializer):
    """
    Serializer para criação de método de pagamento.
    Este será usado para iniciar o processo de setup com o provedor de pagamento.
    """
    card_holder_name = serializers.CharField(max_length=255)

    def validate_card_holder_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Nome do portador é obrigatório.')
        return value.strip()


