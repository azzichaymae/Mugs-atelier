# urls.py

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list),
    path('category', views.category_list),
    path('product/<int:product_id>/', views.find_product_by_id),
    path('<int:product_id>/rate/', views.submit_rating, name='submit-rating'),
    path('<int:product_id>/ratings/', views.get_product_ratings, name='product-ratings'),
    path('<int:product_id>/images/', views.get_secondary_images, name='product-imagess'),
    # path('ratings', views.ratings_list, name='all-ratings'),

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


