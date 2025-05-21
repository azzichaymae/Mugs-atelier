from django.contrib.auth import authenticate, login
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework_simplejwt.tokens import RefreshToken
import json
from users.models import User

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        
        user = User.objects.get(email=email)    
        
        if(user and user.password == password ):

                return JsonResponse({
                    'user': {
                        'id': user.id,
                        'email': user.email
                    }
                })
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
        
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def user_register(request):
    email = request.data.get('emailRegister')
    password = request.data.get('passwordSignup')
    name = request.data.get('name')
    try:
        user = User(email=email, password=password, name=name)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered'}, status=400)
        user = User(email=email, name=name, password=password)
        user.save()
        return JsonResponse({'id': user.id, 'email': user.email, 'name': user.name}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def find_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user_data = {
            'id': user.id,
            'password': user.password,
            'email': user.email,
            'name': user.name,
            'address' : user.address,
            'phone_number' : user.phone_number

        }
        return JsonResponse(user_data)
    except User.DoesNotExist:
        raise Http404("User does not exist")
@api_view(['POST'])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if request.method == 'POST':
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)

            # Update fields only if they are provided in the request
            if 'name' in data:
                user.name = data['name']
            if 'email' in data:
                user.email = data['email']
            if 'phone_number' in data:
                user.phone_number = data['phone_number']
            if 'address' in data:
                user.address = data['address']
            if 'new_password' in data and data['new_password']:  # Only update password if provided and non-empty
                user.password = make_password(data['new_password'])

            user.save()
            return JsonResponse({'message': 'User updated successfully'}, status=200)

    except User.DoesNotExist:
        raise Http404("User does not exist")
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
