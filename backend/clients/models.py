from django.db import models


class Client(models.Model):
    CLIENT_TYPE_CHOICES = [
        ('FISICA', 'Pessoa Física'),
        ('JURIDICA', 'Pessoa Jurídica'),
    ]

    client_type = models.CharField(max_length=8, choices=CLIENT_TYPE_CHOICES, default='FISICA')

    # Pessoa Física fields
    full_name = models.CharField(max_length=255, blank=True, null=True)
    rg = models.CharField(max_length=20, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)

    # Pessoa Jurídica fields
    fantasy_name = models.CharField(max_length=255, blank=True, null=True)
    corporate_name = models.CharField(max_length=255, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    state_registration = models.CharField(max_length=50, blank=True, null=True)

    # Common fields
    address = models.CharField(max_length=500, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)

    # Legacy field (kept for backward compatibility)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    company = models.ForeignKey('users.Company', on_delete=models.CASCADE, related_name='clients')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        if self.client_type == 'FISICA' and self.full_name:
            return self.full_name
        elif self.client_type == 'JURIDICA' and self.fantasy_name:
            return self.fantasy_name
        return self.name
