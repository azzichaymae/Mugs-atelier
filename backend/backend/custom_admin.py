# store/custom_admin.py
from django.contrib.admin import AdminSite

class CustomAdminSite(AdminSite):
    site_header = "Mugs Atelier Admin"
    site_title = "Mugs Atelier Admin Portal"
    index_title = "Welcome to Mugs Atelier Admin"

custom_admin_site = CustomAdminSite(name='custom_admin')