from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user),
    path('register/', views.user_register),
    path('find/<int:user_id>/', views.find_user_by_id)
   
]