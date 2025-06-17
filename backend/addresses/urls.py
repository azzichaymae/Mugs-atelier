from django.urls import path
from . import views

urlpatterns = [
    # URL for viewing all addresses of a user
    path('user/<int:user_id>/addresses/', views.AddressListView, name='user_address_list'),
    
    # URL for creating a new address for a user
    path('user/<int:user_id>/addresses/new/', views.AddressCreateView , name='user_address_create'),
    
 
    path('user/<int:user_id>/addresses/<int:id>/edit/', views.AddressUpdateView , name='user_address_edit'),
    
    # URL for deleting an address of a user
    path('user/<int:user_id>/addresses/<int:id>/delete/', views.AddressDeleteView, name='user_address_delete'),
]
