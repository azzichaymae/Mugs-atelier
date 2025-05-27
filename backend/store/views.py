from django.http import JsonResponse, Http404
from django.db import models
from django.conf import settings
from django.shortcuts import render
import json
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from users.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication

from store.models import Category, Product
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Product, Rating, SecondaryImage


# Removed unused import as rest_framework_jwt is deprecated and not installed

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
               'stock': product.stock,  
                'image': product.image.url if product.image else None,
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
def find_product_by_id(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product_data = {
          'id': product.id,
          'name': product.name,
          'description': product.description,
          'price': product.price,
          'stock': product.stock,  # Add stock information
          'image': product.image.url if product.image else None,  # Handle case when there's no image
          'category': product.id_category.name if product.id_category else None,  # ForeignKey to Category model

        }
        return JsonResponse(product_data)
    except Product.DoesNotExist:
        raise Http404("User does not exist")



from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def submit_rating(request, product_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

    try:
        data = json.loads(request.body)
        value = data.get('rating')
        review = data.get('review', '')
        user_id = data.get('user')  
        
        if not isinstance(value, int) or value < 1 or value > 5:
            return JsonResponse({'error': 'Rating must be an integer between 1 and 5'}, status=400)

        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return JsonResponse({'error': 'Invalid user ID'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        # Check if the user already rated this product
        rating = Rating.objects.filter(user=user, product=product).first()
        if rating:
            rating.value = value
            rating.review = review
            rating.save()
        else:
            rating = Rating.objects.create(user=user, product=product, value=value, review=review)

        return JsonResponse({
            'id': rating.id,
            'user': user.email,
            'product': product_id,
            'value': value,
            'review': review,
            'created_at': rating.created_at.isoformat()
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)



def get_product_ratings(request, product_id):
    if request.method == 'GET':
        try:
            product = Product.objects.get(id=product_id)
            ratings = list(Rating.objects.filter(product=product).values(
                'id', 'user__email', 'value', 'review', 'created_at'
            ))
            return JsonResponse({
                'product_id': product_id,
                'average_rating': product.average_rating,
                'ratings': ratings
            })
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# def ratings_list(request):
#     if request.method == 'GET':
#         top_rated_products = Product.objects.annotate(average_rating=models.Avg('rating__value')).order_by('-average_rating')[:3]
#         product_data = []
#         for product in top_rated_products:
#             product_data.append({
#             'id': product.id,
#             'name': product.name,
#             'description': product.description,
#             'price': product.price,
#             'stock': product.stock,
#             'image': product.image.url if product.image else None,
#             'category': product.id_category.name if product.id_category else None,
#             'average_rating': product.average_rating
#             })
#         return JsonResponse(product_data, safe=False)
def get_secondary_images(request, product_id):
    if request.method == 'GET':
        try:
            product = Product.objects.get(id=product_id)
            secondary_images = SecondaryImage.objects.filter(product=product).values('id', 'image')
            # Modify the image paths to include the full MEDIA_URL
            secondary_images_list = list(secondary_images)
            for img in secondary_images_list:
                img['image'] = f"{settings.MEDIA_URL}{img['image']}"  
            return JsonResponse({'secondary_images': secondary_images_list})
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
@csrf_exempt       
def set_stock(request, product_id):
    if request.method == 'POST':
        try:
            product = Product.objects.get(id=product_id)
            data = json.loads(request.body)
            
            quantity = data.get('quantity')
            if quantity is not None and isinstance(quantity, int) and quantity > 0 and quantity <= product.stock:
                product.stock -= quantity
                product.save()
                return JsonResponse({'message': 'Stock updated successfully'})
            else:
                return JsonResponse({'error': 'Invalid stock value'}, status=400)
         
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
