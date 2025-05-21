from django.contrib import admin

# Register your models here.
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email']
    list_filter = ['name']
    search_fields = ['name']
    ordering = ['name']
    
    
from backend.custom_admin import custom_admin_site
custom_admin_site.register(User, UserAdmin)