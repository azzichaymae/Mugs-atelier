from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view

from users.models import User
from addresses.models import Address  
# Create your views here.

def AddressListView(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    print(type(user))
    addresses = Address.objects.filter(user=user)
    address_list = list(addresses.values('id', 'street', 'city', 'postal_code', 'country', 'state', 'address_type'))
    return JsonResponse(address_list, safe=False)
@api_view(['POST'])
def AddressCreateView(request, user_id):
     if request.method == 'POST':
          user = get_object_or_404(User, id=user_id)
          data = request.POST
          address = Address.objects.create(
               user=user,
               street=data.get('street'),
               city=data.get('city'),
               postal_code=data.get('postal_code'),
               country=data.get('country'),
               state=data.get('state', ''),
               address_type=data.get('address_type', 'home')
          )
          return JsonResponse({'id': address.id, 'message': 'Address created successfully'}, status=201)
     return JsonResponse({'error': 'Invalid request method'}, status=400)

def AddressUpdateView(request, user_id, id):
     if request.method == 'PUT':
          user = get_object_or_404(User, id=user_id)
          address = get_object_or_404(Address, id=id, user=user)
          data = request.PUT
          address.street = data.get('street', address.street)
          address.city = data.get('city', address.city)
          address.postal_code = data.get('postal_code', address.postal_code)
          address.country = data.get('country', address.country)
          address.state = data.get('state', address.state)
          address.address_type = data.get('address_type', address.address_type)
          address.save()
          return JsonResponse({'message': 'Address updated successfully'}, status=200)
     return JsonResponse({'error': 'Invalid request method'}, status=400)

def AddressDeleteView(request, user_id, id):
     if request.method == 'DELETE':
          user = get_object_or_404(User, id=user_id)
          address = get_object_or_404(Address, id=id, user=user)
          address.delete()
          return JsonResponse({'message': 'Address deleted successfully'}, status=200)
     return JsonResponse({'error': 'Invalid request method'}, status=400)