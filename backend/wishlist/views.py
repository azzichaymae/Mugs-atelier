from django.shortcuts import render

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Wishlist
from users.models import User
from store.models import Product
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_wishlist(request, user_id):
    user = get_object_or_404(User, id=user_id)
    wishlist_items = Wishlist.objects.filter(user=user).select_related('product')
    wishlist_data = [
        {
            'id': item.     id,
            "product_id": item.product.id,
            "product_name": item.product.name,
            "added_at": item.created_at.strftime('%Y-%m-%d %H:%M:%S'),
               "product_image": item.product.image.url if item.product.image else None,
            "product_price": item.product.price,
               "product_description": item.product.description,
               "stock": "Out of Stock" if item.product.stock == 0 else "In Stock",
               "product": {
            "id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "description": item.product.description,
            "image": item.product.image.url if item.product.image else None,
            "stock": item.product.stock,
        }
               
        }
        for item in wishlist_items
    ]

    return JsonResponse({"wishlist": wishlist_data}, safe=False)


@api_view(['POST'])
def add_to_wishlist(request, user_id, product_id):
   
    user = get_object_or_404(User, id=user_id)
    product = get_object_or_404(Product, id=product_id)

    # Check if the item already exists in the wishlist
    if Wishlist.objects.filter(user=user, product=product).exists():
        return JsonResponse({"message": "Product already in wishlist"}, status=400)

    # Add item to wishlist
    wishlist_item = Wishlist.objects.create(user=user, product=product)
    
    return JsonResponse({
        "message": "Product added to wishlist",
        "wishlist_id": wishlist_item.id,
        "product_name": product.name,
     
        
    })
    
@api_view(['DELETE'])
def clear_wishlist(request, user_id):
    user = get_object_or_404(User, id=user_id)
    Wishlist.objects.filter(user=user).delete()
    return JsonResponse({"message": "Wishlist cleared successfully."}, status=200)

@api_view(['DELETE'])
def delete_wishlist_item(request, item_id,user_id):
    user = get_object_or_404(User, id=user_id)
    wishlist_item = get_object_or_404(Wishlist, id=item_id, user=user)
    wishlist_item.delete()
    return JsonResponse({"message": "Wishlist item deleted successfully"}, status=200)