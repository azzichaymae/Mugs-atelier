from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import User
from addresses.models import Address  
# Create your views here.

def AddressListView(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    
    addresses = Address.objects.filter(user=user)
    address_list = list(addresses.values('id', 'street', 'city', 'postal_code', 'country', 'address_type'))
    return JsonResponse(address_list, safe=False)
@api_view(['POST'])
def AddressCreateView(request, user_id):
     if request.method == 'POST':
          user = get_object_or_404(User, id=user_id)
          data = request.data
          address = Address.objects.create(
               user=user,
               street=data.get('street'),
               city=data.get('city'),
               postal_code=data.get('postal_code'),
               country=data.get('country'),
              
               address_type=data.get('address_type', 'home')
          )
          return JsonResponse({'id': address.id, 'message': 'Address created successfully'}, status=201)
     return JsonResponse({'error': 'Invalid request method'}, status=400)

@api_view(['PUT'])
def AddressUpdateView(request, user_id, id):
    user = get_object_or_404(User, id=user_id)
    address = get_object_or_404(Address, id=id, user=user)
    data = request.data  # Use request.data instead of request.PUT
    address.street = data.get('street', address.street)
    address.city = data.get('city', address.city)
    address.postal_code = data.get('postal_code', address.postal_code)
    address.country = data.get('country', address.country)
    address.address_type = data.get('address_type', address.address_type)
    address.save()
    return Response({'message': 'Address updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def AddressDeleteView(request, user_id, id):
     if request.method == 'DELETE':
          user = get_object_or_404(User, id=user_id)
          address = get_object_or_404(Address, id=id, user=user)
          address.delete()
          return JsonResponse({'message': 'Address deleted successfully'}, status=200)
     return JsonResponse({'error': 'Invalid request method'}, status=400)