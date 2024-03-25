from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# class ProductSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Product
#         fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image_link"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    image_link = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "images", "image_link"]

    def get_image_link(self, obj):
        # Attempt to fetch the first image related to the product
        first_image = obj.images.first()
        # Return the image link if an image exists, else None
        return first_image.image_link if first_image else None

    def create(self, validated_data):
        images_data = validated_data.pop("images", None)
        product = Product.objects.create(**validated_data)
        if images_data:
            for image_data in images_data:
                ProductImage.objects.create(product=product, **image_data)
        return product


class ReviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = "__all__"

    def get_name(self, obj):
        return obj.email.first_name


class CategorySerializer(serializers.ModelSerializer):
    product_ids = serializers.ListField(
        write_only=True, source="products", child=serializers.IntegerField()
    )

    class Meta:
        model = Category
        fields = "__all__"

    def update(self, instance, validated_data):
        # Handling products separately due to ManyToMany relationship

        if "products" in validated_data:
            product_ids = validated_data.pop("products")
            instance.products.clear()  # Remove all existing products from the category
            for product_id in product_ids:
                product = Product.objects.get(id=product_id)
                instance.products.add(product)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class EditProfileSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)

    def update(self, instance, validated_data):
        # Update User model fields
        instance.user.username = validated_data.get("username", instance.user.username)
        instance.user.first_name = validated_data.get(
            "first_name", instance.user.first_name
        )
        instance.user.email = validated_data.get("email", instance.user.email)
        instance.user.save()

        # Update Profile model fields
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )
        instance.save()

        return instance


class LockedProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["locked"]


class AccountSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source="profile.phone_number")
    locked = serializers.BooleanField(source="profile.locked")
    name = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(
        source="date_joined", format="%Y-%m-%d %H:%M:%S"
    )

    class Meta:
        model = User
        fields = ["id", "username", "name", "created_at", "phone_number", "locked"]

    def get_name(self, obj):
        """Combine first name and last name into a single full name"""
        return f"{obj.first_name}".strip()


class CurrentUserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source="profile.phone_number")
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "name", "phone_number", "is_superuser"]

    def get_name(self, obj):
        """Combine first name and last name into a single full name"""
        return f"{obj.first_name}".strip()


class UserRegistrationSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "password", "phone_number"]

    def create(self, validated_data):
        phone_number = validated_data.pop("phone_number", None)
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            password=validated_data["password"],
        )
        # Explicitly check for phone_number to ensure it's not None
        if phone_number:
            profile, created = Profile.objects.update_or_create(
                user=user, defaults={"phone_number": phone_number}
            )
        return user


class PaidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paid
        fields = "__all__"
