from django.contrib import admin
from .models import Product, Category, SecondaryImage

def mark_out_of_stock(modeladmin, request, queryset):
    queryset.update(stock=0)
mark_out_of_stock.short_description = "Mark selected products as out of stock"

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price']
    list_filter = ['name']
    search_fields = ['name']
    ordering = ['name']
    actions = [mark_out_of_stock]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    list_filter = ['name']
    search_fields = ['name']
    ordering = ['name']
    
class SecondaryImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image']
    list_filter = ['product']
    search_fields = ['product__name']  # Use the related field for searching
    ordering = ['product']
    
# Register with the custom admin site
from backend.custom_admin import custom_admin_site  # Updated import
custom_admin_site.register(Product, ProductAdmin)
custom_admin_site.register(Category, CategoryAdmin)
custom_admin_site.register(SecondaryImage, SecondaryImageAdmin)