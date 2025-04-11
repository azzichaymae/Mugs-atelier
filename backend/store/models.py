from django.db import models

# Create your models here.
class Category(models.Model):
     name = models.CharField(max_length=30)
     description = models.CharField(max_length=255)
     def __str__(self):
        return self.name
     
class Product(models.Model):
     name = models.CharField(max_length=30)
     description = models.CharField(max_length=255)
     price = models.FloatField()
     id_category = models.ForeignKey(Category, on_delete=models.CASCADE)
     stock = models.IntegerField(default=0)
     image = models.ImageField(upload_to='images/')
     def __str__(self):
        return self.name
          