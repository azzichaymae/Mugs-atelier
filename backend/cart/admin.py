from django.contrib import admin

# Register your models here.

from .models import Order, OrderItem

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'ordered', 'order_date']
    list_filter = ['user', 'ordered']
    search_fields = ['user__email']
    ordering = ['-order_date']
    
    
class OrderItemAdmin(admin.ModelAdmin):
     list_display = ['user', 'ordered', 'order_date']
     list_filter = ['user', 'ordered']
     search_fields = ['user__email']
     ordering = ['-order_date']
     

from backend.custom_admin import custom_admin_site
custom_admin_site.register(Order)
custom_admin_site.register(OrderItem)