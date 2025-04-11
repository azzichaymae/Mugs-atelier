from django.http import JsonResponse
from django.shortcuts import render

from store.models import Category, Product

# Create your views here.
def product_list(request):
     products = Product.objects.all()
     product_data = []
     for product in products:
          product_data.append({
               'id': product.id,
               'name': product.name,
               'description': product.description,
               'price': product.price,
               'stock': product.stock,  # Add stock information
               'image': product.image.url if product.image else None,  # Handle case when there's no image
               'category': product.id_category.name if product.id_category else None,  # ForeignKey to Category model
        })
     return JsonResponse(product_data, safe=False)

def category_list(request):
     categories = Category.objects.all()
     category_data = []
     for category in categories:
          category_data.append({
               'id': category.id,
               'name': category.name,
               'description': category.description,
        })
     return JsonResponse(category_data, safe=False)
