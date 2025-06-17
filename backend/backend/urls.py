from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from backend.custom_admin import custom_admin_site  

urlpatterns = [
    
    path('', include('users.urls')),
    path('products/', include('store.urls')),
    path('', include('addresses.urls')),
    path('admin/', custom_admin_site.urls),
    path('', include('cart.urls')),
    path('', include('wishlist.urls')),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)