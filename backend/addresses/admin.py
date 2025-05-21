from django.contrib import admin

# Register your models here.
from .models import Address

class AddressAdmin(admin.ModelAdmin):
     list_display = ['user', 'street', 'city', 'postal_code', 'country' , 'address_type']
     list_filter = ['user', 'address_type']
     search_fields = ['street', 'city', 'postal_code', 'country']
     ordering = ['user']
    
    
from backend.custom_admin import custom_admin_site
custom_admin_site.register(Address, AddressAdmin)