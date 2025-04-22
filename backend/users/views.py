from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        
        user = User.objects.get(email=email)    
        
        if(user and user.password == password ):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': user.id,
                        'email': user.email
                    }
                })
        return Response({'error': 'Invalid credentials'}, status=400)
        
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def user_register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    try:
        user = User(email=email, password=password, name=name)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered'}, status=400)
        user = User(email=email, name=name, password=password)
        user.save()
        return JsonResponse({'id': user.id, 'email': user.email, 'name': user.name}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
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