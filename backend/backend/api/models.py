from django.db import models
from django.contrib.auth.models import User
import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    locked = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


# Signal to create or update the user profile automatically
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()


# class Product(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField()
#     price = models.DecimalField(decimal_places=2, max_digits=12)
#     image_link = models.URLField(blank=True)

#     def __str__(self):
#         return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(decimal_places=2, max_digits=12)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    image_link = models.URLField()

    def __str__(self):
        return self.image_link


class Cart(models.Model):
    product = models.ManyToManyField(Product, blank=True)
    email = models.OneToOneField(User, on_delete=models.CASCADE)


class Review(models.Model):
    email = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews"
    )
    stars = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.datetime.now())
    text = models.TextField()

    def __str__(self):
        return self.email.username


class Category(models.Model):
    name = models.CharField(max_length=255)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return self.name


class Paid(models.Model):
    email = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(default=datetime.datetime.now())
