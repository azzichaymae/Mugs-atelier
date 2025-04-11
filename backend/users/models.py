from django.db import models

# Create your models here.

class User(models.Model):
    
     password = models.CharField(max_length=30)
     email = models.EmailField(unique=True)
     USERNAME_FIELD = 'email'
     name = models.CharField(max_length=30,default="")
     address = models.CharField(max_length=50,default="")
     phone_number = models.CharField(max_length=15,default="")

