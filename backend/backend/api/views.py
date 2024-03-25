from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from .models import *
from .serialzers import *
import json
import random
import time
import datetime
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.decorators import api_view, permission_classes
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.admin.views.decorators import user_passes_test
import paypalrestsdk


class ProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductViewPK(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "pk"


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryViewPK(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "pk"


class ReviewView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class CartView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        user = self.request.user
        print(user)
        cart = Cart.objects.get(email=user)
        return cart


class LoginThrottle(SimpleRateThrottle):
    scope = "login_throttle"

    def get_cache_key(self, request, view):
        if request.method == "POST":
            ident = self.get_ident(request)
            return self.cache_format % {"scope": self.scope, "ident": ident}


class CustomTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [LoginThrottle]


class UserRegistrationViewOld(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CurrentUserSerializer


@method_decorator(
    ratelimit(key="ip", rate="1/m", method="POST", block=True), name="dispatch"
)
class UserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewViewPK(generics.RetrieveAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    lookup_field = "pk"

    def get_object(self):
        pk = self.kwargs.get("pk")

        return Review.objects.get(product=pk)


class AddCartView(generics.GenericAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product_id")
        product = get_object_or_404(Product, id=product_id)

        cart, created = Cart.objects.get_or_create(email=user)
        if not created and product not in cart.product.all():
            cart.product.add(product)
            return Response(
                {"status": "product added to existing cart"}, status=status.HTTP_200_OK
            )
        elif created:
            cart.product.add(product)
            return Response(
                {"status": "new cart created and product added"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"status": "product already in cart"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DeleteCartView(generics.GenericAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product_id")
        product = get_object_or_404(Product, id=product_id)

        try:
            cart = Cart.objects.get(email=user)
            if product in cart.product.all():
                cart.product.remove(product)
                return Response(
                    {"status": "Product removed from cart"},
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"error": "Product not found in cart"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND
            )


class AddReviewView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_review_view(request):
    user_id = request.user.id
    reviews = Review.objects.filter(email=user_id)
    resp = []
    for item in reviews:
        resp.append(
            {
                "text": item.text,
                "stars": item.stars,
                "product": item.product.id,
                "product_name": item.product.name,
            }
        )
    return Response(resp)


@api_view(["GET"])
def stars_view(request, pk):
    product = Product.objects.get(pk=pk)
    reviews = Review.objects.filter(product=product)
    star_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for review in reviews:
        if review.stars in star_counts:
            star_counts[review.stars] += 1
    largest_value_star = max(star_counts, key=star_counts.get)
    largest_value_count = star_counts[largest_value_star]
    response_data = {"star_rating": largest_value_star, "count": largest_value_count}
    return Response(response_data)


@method_decorator(
    ratelimit(key="ip", rate="1/m", method="POST", block=True), name="dispatch"
)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


@method_decorator(
    ratelimit(key="ip", rate="2/m", method="GET", block=True), name="dispatch"
)
class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = EditProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddProductView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class DeleteProductView(generics.DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "pk"


class EditProductView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "pk"


class LockedProfileView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk, format=None):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = LockedProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountsView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = AccountSerializer


class CurrentUserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


class EditCategoryView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk, format=None):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddCategoryView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@method_decorator(
    ratelimit(key="ip", rate="5/m", method="GET", block=True), name="dispatch"
)
class AddPaidView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Paid.objects.all()
    serializer_class = PaidSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_paid_view(request):
    user_id = request.user.id
    paids = Paid.objects.filter(email=user_id)
    resp = []
    for item in paids:
        resp.append(
            {
                "id_product": item.product.id,
                "price": item.product.price,
                "product_name": item.product.name,
            }
        )
    return Response(resp)


def admin_required(view_func):
    decorated_view_func = user_passes_test(
        lambda u: u.is_active and u.is_superuser,
        login_url="https://www.zyll.shop/login",
        redirect_field_name=None,
    )(view_func)
    return decorated_view_func


class VerifyPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        order_id = data.get("orderID")

        paypalrestsdk.configure(
            {
                "mode": "sandbox",  # sandbox or live
                "client_id": "AUA4GvhFzTYHrGimYKaPYEOAo1R4GNAEmKY0EEKt7pRQvkKqyQYWEUuDIW7foKuGXuDsxfOmAlWiwioD",
                "client_secret": "EMoa-mujOVPjbt19VXqRHUsYT0Sp1q2Zu5mhW344koZT5KEAID_zAMJKgm9PMmzOXpwnj28SNWoWJ5Oi",
            }
        )

        payment = paypalrestsdk.Payment.find(order_id)

        if payment.execute({"payer_id": payment.payer.payer_info.payer_id}):
            # Payment successfully executed
            # Here, implement your logic (e.g., update order status, send confirmation email)
            return JsonResponse(
                {"status": "Success", "message": "Payment verified successfully."}
            )
        else:
            # Payment execution failed
            return JsonResponse(
                {"status": "Failed", "message": "Payment verification failed."}
            )
