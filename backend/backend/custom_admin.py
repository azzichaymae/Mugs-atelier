from django.contrib.admin import AdminSite
class CustomAdminSite(AdminSite): 
     site_header = "Mugs Atelier Admin " 
     site_title = "Admin Portal" 
     index_title = ""
     
custom_admin_site = CustomAdminSite(name='custom_admin')
