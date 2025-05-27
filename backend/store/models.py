from django.db import models

from users.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
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
     image = models.ImageField(upload_to='images', null=True, blank=True)
    
     def __str__(self):
        return self.name
     @property
     def average_rating(self):
        ratings = self.ratings.all()
        if ratings.exists():
            return sum(rating.value for rating in ratings) / ratings.count()
        return 0
    
     
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='ratings', on_delete=models.CASCADE)
    value = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]  # 1 to 5 stars
    )
    review = models.TextField(blank=True, null=True)  # Optional review text
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Prevent multiple ratings by the same user for a product

    def __str__(self):
        return f"{self.user.username} rated {self.product.name} {self.value} stars"
    
class SecondaryImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='secondary')
    def __str__(self):
        return self.product.name
