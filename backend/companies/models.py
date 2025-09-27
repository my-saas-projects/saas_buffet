from django.db import models
from users.models import Company


class PaymentMethod(models.Model):
    CARD_BRANDS = [
        ('visa', 'Visa'),
        ('mastercard', 'Mastercard'),
        ('amex', 'American Express'),
        ('elo', 'Elo'),
        ('hipercard', 'Hipercard'),
        ('discover', 'Discover'),
        ('diners', 'Diners Club'),
        ('other', 'Outro'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='payment_methods')

    # Payment provider data (we'll store only non-sensitive references)
    provider_customer_id = models.CharField(max_length=255, help_text="Customer ID from payment provider")
    provider_payment_method_id = models.CharField(max_length=255, help_text="Payment method ID from payment provider")

    # Non-sensitive card information for display
    card_brand = models.CharField(max_length=20, choices=CARD_BRANDS)
    card_last_four = models.CharField(max_length=4, help_text="Last 4 digits of the card")
    card_exp_month = models.IntegerField(help_text="Card expiration month")
    card_exp_year = models.IntegerField(help_text="Card expiration year")

    # Status and metadata
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.get_card_brand_display()} ****{self.card_last_four} - {self.company.name}"

    def save(self, *args, **kwargs):
        # If this is being set as default, unset all other defaults for this company
        if self.is_default:
            PaymentMethod.objects.filter(company=self.company, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)