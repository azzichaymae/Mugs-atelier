# views.py
from django.http import JsonResponse
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import User
from .models import Order, OrderItem
from addresses.models import Address
from store.models import Product
import json
import logging

# Set up logging
logger = logging.getLogger(__name__)
@api_view(['POST'])
def CheckoutView(request):

    try:
        
        user_id = int(request.data.get("user"))  
        cart_items = request.data.get("cart_items", [])
        address_id = request.data.get("address_id")
        total_amount = request.data.get("total_amount")
        shipping_cost = request.data.get("shipping_cost", 10.00)  


        # Validate user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Invalid user_id: User does not exist"},
                status=400
            )

        # Validate address
        try:
            address = Address.objects.get(id=address_id, user=user)
        except Address.DoesNotExist:
            return JsonResponse(
                {"error": "Invalid address selected or address does not belong to the user"},
                status=400
            )

        # Validate cart items (basic check for required fields)
        for item in cart_items:
            if not all(key in item for key in ["product_id", "product_name", "quantity", "price"]):
                return JsonResponse(
                    {"error": "Invalid cart item format"},
                    status=400
                )

        # Create the order
        try:
            order = Order.objects.create(
                user=user,
                address=address,
                total_price=float(total_amount),
                shipping_cost=float(shipping_cost),
                created_at=timezone.now(),
                status="Pending"
            )
            print("Order created successfully:", order)
        except Exception as e:
            print(f"Error creating order: {e}")
            return JsonResponse({"error": str(e)}, status=500)

        # Create order items
        for item in cart_items:
            product = Product.objects.get(id=item["product_id"])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price=float(item["price"])
            )
        return JsonResponse({"message": "Order placed successfully!", "order_id": order.id}, status=201)

    except ValueError as e:
        return JsonResponse({"error": f"Invalid data format: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)    
@api_view(['GET'])
def user_orders_view(request):

    user_id = request.GET.get("user_id")
    
    # Validate user_id
    if not user_id or not user_id.isdigit():
        return Response({"error": "Invalid user ID"}, status=400)

    user = get_object_or_404(User, id=int(user_id))
    orders = Order.objects.filter(user=user).order_by('-created_at')

    order_list = [
        {
            "order_id": order.id,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "status": order.status,
            "total_price": str(order.total_price),
            "shipping_cost": str(order.shipping_cost),
            "address": str(order.address),
            "items": [
                {
                    "product_name": item.product.name if item.product else "Unknown Product",
                    "quantity": item.quantity,
                    "price": str(item.price),
                }
                for item in order.items.all()  # Access related OrderItems
            ],
        }
        for order in orders
    ]

    return Response({"orders": order_list})

@api_view(['DELETE'])
def delete_order_view(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    if order.status != "Delivered":
        return Response({"error": "You can only delete delivered orders."}, status=403)

    order.delete()
    return Response({"message": "Order deleted successfully."}, status=200)
