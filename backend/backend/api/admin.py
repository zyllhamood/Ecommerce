from django.contrib import admin
from .models import *
from .views import admin_required

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(Profile)
admin.site.register(ProductImage)
admin.site.register(Paid)
admin.site.login = admin_required(admin.site.login)
