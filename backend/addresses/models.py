from django.db import models
from users.models import User

class Address(models.Model):
     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
     street = models.CharField(max_length=255)
     city = models.CharField(max_length=100)
     postal_code = models.CharField(max_length=20)
     country = models.CharField(max_length=100)
     state = models.CharField(max_length=100, blank=True, null=True)
     address_type = models.CharField(
        max_length=50, 
        choices=[('home', 'Home'), ('office', 'Office'), ('other', 'Other')],
        default='home'
    )

     def __str__(self):
        return f"{self.street}, {self.city}, {self.country} - {self.postal_code}"

  
