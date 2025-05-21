from django.urls import path
from . import views
urlpatterns = [
    path("checkout/", views.CheckoutView, name="checkout"),
    path("orders/", views.user_orders_view, name="orders"),
    path("orders/<int:order_id>/delete/", views.delete_order_view, name="delete_order"),
]