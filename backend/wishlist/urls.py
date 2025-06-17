
from django.urls import path
from .views import add_to_wishlist
from .views import get_wishlist
from . import views


urlpatterns = [
    path('wishlist/add/<int:user_id>/<int:product_id>/', add_to_wishlist, name='wishlist-add'),
    path('wishlist/<int:user_id>/', get_wishlist, name='wishlist-view'),
    path('wishlist/<int:item_id>/<int:user_id>/delete/', views.delete_wishlist_item, name='delete_wishlist_item'),
    path('wishlist/<int:user_id>/clear/', views.clear_wishlist, name='clear_wishlist'),

]
