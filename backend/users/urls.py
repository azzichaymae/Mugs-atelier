from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user),
    path('register/', views.user_register)
   
]